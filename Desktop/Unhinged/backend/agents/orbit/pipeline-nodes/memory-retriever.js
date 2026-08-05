const fetch = require('node-fetch');

/**
 * Memory Retriever Node
 * Retrieves relevant information from the vault based on the event using RAG service
 */

async function memoryRetriever(state) {
  const { event, persona } = state;

  try {
    // Formulate a query from the event and persona
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
      content: result.content || '',
      source: (result.metadata && result.metadata.source) || 'unknown',
      relevance: result.score ?? 0 // Assuming score is between 0 and 1, default to 0 if missing
    }));

    return {
      ...state,
      memories: memories
    };
  } catch (error) {
    console.error('[Orbit Memory Retriever] Error fetching memories from RAG service:', error);
    // Fallback to empty memories on error
    return {
      ...state,
      memories: []
    };
  }
}

module.exports = { memoryRetriever };