const fs = require('fs').promises;
const path = require('path');

/**
 * Vault Writer Node for Icebound Agent
 * Logs interaction to agent-logs/icebound/ directory in the Obsidian vault
 */

async function vaultWriter(state) {
  const { event, persona, toolResults, reply } = state;

  // If no reply or reply not successful, don't write to vault
  if (!reply || !reply.success) {
    return {
      ...state,
      vaultWrite: {
        success: false,
        reason: 'No successful reply to log'
      }
    };
  }

  try {
    // Generate a log file name
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0];
    const timeStr = date.toISOString().split('T')[1].replace(/[:.]/g, '-');
    const fileName = `${dateStr}-${timeStr}-icebound-interaction.md`;
    const filePath = `agent-logs/icebound/${fileName}`;

    // Create log content with frontmatter
    const groupId = event.groupId || 'unknown';
    const userId = event.userId || 'unknown';
    const frontmatter = `---\nagent: icebound-agent-001\ntimestamp: ${date.toISOString()}\ngroupId: ${groupId}\nuserId: ${userId}\n---\n\n`;

    const toolsUsed = reply.toolsUsed || [];
    const toolResultsSummary = toolResults
      .filter(result => result.success)
      .map(result => `${result.tool}: ${result.usedFor}`)
      .join('\n');

    const content = `${frontmatter}# Icebound Agent Interaction Log\n\n## Event Summary\n- **Group**: ${groupId}\n- **User**: ${userId}\n- **Content**: ${event.content || ''}\n- **Timestamp**: ${event.timestamp || ''}\n\n## Agent Persona\n- **Tone**: ${persona.tone || ''}\n- **Style**: ${persona.style || ''}\n\n## Tools Executed\n${toolsUsed.length > 0 ? toolsUsed.map(tool => `- ${tool}`).join('\n') : 'No tools executed'}\n\n## Tool Results Summary\n${toolResultsSummary || 'No successful tool executions'}\n\n## Agent Response\n${reply.content || ''}\n\n## Context\n- Memories retrieved: ${(state.memories || []).length}\n- Success: ${reply.success}\n`;

    // Ensure the vault directory exists (vault path from environment)
    const vaultPath = process.env.VAULT_PATH || './vault';
    const fullDirPath = path.join(vaultPath, path.dirname(filePath));
    await fs.mkdir(fullDirPath, { recursive: true });

    // Write the file
    const fullFilePath = path.join(vaultPath, filePath);
    await fs.writeFile(fullFilePath, content, 'utf8');

    return {
      ...state,
      vaultWrite: {
        success: true,
        filePath: filePath,
        message: `Successfully logged interaction to ${filePath}`
      }
    };
  } catch (error) {
    return {
      ...state,
      vaultWrite: {
        success: false,
        error: `Failed to write to vault: ${error.message}`
      }
    };
  }
}

module.exports = { vaultWriter };