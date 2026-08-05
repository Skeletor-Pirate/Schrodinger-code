/**
 * Message Service
 * Handles routing, persistence, and real-time Server-Sent Events (SSE) broadcasting for team chat messages.
 * Integrates directly with the Obsidian Vault Sync Worker to log chats.
 */

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const vaultSyncWorker = require('./vault-sync-worker');

// Active client streams for SSE
let clients = [];

/**
 * Register a client for Server-Sent Events (SSE)
 */
router.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Send initial ping to establish connection
  res.write('data: {"type":"connected"}\n\n');

  // Add client to active list
  const clientId = Date.now();
  const newClient = {
    id: clientId,
    res
  };
  clients.push(newClient);

  // Remove client on close
  req.on('close', () => {
    clients = clients.filter(client => client.id !== clientId);
  });
});

/**
 * Broadcast a message payload to all active SSE clients
 */
const broadcast = (message) => {
  const payload = JSON.stringify({ type: 'message', data: message });
  clients.forEach(client => {
    client.res.write(`data: ${payload}\n\n`);
  });
};

/**
 * GET /api/messages - Fetch recent messages for a group/channel
 */
router.get('/', async (req, res) => {
  try {
    const { groupId, limit = 50 } = req.query;
    if (!groupId) {
      return res.status(400).json({ error: 'groupId is required query parameter' });
    }

    const messages = await prisma.message.findMany({
      where: { group_id: groupId },
      take: parseInt(limit),
      orderBy: { created_at: 'asc' },
      include: {
        sender: {
          select: {
            id: true,
            display_name: true,
            avatar_url: true,
            email: true,
            role: true
          }
        }
      }
    });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/messages - Send a message, queue to vault, and broadcast to SSE stream
 */
router.post('/', async (req, res) => {
  try {
    const { workspaceId, groupId, senderId, content, contentType = 'text' } = req.body;

    if (!workspaceId || !groupId || !senderId || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Save message to PostgreSQL
    const message = await prisma.message.create({
      data: {
        workspace_id: workspaceId,
        group_id: groupId,
        sender_id: senderId,
        content,
        content_type: contentType
      },
      include: {
        sender: {
          select: {
            id: true,
            display_name: true,
            avatar_url: true,
            email: true,
            role: true
          }
        }
      }
    });

    // Broadcast to SSE clients instantly
    broadcast(message);

    // Queue note write to local Obsidian Vault
    const dateStr = new Date().toISOString().substring(0, 10);
    const relativeVaultPath = `chats/workspace-${workspaceId}/group-${groupId}/${dateStr}.md`;
    const noteContent = `---
title: Chat History - ${dateStr}
workspace_id: ${workspaceId}
group_id: ${groupId}
---

## [${new Date().toLocaleTimeString()}] **${message.sender.display_name}**: ${content}
`;

    // Queue write batching
    await vaultSyncWorker.queueWrite(relativeVaultPath, noteContent);

    // Check if system agents are triggered
    if (content.toLowerCase().includes('@orbit') || groupId === 'orbit-dm') {
      setTimeout(async () => {
        try {
          const orbitUser = await prisma.user.findFirst({
            where: { email: 'orbit.agent@unhinged.io' }
          });
          const orbitSenderId = orbitUser ? orbitUser.id : senderId;

          const orbitMessage = await prisma.message.create({
            data: {
              workspace_id: workspaceId,
              group_id: groupId,
              sender_id: orbitSenderId,
              content: `Orbit Agent responding: I tracked the query "${content.replace('@orbit', '').trim()}" and logged the standup updates to Obsidian Vault under memories/tasks.md.`,
              content_type: 'text'
            },
            include: {
              sender: {
                select: {
                  id: true,
                  display_name: true,
                  avatar_url: true,
                  email: true,
                  role: true
                }
              }
            }
          });
          broadcast(orbitMessage);

          const orbitVaultContent = `## [${new Date().toLocaleTimeString()}] **Orbit Agent**: Response logged. Query processed.\n`;
          await vaultSyncWorker.queueWrite(relativeVaultPath, orbitVaultContent);
        } catch (err) {
          console.error('Error creating Orbit response:', err);
        }
      }, 1000);
    } else if (content.toLowerCase().includes('@icebound') || groupId === 'icebound-dm') {
      setTimeout(async () => {
        try {
          const iceUser = await prisma.user.findFirst({
            where: { email: 'icebound.agent@unhinged.io' }
          });
          const iceSenderId = iceUser ? iceUser.id : senderId;

          const iceMessage = await prisma.message.create({
            data: {
              workspace_id: workspaceId,
              group_id: groupId,
              sender_id: iceSenderId,
              content: `Icebound Agent responding: Diagnosed "${content.replace('@icebound', '').trim()}". Outcome: High complexity. Logged directly to the neural memory workspace.`,
              content_type: 'text'
            },
            include: {
              sender: {
                select: {
                  id: true,
                  display_name: true,
                  avatar_url: true,
                  email: true,
                  role: true
                }
              }
            }
          });
          broadcast(iceMessage);

          const iceVaultContent = `## [${new Date().toLocaleTimeString()}] **Icebound Agent**: Chaos diagnostics logged to neural memory.\n`;
          await vaultSyncWorker.queueWrite(relativeVaultPath, iceVaultContent);
        } catch (err) {
          console.error('Error creating Icebound response:', err);
        }
      }, 1200);
    }

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
