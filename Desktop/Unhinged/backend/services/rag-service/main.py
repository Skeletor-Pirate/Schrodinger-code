import os
import json
import asyncio
from pathlib import Path
from typing import List, Dict, Any, Optional
import logging
from datetime import datetime
import uuid

from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import numpy as np
from rank_bm25 import BM25Okapi

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(title="UNHINGED RAG Service", description="Retrieval-Augmented Generation service for Obsidian vault")

# Configuration
VAULT_PATH = os.getenv("VAULT_PATH", "./vault")
COLLECTION_NAME = os.getenv("RAG_COLLECTION", "unhinged_vault")
EMBEDDING_MODEL_NAME = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")  # Default sentence-transformers model
CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", "1000"))
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", "200"))
TOP_K = int(os.getenv("TOP_K", "5"))

# Initialize embedding model
try:
    logger.info(f"Loading embedding model: {EMBEDDING_MODEL_NAME}")
    embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME)
    logger.info("Embedding model loaded successfully")
except Exception as e:
    logger.error(f"Failed to load embedding model: {e}")
    raise

# Initialize Chroma client
try:
    logger.info("Initializing Chroma client")
    chroma_client = chromadb.Client(Settings(
        anonymized_telemetry=False,
        is_persistent=True,
        persist_directory="/app/chroma_db"
    ))
    collection = chroma_client.get_or_create_collection(name=COLLECTION_NAME)
    logger.info("Chroma client initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize Chroma client: {e}")
    raise

# Initialize text splitter
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=CHUNK_SIZE,
    chunk_overlap=CHUNK_OVERLAP,
    length_function=len,
    separators=["\n\n", "\n", ". ", " ", ""]
)

# Global variables for BM25 (we'll rebuild the index periodically or on update)
bm25_index = None
bm25_documents = []  # List of document texts for BM25
bm25_metadata = []   # List of metadata for each document chunk

# Pydantic models
class QueryRequest(BaseModel):
    query: str
    top_k: Optional[int] = TOP_K

class QueryResponse(BaseModel):
    results: List[Dict[str, Any]]

class DocumentAddRequest(BaseModel):
    content: str
    metadata: Optional[Dict[str, Any]] = None

# Helper functions
def get_embedding(text: str) -> List[float]:
    """Get embedding for a text string."""
    return embedding_model.encode(text).tolist()

def chunk_text(text: str) -> List[str]:
    """Split text into chunks."""
    return text_splitter.split_text(text)

def update_bm25_index():
    """Update the BM25 index with current documents."""
    global bm25_index, bm25_documents
    if bm25_documents:
        tokenized_docs = [doc.lower().split() for doc in bm25_documents]
        bm25_index = BM25Okapi(tokenized_docs)
    else:
        bm25_index = None

def add_document_chunks(chunks: List[str], metadata_list: List[Dict[str, Any]]):
    """Add chunks to the vector store and update BM25 index."""
    global bm25_documents, bm25_metadata

    # Generate embeddings
    embeddings = [get_embedding(chunk) for chunk in chunks]

    # Prepare data for Chroma
    ids = [str(uuid.uuid4()) for _ in range(len(chunks))]

    # Add to Chroma collection
    collection.add(
        embeddings=embeddings,
        documents=chunks,
        metadatas=metadata_list,
        ids=ids
    )

    # Update BM25 documents and metadata
    bm25_documents.extend(chunks)
    bm25_metadata.extend(metadata_list)

    # Update BM25 index
    update_bm25_index()

    logger.info(f"Added {len(chunks)} chunks to the index")

def delete_document_chunks(ids: List[str]):
    """Delete chunks from the vector store by IDs."""
    # Note: In a real implementation, we would need to map file paths to chunk IDs.
    # For simplicity, we are not implementing deletion by ID in this example.
    # We would need to store the mapping from file to chunk IDs.
    logger.warning("Deletion by ID not fully implemented in this example")
    pass

# File system event handler
class VaultChangeHandler(FileSystemEventHandler):
    def __init__(self):
        super().__init__()
        try:
            self.loop = asyncio.get_running_loop()
        except RuntimeError:
            # If there's no running loop, get the event loop for the current thread
            self.loop = asyncio.get_event_loop()

    def on_created(self, event):
        if not event.is_directory and event.src_path.endswith('.md'):
            asyncio.run_coroutine_threadsafe(self.process_file(event.src_path), self.loop)

    def on_modified(self, event):
        if not event.is_directory and event.src_path.endswith('.md'):
            asyncio.run_coroutine_threadsafe(self.process_file(event.src_path), self.loop)

    def on_deleted(self, event):
        if not event.is_directory and event.src_path.endswith('.md'):
            # Handle deletion: we would need to remove the chunks for this file
            # For simplicity, we skip deletion in this example
            logger.info(f"File deleted: {event.src_path}")
            pass

    async def process_file(self, file_path: str):
        """Process a single markdown file."""
        try:
            logger.info(f"Processing file: {file_path}")
            # Read the file
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Get relative path from vault root
            vault_path = Path(VAULT_PATH).resolve()
            file_path_obj = Path(file_path).resolve()
            relative_path = file_path_obj.relative_to(vault_path)

            # Chunk the content
            chunks = chunk_text(content)

            # Prepare metadata for each chunk
            metadata_list = []
            for i, chunk in enumerate(chunks):
                metadata_list.append({
                    "source": str(relative_path),
                    "chunk_index": i,
                    "timestamp": datetime.now().isoformat(),
                    "file_path": str(file_path)
                })

            # Add to index
            add_document_chunks(chunks, metadata_list)

            logger.info(f"Processed and indexed {len(chunks)} chunks from {relative_path}")
        except Exception as e:
            logger.error(f"Error processing file {file_path}: {e}")

