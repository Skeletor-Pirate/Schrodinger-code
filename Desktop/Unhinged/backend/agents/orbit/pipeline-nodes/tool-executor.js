/**
 * Tool Executor Node
 * Executes the tools planned in the previous step
 */

const {
  vaultReadTool,
  vaultWriteTool,
  vaultSearchTool,
  webSearchTool,
  taskCreateTool,
  summaryCreateTool
} = require('../../../services/agent-tools');

async function toolExecutor(state) {
  const { event, toolPlan } = state;

  // If no tools to execute, return early
  if (!toolPlan.tools || toolPlan.tools.length === 0) {
    return {
      ...state,
      toolResults: []
    };
  }

  // Execute each tool and collect results
  const results = [];

  for (const toolSpec of toolPlan.tools) {
    try {
      let result;

      switch (toolSpec.tool) {
        case 'vault_search':
          result = await vaultSearchTool.execute({
            query: toolSpec.params.query || event.content,
            limit: 5
          });
          break;

        case 'vault_read':
          result = await vaultReadTool.execute({
            path: toolSpec.params.path || 'memories/team-preferences.md'
          });
          break;

        case 'task_create':
          result = await taskCreateTool.execute({
            content: toolSpec.params.content || 'Follow up on discussion',
            groupId: event.groupId
          });
          break;

        case 'summary_create':
          result = await summaryCreateTool.execute({
            content: toolSpec.params.content || 'Summary of recent discussion',
            groupId: event.groupId,
            source: 'chat-summary'
          });
          break;

        case 'web_search':
          result = await webSearchTool.execute({
            query: toolSpec.params.query || event.content,
            limit: 3
          });
          break;

        default:
          result = { error: `Unknown tool: ${toolSpec.tool}` };
      }

      results.push({
        tool: toolSpec.tool,
        success: !result.error,
        data: result,
        error: result.error
      });
    } catch (error) {
      results.push({
        tool: toolSpec.tool,
        success: false,
        data: null,
        error: error.message
      });
    }
  }

  return {
    ...state,
    toolResults: results
  };
}

module.exports = { toolExecutor };