/**
 * Tool Planner Node for Icebound Agent
 * Selects appropriate tools based on user input and Icebound's capabilities
 */

async function toolPlanner(state) {
  const { event, persona, memories } = state;

  // If persona is not active or no memories, return empty tool plan
  if (!persona || !persona.active) {
    return {
      ...state,
      toolPlan: {
        tools: [],
        reason: 'Agent not active or no persona set'
      }
    };
  }

  // Icebound's available tools based on implementation plan:
  // - Roast: Playfully challenge assumptions
  // - Brainstorm: Generate chaotic, creative ideas
  // - Debug: Help troubleshoot problems from unusual angles
  // - Vent: Provide a space to express frustration

  const content = event.content.toLowerCase();
  const selectedTools = [];

  // Determine which tools to use based on input analysis
  const roastTriggers = [
    'roast', 'roast me', 'challenge me', 'playful roast',
    'assumptions', 'challenge assumptions', 'play devil\'s advocate'
  ];

  const brainstormTriggers = [
    'brainstorm', 'ideas', 'suggestions', 'what if',
    'creative', 'innovative', 'outside the box', 'wild idea'
  ];

  const debugTriggers = [
    'debug', 'troubleshoot', 'stuck', 'problem', 'issue',
    'not working', 'broken', 'fix', 'solve'
  ];

  const ventTriggers = [
    'vent', 'frustrated', 'angry', 'annoyed', 'fed up',
    'tired of', 'sick of', 'can\'t stand', 'hate'
  ];

  // Check for tool triggers
  if (roastTriggers.some(trigger => content.includes(trigger))) {
    selectedTools.push('roast');
  }

  if (brainstormTriggers.some(trigger => content.includes(trigger))) {
    selectedTools.push('brainstorm');
  }

  if (debugTriggers.some(trigger => content.includes(trigger))) {
    selectedTools.push('debug');
  }

  if (ventTriggers.some(trigger => content.includes(trigger))) {
    selectedTools.push('vent');
  }

  // If no specific tools triggered but we have memories, default to brainstorm for Icebound
  // (Icebound leans more toward idea generation)
  if (selectedTools.length === 0 && memories && memories.length > 0) {
    selectedTools.push('brainstorm');
  }

  // If still no tools, default to vent as a safe Icebound option
  if (selectedTools.length === 0) {
    selectedTools.push('vent');
  }

  // Remove duplicates
  const uniqueTools = [...new Set(selectedTools)];

  return {
    ...state,
    toolPlan: {
      tools: uniqueTools,
      reason: `Selected tools based on input analysis: ${uniqueTools.join(', ')}`,
      // Additional context for tool execution
      context: {
        eventContent: event.content,
        userId: event.userId,
        groupId: event.groupId,
        availableMemories: memories
      }
    }
  };
}

module.exports = { toolPlanner };