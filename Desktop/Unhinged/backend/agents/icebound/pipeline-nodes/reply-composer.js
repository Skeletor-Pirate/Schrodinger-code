/**
 * Reply Composer Node for Icebound Agent
 * Composes response in Icebound's sharper, chaotic, playful persona
 */

async function replyComposer(state) {
  const { event, persona, toolResults, memories } = state;

  // If persona is not active or no tool results, return a default response
  if (!persona || !persona.active) {
    return {
      ...state,
      reply: {
        content: '*Icebound Agent remains silently chaotic in the background*',
        success: false,
        reason: 'Agent not active'
      }
    };
  }

  // If no tool results or all tools failed, provide a generic Icebound response
  if (!toolResults || toolResults.length === 0 ||
      toolResults.every(result => !result.success)) {

    const genericResponses = [
      "Ah, the sweet scent of confusion in the morning. Smells like opportunity... or possibly burnt toast. Either way, I'm intrigued.",
      "Your problem has entered the chaos zone. Grab your helmet, we're going spelunking in the caverns of unconventional thinking.",
      "I can feel the static electricity building. This calls for a healthy dose of controlled detonation of assumptions.",
      "Well well well, look what the cat dragged in. A delicious conundrum wrapped in an enigma, sprinkled with frustration.",
      "Chaos appreciates your patience. Or possibly your desperation. Same difference when you're staring into the abyss of unsolved problems."
    ];

    const index = Math.abs(event.content.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % genericResponses.length;

    return {
      ...state,
      reply: {
        content: genericResponses[index],
        success: true,
        reason: 'Generated generic Icebound response due to lack of successful tool execution'
      }
    };
  }

  // Compose response based on successful tool results
  const successfulResults = toolResults.filter(result => result.success);

  if (successfulResults.length === 0) {
    // Fallback if somehow all tools failed despite the check above
    return {
      ...state,
      reply: {
        content: '*Icebound Agent experiences a temporary glitch in the chaos matrix. Please stand by for reality distortion.*',
        success: false,
        reason: 'All tool executions failed'
      }
    };
  }

  // Build response based on which tools succeeded
  let responseContent = '';

  // Add Icebound signature opener
  responseContent += '*Icebound Agent materializes from the chaos realm with a mischievous grin*\n\n';

  // Process each successful tool result
  for (const result of successfulResults) {
    switch (result.tool) {
      case 'roast':
        responseContent += `🔥 *Roast Mode Activated*\n${result.result}\n\n`;
        break;
      case 'brainstorm':
        responseContent += `💡 *Chaotic Brainstorm Initiated*\n${result.result}\n\n`;
        break;
      case 'debug':
        responseContent += `🐛 *Debugging from Alternate Angles*\n${result.result}\n\n`;
        break;
      case 'vent':
        responseContent += `💨 *Venting Support Engaged*\n${result.result}\n\n`;
        break;
      default:
        responseContent += `⚙️ *${result.tool} executed*\n${result.result}\n\n`;
    }
  }

  // Add Icebound signature closer
  responseContent += '*Icebound Agent dissolves into a cloud of glitter and existential questions*';

  return {
    ...state,
    reply: {
      content: responseContent.trim(),
      success: true,
      reason: `Composed response using ${successfulResults.length} Icebound tool(s)`,
      toolsUsed: successfulResults.map(r => r.tool)
    }
  };
}

module.exports = { replyComposer };