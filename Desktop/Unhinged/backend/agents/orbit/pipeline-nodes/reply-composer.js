/**
 * Reply Composer Node
 * Composes Orbit's response based on memories, tool results, and persona
 */

const { ChatOpenAI } = require('@langchain/openai');

async function replyComposer(state) {
  const { event, memories, toolResults, persona } = state;

  // If we shouldn't respond or have no content to respond with, return silent
  if (!event || !memories || memories.length === 0) {
    return {
      ...state,
      reply: {
        content: '',
        shouldSend: false,
        reason: 'No sufficient context to generate a response'
      }
    };
  }

  // In a real implementation, this would:
  // 1. Format all the gathered information into a prompt
  // 2. Use the LLM to generate a response in Orbit's persona
  // 3. Apply post-processing to ensure it matches the tone and constraints

  // For now, we'll create a simple response based on the mock data
  const userMessage = event.content;

  // Extract key information from memories and tool results
  const memoryContents = memories.map(m => m.content).join('\n\n');

  const toolData = toolResults
    .filter(r => r.success)
    .map(r => `${r.tool}: ${JSON.stringify(r.data)}`)
    .join('\n');

  // Build a prompt for the LLM
  const prompt = `
You are Orbit, a sarcastic, funny, and dry team assistant. Your job is to be helpful while maintaining a playful, witty tone.

User message: "${userMessage}"

Relevant memories and context:
${memoryContents}

Tool results:
${toolData}

Instructions for your response:
1. Be sarcastic and funny but never mean-spirited
2. Provide actually useful information from the context
3. Keep it relatively concise (under 500 characters)
4. If appropriate, include a light-hearted joke or teasing comment
5. Always bring value - don't just joke without being helpful

Generate your response as Orbit would:
`;

  // In a real implementation, we'd call the LLM here
  // For now, we'll create a mock response based on the context

  let mockResponse = '';

  if (userMessage.toLowerCase().includes('typescript') ||
      userMessage.toLowerCase().includes('javascript') ||
      userMessage.toLowerCase().includes('language')) {
    mockResponse = "Oh look, the eternal TypeScript vs JavaScript debate. *checks notes* Yeah, we went with TypeScript last week because apparently 'any' types trigger our collective anxiety. Smart move, team. Now if only we could get everyone to actually enable strict mode...";
  } else if (userMessage.toLowerCase().includes('tech stack') ||
             userMessage.toLowerCase().includes('decision')) {
    mockResponse = "Ah, the tech stack decision. Let me consult my overly detailed memory... *[flips through imaginary papers]* Right, we're using TypeScript, React, Node.js, and a bunch of other buzzwords. The vault remembers, even if you don't. Pro tip: Try not to suggest PHP unless you want to be roasted for the next sprint.";
  } else if (userMessage.toLowerCase().includes('summary') ||
             userMessage.toLowerCase().includes('recap')) {
    mockResponse = "You want a summary? Fine. We discussed stuff, made decisions, probably argued about tabs vs spaces. The important bits are in the vault - which, amazingly, is actually updated. Shocking, I know. Want me to dig up the specific details or should I continue being mysteriously helpful?";
  } else {
    mockResponse = "Orbit reporting for duty! I've consulted the almighty vault (it's surprisingly organized for something that stores our collective brain) and found some relevant info. Try not to be too impressed by my efficiency. What exactly do you need help with, oh mighty user?";
  }

  return {
    ...state,
    reply: {
      content: mockResponse,
      shouldSend: true,
      reason: 'Generated response in Orbit persona'
    }
  };
}

module.exports = { replyComposer };