# Start the file system watcher
def start_file_watcher():
    # Check if vault path exists and is a directory
    vault_path = Path(VAULT_PATH)
    if not vault_path.exists():
        logger.warning(f"Vault path does not exist: {VAULT_PATH}")
        return None
    if not vault_path.is_dir():
        logger.warning(f"Vault path is not a directory: {VAULT_PATH}")
        return None

    event_handler = VaultChangeHandler()
    observer = Observer()
    observer.schedule(event_handler, VAULT_PATH, recursive=True)
    observer.start()
    logger.info(f"Started file watcher on {VAULT_PATH}")
    return observer

# We'll start the watcher in a background task when the app starts
@app.on_event("startup")
async def startup_event():
    logger.info("Starting RAG service...")
    # Start the file watcher in a background thread
    global file_observer
    file_observer = start_file_watcher()
    # Also, we can do an initial scan of the vault
    await initial_scan()

async def initial_scan():
    """Perform an initial scan of the vault to index all existing markdown files."""
    logger.info("Performing initial scan of the vault...")
    vault_path = Path(VAULT_PATH)
    if not vault_path.exists():
        logger.warning(f"Vault path does not exist: {VAULT_PATH}")
        return
    if not vault_path.is_dir():
        logger.warning(f"Vault path is not a directory: {VAULT_PATH}")
        return

    markdown_files = list(vault_path.rglob("*.md"))
    logger.info(f"Found {len(markdown_files)} markdown files to process")

    for md_file in markdown_files:
        # Process each file
        try:
            with open(md_file, 'r', encoding='utf-8') as f:
                content = f.read()

            relative_path = md_file.relative_to(vault_path)
            chunks = chunk_text(content)

            metadata_list = []
            for i, chunk in enumerate(chunks):
                metadata_list.append({
                    "source": str(relative_path),
                    "chunk_index": i,
                    "timestamp": datetime.now().isoformat(),
                    "file_path": str(md_file)
                })

            add_document_chunks(chunks, metadata_list)
            logger.info(f"Indexed {len(chunks)} chunks from {relative_path}")
        except Exception as e:
            logger.error(f"Error processing file {md_file}: {e}")

    logger.info("Initial scan completed")

# API Endpoints
@app.get("/")
async def root():
    return {"message": "UNHINGED RAG Service is running"}

@app.post("/query", response_model=QueryResponse)
async def query_documents(request: QueryRequest):
    """Query the RAG service for relevant documents."""
    try:
        query_text = request.query
        top_k = request.top_k or TOP_K

        # Get query embedding
        query_embedding = get_embedding(query_text)

        # Query Chroma for vector search
        vector_results = collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            include=["documents", "metadatas", "distances"]
        )

        # If we have BM25 index, we can do hybrid search
        # For simplicity, we'll just use vector search for now
        # TODO: Implement hybrid search with BM25 and reranking

        # Format results
        results = []
        if vector_results['documents'] and vector_results['documents'][0]:
            for i, (doc, metadata, distance) in enumerate(zip(
                vector_results['documents'][0],
                vector_results['metadatas'][0],
                vector_results['distances'][0]
            )):
                results.append({
                    "content": doc,
                    "metadata": metadata,
                    "score": 1.0 - distance  # Convert distance to similarity score
                })

        return QueryResponse(results=results)
    except Exception as e:
        logger.error(f"Error querying documents: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/documents")
async def add_document(request: DocumentAddRequest, background_tasks: BackgroundTasks):
    """Add a document to the index."""
    try:
        # Chunk the content
        chunks = chunk_text(request.content)

        # Prepare metadata
        metadata_list = []
        for i, chunk in enumerate(chunks):
            metadata_list.append({
                "source": "manual_add",
                "chunk_index": i,
                "timestamp": datetime.now().isoformat(),
                **(request.metadata or {})
            })

        # Add to index in background
        background_tasks.add_task(add_document_chunks, chunks, metadata_list)

        return {"message": f"Document queued for indexing, {len(chunks)} chunks to be added"}
    } catch (e):
        logger.error(f"Error adding document: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down RAG service...")
    global file_observer
    if file_observer:
        file_observer.stop()
        file_observer.join()