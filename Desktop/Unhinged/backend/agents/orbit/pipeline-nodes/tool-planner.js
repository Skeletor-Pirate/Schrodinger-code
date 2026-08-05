/**
 * Tool Planner Node
 * Plans which tools to use to address the user's request
 */

async function toolPlanner(state) {
  const { event, memories, persona } = state;

  // If we don't have memories or shouldn't respond, skip tool planning
  if (!memories || memories.length === 0) {
    return {
      ...state,
      toolPlan: {
        tools: [],
        reason: 'No relevant memories found for tool planning'
      }
    };
  }

  // In a real implementation, this would:
  // 1. Analyze the user's intent from the message
  // 2. Determine what information is needed
  // 3. Select appropriate tools to gather that information
  // 4. Create a step-by-step plan

  const userMessage = event.content.toLowerCase();

  // Define available tools and when to use them
  const toolOptions = [
    {
      tool: 'vault_search',
      triggers: ['what did we', 'what was', 'remember', 'recall', 'decision', 'agreed'],
      description: 'Search vault for past decisions, memories, or discussions'
    },
    {
      tool: 'vault_read',
      triggers: ['read', 'show', 'display', 'open'],
      description: 'Read a specific vault file'
    },
    {
      tool: 'task_create',
      triggers: ['task', 'todo', 'action item', 'follow up'],
      description: 'Create a new task in the tasks folder'
    },
    {
      tool: 'summary_create',
      triggers: ['summary', 'recap', 'summary of', 'tldr'],
      description: 'Create a summary note'
    },
    {
      tool: 'web_search',
      triggers: ['latest', 'recent news', 'current', 'update'],
      description: 'Search the internet for current information'
    }
  ];

  // Determine which tools to use based on the message
  const selectedTools = [];

  for (const option of toolOptions) {
    const matchesTrigger = option.triggers.some(trigger =>
      userMessage.includes(trigger)
    );

    if (matchesTrigger) {
      selectedTools.push({
        tool: option.tool,
        description: option.description,
        params: {} // Would be filled in by tool executor based on context
      });
    }
  }

  // If no specific tools matched but we have memories, do a general search
  if (selectedTools.length === 0 && memories.length > 0) {
    selectedTools.push({
      tool: 'vault_search',
      description: 'General search for relevant context',
      params: { query: event.content }
    });
  }

  return {
    ...state,
    toolPlan: {
      tools: selectedTools,
      reason: `Selected ${selectedTools.length} tools based on message analysis`
    }
  };
}

module.exports = { toolPlanner };