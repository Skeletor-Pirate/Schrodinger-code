const fetch = require('node-fetch');

/**
 * Memory Retriever Node for Icebound Agent
 * Fetches relevant memories from vault using RAG service
 */

async function memoryRetriever(state) {
  const { event, persona } = state;

  // If persona is not active, don't retrieve memories
  if (!persona || !persona.active) {
    return {
      ...state,
      memories: []
    };
  }

  try {
    // Formulate a query from the event and persona
    // We can use the event content and maybe the persona description
    const queryText = `${event.content} ${persona.description || ''}`.trim();

    // Call the RAG service
    const ragServiceUrl = process.env.RAG_SERVICE_URL || 'http://localhost:8001';
    const response = await fetch(`${ragServiceUrl}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: queryText,
        top_k: 5
      })
    });

    if (!response.ok) {
      throw new Error(`RAG service returned status ${response.status}`);
    }

    const ragResponse = await response.json();
    const results = ragResponse.results || [];

    // Format the results to match the expected memory structure
    const memories = results.map((result, index) => ({
      id: `rag-${index}-${Date.now()}`,
      content: result.content,
      source: result.metadata.source || 'unknown',
      relevance: result.score // Assuming score is between 0 and 1
    }));

    return {
      ...state,
      memories: memories
    };
  } catch (error) {
    console.error('[Icebound Memory Retriever] Error fetching memories from RAG service:', error);
    // Fallback to empty memories on error
    return {
      ...state,
      memories: []
    };
  }
}

module.exports = { memoryRetriever };