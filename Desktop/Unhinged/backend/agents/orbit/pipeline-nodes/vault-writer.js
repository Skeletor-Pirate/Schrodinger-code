const fs = require('fs').promises;
const path = require('path');

/**
 * Vault Writer Node
 * Writes the agent's actions and responses to the vault for audit and learning
 */

async function vaultWriter(state) {
  const { event, reply, toolResults, persona } = state;

  // If we didn't generate a reply or shouldn't send one, don't write to vault
  if (!reply || !reply.shouldSend || !reply.content) {
    return {
      ...state,
      vaultWrite: {
        success: false,
        reason: 'No reply to write to vault'
      }
    };
  }

  try {
    // Generate a log file name
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0];
    const timeStr = date.toISOString().split('T')[1].replace(/[:.]/g, '-');
    const fileName = `${dateStr}-${timeStr}-orbit-interaction.md`;
    const filePath = `agent-logs/orbit/${fileName}`;

    // Create log content with frontmatter
    const groupId = event.groupId || 'unknown';
    const userId = event.userId || 'unknown';
    const frontmatter = `---\nagent: orbit-agent-001\ntimestamp: ${date.toISOString()}\ngroupId: ${groupId}\nuserId: ${userId}\n---\n\n`;

    const toolsUsed = toolResults
      .filter(result => result.success)
      .map(result => result.tool);

    const content = `${frontmatter}# Orbit Agent Interaction Log\n\n## Event Summary\n- **Group**: ${groupId}\n- **User**: ${userId}\n- **Content**: ${event.content || ''}\n- **Timestamp**: ${event.timestamp || ''}\n\n## Agent Persona\n- **Tone**: ${persona.tone || ''}\n\n## Tools Executed\n${toolsUsed.length > 0 ? toolsUsed.map(tool => `- ${tool}`).join('\n') : 'No tools executed'}\n\n## Agent Response\n${reply.content || ''}\n\n## Context\n- Success: ${reply.shouldSend}\n`;

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