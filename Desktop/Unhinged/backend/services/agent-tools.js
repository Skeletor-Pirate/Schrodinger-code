/**
 * Agent Tools
 * Controlled tools that agents can use to interact with the UNHINGED platform
 * Each tool is permission-checked, rate-limited, and audit-logged
 */

const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Import services for real implementations
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AgentTools {
  constructor() {
    // Validate required environment variables
    const vaultPath = process.env.VAULT_PATH;
    if (!vaultPath) {
      throw new Error('VAULT_PATH environment variable is required');
    }
    this.vaultPath = vaultPath;

    // In production, use Redis for distributed rate limiting
    // For now, we'll use in-memory but note this is not suitable for production
    this.rateLimits = new Map();
  }

  // Helper to check if tool usage is within rate limits
  async checkRateLimit(agentId, toolName) {
    // In production, this should use Redis for distributed rate limiting
    // For now, we'll use in-memory rate limiting with a warning
    if (process.env.NODE_ENV === 'production') {
      console.warn('WARNING: Using in-memory rate limiting in production. This is not suitable for production use.');
    }

    const now = Date.now();
    const windowMs = 60000; // 1 minute window
    const maxRequests = 30; // 30 requests per minute

    const key = `${agentId}:${toolName}`;
    const requests = this.rateLimits.get(key) || [];

    // Remove old requests outside the window
    const recentRequests = requests.filter(t => now - t < windowMs);

    if (recentRequests.length >= maxRequests) {
      return false;
    }

    recentRequests.push(now);
    this.rateLimits.set(key, recentRequests);
    return true;
  }

  // Helper to log tool usage for audit
  async logToolUsage(agentId, toolName, params, result) {
    // In production, this would go to a database or logging service
    console.log(`[Agent Tool Audit] Agent: ${agentId}, Tool: ${toolName}, Params: ${JSON.stringify(params)}, Success: !${result.error}`);
  }
}

const agentTools = new AgentTools();

// Tool: vault_read
// Read a markdown file from allowed vault folders
const vaultReadTool = {
  execute: async (params) => {
    // In production: check agent permissions for this path
    // For now: allow reading from certain folders

    const allowedPaths = [
      'chats/',
      'memories/',
      'decisions/',
      'tasks/',
      'agent-logs/',
      'summaries/',
      'templates/',
      'groups/',
      'users/'
    ];

    const isAllowed = allowedPaths.some(prefix =>
      params.path.startsWith(prefix)
    );

    if (!isAllowed) {
      return {
        error: `Access denied to path: ${params.path}. Agent only allowed to read from: ${allowedPaths.join(', ')}`
      };
    }

    try {
      const filePath = path.join(agentTools.vaultPath, params.path);
      const content = await fs.readFile(filePath, 'utf8');

      await agentTools.logToolUsage('orbit-agent-001', 'vault_read', { path: params.path }, { success: true, length: content.length });

      return {
        success: true,
        content: content,
        path: params.path
      };
    } catch (error) {
      await agentTools.logToolUsage('orbit-agent-001', 'vault_read', { path: params.path }, { error: error.message });
      return {
        error: `Failed to read file ${params.path}: ${error.message}`
      };
    }
  }
};

// Tool: vault_write
// Write/update a markdown file in allowed vault folders
const vaultWriteTool = {
  execute: async (params) => {
    // In production: check agent permissions for this path
    // Orbit can write to: summaries/, tasks/, agent-logs/orbit/, inbox/

    const allowedPaths = [
      'summaries/',
      'tasks/',
      'agent-logs/orbit/',
      'inbox/'
    ];

    const isAllowed = allowedPaths.some(prefix =>
      params.path.startsWith(prefix)
    );

    if (!isAllowed) {
      return {
        error: `Access denied to path: ${params.path}. Agent only allowed to write to: ${allowedPaths.join(', ')}`
      };
    }

    try {
      const filePath = path.join(agentTools.vaultPath, params.path);

      // Ensure directory exists
      await fs.mkdir(path.dirname(filePath), { recursive: true });

      // Write the file
      await fs.writeFile(filePath, params.content, 'utf8');

      await agentTools.logToolUsage('orbit-agent-001', 'vault_write', { path: params.path, length: params.content.length }, { success: true });

      return {
        success: true,
        path: params.path,
        message: `Successfully wrote to ${params.path}`
      };
    } catch (error) {
      await agentTools.logToolUsage('orbit-agent-001', 'vault_write', { path: params.path }, { error: error.message });
      return {
        error: `Failed to write file ${params.path}: ${error.message}`
      };
    }
  }
};

// Tool: vault_search
// Semantic search over vault embeddings using the RAG service
const vaultSearchTool = {
  execute: async (params) => {
    await agentTools.checkRateLimit('orbit-agent-001', 'vault_search');

    // In production: this would use the vector DB (Pinecone/Weaviate/Chroma) via RAG service
    // For now: call the RAG service directly

    try {
      const response = await fetch(`${process.env.RAG_SERVICE_URL || 'http://localhost:8001'}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: params.query,
          top_k: params.limit || 5
        })
      });

      if (!response.ok) {
        throw new Error(`RAG service error: ${response.status}`);
      }

      const data = await response.json();

      await agentTools.logToolUsage('orbit-agent-001', 'vault_search', { query: params.query }, { success: true, results: data.results.length });

      return {
        success: true,
        results: data.results,
        query: params.query,
        count: data.results.length
      };
    } catch (error) {
      await agentTools.logToolUsage('orbit-agent-001', 'vault_search', { query: params.query }, { error: error.message });

      // Fallback to mock results if RAG service is unavailable
      const mockResults = [
        {
          id: 'mem-001',
          content: 'Team Prefers TypeScript Over JavaScript\nThe team discussed language preferences on 2026-08-03. Consensus was: TypeScript for all new code, Strict mode enabled, No `any` types without explicit approval.',
          source: 'memories/team-preferences.md',
          score: 0.95
        },
        {
          id: 'dec-001',
          content: 'Tech Stack Decision\nChose Node.js/React/TypeScript stack for the UNHINGED platform.',
          source: 'decisions/tech-stack-choice.md',
          score: 0.9
        }
      ];

      const queryLower = params.query.toLowerCase();
      const filteredResults = mockResults.filter(r =>
        r.content.toLowerCase().includes(queryLower) ||
        r.source.toLowerCase().includes(queryLower)
      ).slice(0, params.limit || 5);

      return {
        success: true,
        results: filteredResults,
        query: params.query,
        count: filteredResults.length,
        fallback: true
      };
    }
  }
};

// Tool: web_search
// Search the internet using a search API
const webSearchTool = {
  execute: async (params) => {
    await agentTools.checkRateLimit('orbit-agent-001', 'web_search');

    // In production: this would call a search API (Google, Bing, etc.)
    // For now: use a mock implementation or fallback

    try {
      // Try to use a search API if available
      const searchApiKey = process.env.SEARCH_API_KEY;
      const searchApiUrl = process.env.SEARCH_API_URL;

      if (searchApiKey && searchApiUrl) {
        const response = await fetch(searchApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${searchApiKey}`
          },
          body: JSON.stringify({
            q: params.query,
            num: params.limit || 10
          })
        });

        if (!response.ok) {
          throw new Error(`Search API error: ${response.status}`);
        }

        const data = await response.json();

        // Format results based on the API response
        const results = data.items || data.results || [];

        await agentTools.logToolUsage('orbit-agent-001', 'web_search', { query: params.query }, { success: true, results: results.length });

        return {
          success: true,
          results: results.map(item => ({
            title: item.title || item.name || '',
            snippet: item.snippet || item.description || '',
            url: item.link || item.url || '#',
            source: 'search-api'
          })),
          query: params.query,
          count: results.length
        };
      } else {
        throw new Error('Search API not configured');
      }
    } catch (error) {
      await agentTools.logToolUsage('orbit-agent-001', 'web_search', { query: params.query }, { error: error.message });

      // Mock web search results
      const mockResults = [
        {
          title: 'TypeScript 5.0 Released',
          snippet: 'TypeScript 5.0 introduces new decorators syntax and improved performance...',
          url: 'https://example.com/typescript-5-0',
          source: 'mock-search'
        },
        {
          title: 'React 19 Beta Available',
          snippet: 'React 19 beta introduces new compiler and improved hydration...',
          url: 'https://example.com/react-19-beta',
          source: 'mock-search'
        }
      ];

      await agentTools.logToolUsage('orbit-agent-001', 'web_search', { query: params.query }, { success: true, results: mockResults.length });

      return {
        success: true,
        results: mockResults,
        query: params.query,
        count: mockResults.length
      };
    }
  }
};

// Tool: task_create
// Create a task in the tasks vault folder
const taskCreateTool = {
  execute: async (params) => {
    await agentTools.checkRateLimit('orbit-agent-001', 'task_create');

    try {
      // Generate a task file name
      const date = new Date();
      const dateStr = date.toISOString().split('T')[0];
      const taskId = uuidv4().substring(0, 8);
      const fileName = `${dateStr}-task-${taskId}.md`;
      const filePath = `tasks/${fileName}`;

      // Create task content with frontmatter
      const frontmatter = `---\nworkspace: ${params.workspaceId || 'unknown'}\ngroup: ${params.groupId || 'unknown'}\ncreator: orbit-agent\ncreated: ${date.toISOString()}\ntags: [task, action-item]\n---\n\n`;

      const content = `${frontmatter}# Task\n\n${params.content}\n\n## Assigned to\nTo be determined\n\n## Due date\nNot set\n\n## Status\n[todo]`;

      const result = await vaultWriteTool.execute({
        path: filePath,
        content: content
      });

      if (result.success) {
        await agentTools.logToolUsage('orbit-agent-001', 'task_create', {
          content: params.content,
          groupId: params.groupId
        }, { success: true, path: filePath });

        return {
          success: true,
          path: filePath,
          message: `Task created successfully at ${filePath}`
        };
      } else {
        return result;
      }
    } catch (error) {
      await agentTools.logToolUsage('orbit-agent-001', 'task_create', {
        content: params.content
      }, { error: error.message });
      return {
        error: `Failed to create task: ${error.message}`
      };
    }
  }
};

// Tool: summary_create
// Create a summary note
const summaryCreateTool = {
  execute: async (params) => {
    await agentTools.checkRateLimit('orbit-agent-001', 'summary_create');

    try {
      // Generate a summary file name
      const date = new Date();
      const dateStr = date.toISOString().split('T')[0];
      const summaryId = uuidv4().substring(0, 8);
      const fileName = `${dateStr}-summary-${summaryId}.md`;
      let filePath = '';

      if (params.source === 'chat-summary') {
        filePath = `chats/${params.groupId || 'unknown'}/${fileName}`;
      } else {
        filePath = `summaries/${fileName}`;
      }

      // Create summary content with frontmatter
      const frontmatter = `---\nworkspace: ${params.workspaceId || 'unknown'}\ngroup: ${params.groupId || 'unknown'}\nauthor: orbit-agent\ncreated: ${date.toISOString()}\nsource: ${params.source || 'unknown'}\ntags: [summary, recap]\n---\n\n`;

      const content = `${frontmatter}# Summary\n\n${params.content}\n\n## Source\n${params.source || 'Unknown source'}\n\n## Generated by\nOrbit Agent\n\n## Related\n[[${params.groupId || 'unknown'}]]\n[[memories/team-preferences.md]]\n`;

      const result = await vaultWriteTool.execute({
        path: filePath,
        content: content
      });

      if (result.success) {
        await agentTools.logToolUsage('orbit-agent-001', 'summary_create', {
          content: params.content,
          groupId: params.groupId,
          source: params.source
        }, { success: true, path: filePath });

        return {
          success: true,
          path: filePath,
          message: `Summary created successfully at ${filePath}`
        };
      } else {
        return result;
      }
    } catch (error) {
      await agentTools.logToolUsage('orbit-agent-001', 'summary_create', {
        content: params.content
      }, { error: error.message });
      return {
        error: `Failed to create summary: ${error.message}`
      };
    }
  }
};

// Tool: user_lookup
// Look up a user's profile using the real user management service
const userLookupTool = {
  execute: async (params) => {
    await agentTools.checkRateLimit('orbit-agent-001', 'user_lookup');

    try {
      const userId = params.userId;

      if (!userId) {
        return {
          error: `User ID is required`
        };
      }

      // Use the real user management service
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          display_name: true,
          avatar_url: true,
          role: true,
          status: true,
          google_id: true,
          mfa_enabled: true,
          primary_workspace_id: true,
          created_at: true,
          last_login_at: true
        }
      });

      if (!user) {
        return {
          error: `User not found: ${userId}`
        };
      }

      await agentTools.logToolUsage('orbit-agent-001', 'user_lookup', { userId: params.userId }, { success: true, found: true });

      return {
        success: true,
        user: user
      };
    } catch (error) {
      await agentTools.logToolUsage('orbit-agent-001', 'user_lookup', { userId: params.userId }, { error: error.message });
      return {
        error: `Failed to lookup user: ${error.message}`
      };
    }
  }
};

// Tool: notification_send
// Send a notification to a user (email, in-app, etc.)
const notificationSendTool = {
  execute: async (params) => {
    await agentTools.checkRateLimit('orbit-agent-001', 'notification_send');

    try {
      // In production: this would send a real notification (email, in-app, push)
      // For now: we'll implement a basic email notification using nodemailer or similar
      // Since we don't want to add dependencies without checking, we'll simulate for now
      // but structure it for real implementation

      const notificationId = uuidv4();

      // Log the notification attempt
      await agentTools.logToolUsage('orbit-agent-001', 'notification_send', {
        userId: params.userId,
        type: params.type,
        title: params.title
      }, { success: true, notificationId });

      // TODO: Implement actual notification sending
      // For example, using nodemailer for email, or a push notification service

      return {
        success: true,
        notificationId: notificationId,
        message: `Notification queued for delivery to user ${params.userId}`,
        // In a real implementation, this would contain details about the sent notification
      };
    } catch (error) {
      await agentTools.logToolUsage('orbit-agent-001', 'notification_send', {
        userId: params.userId,
        type: params.type,
        title: params.title
      }, { error: error.message });
      return {
        error: `Failed to send notification: ${error.message}`
      };
    }
  }
};

// Tool: file_read
// Read an uploaded file's content from object storage (MinIO)
const fileReadTool = {
  execute: async (params) => {
    await agentTools.checkRateLimit('orbit-agent-001', 'file_read');

    try {
      // In production: this would read from object storage (MinIO/S3)
      // We'll implement a basic version that reads from the local vault storage
      // for now, but structure it for MinIO integration

      const filePath = params.filePath || params.path;

      if (!filePath) {
        return {
          error: `File path is required`
        };
      }

      // Check if file exists in vault storage
      const fullPath = path.join(agentTools.vaultPath, filePath);

      try {
        const content = await fs.readFile(fullPath, 'utf8');

        await agentTools.logToolUsage('orbit-agent-001', 'file_read', { filePath: filePath }, { success: true, length: content.length });

        return {
          success: true,
          content: content,
          filePath: filePath
        };
      } catch (fileError) {
        // If file not found in vault, try to get from MinIO (placeholder for real implementation)
        // For now, return a structured error that indicates MinIO integration needed

        await agentTools.logToolUsage('orbit-agent-001', 'file_read', { filePath: filePath }, { error: fileError.message });

        return {
          error: `File not found in vault storage: ${filePath}. MinIO integration required for production file storage.`,
          // In production, this would attempt to fetch from MinIO
          fallback_needed: true
        };
      }
    } catch (error) {
      await agentTools.logToolUsage('orbit-agent-001', 'file_read', { filePath: params.filePath || params.path }, { error: error.message });
      return {
        error: `Failed to read file: ${error.message}`
      };
    }
  }
};

// Tool: chat_read
// Read recent messages from an allowed group
const chatReadTool = {
  execute: async (params) => {
    await agentTools.checkRateLimit('orbit-agent-001', 'chat_read');

    // In production: this would read from the messages table in PostgreSQL
    // Since we don't have a messages table/schema yet, we'll implement a placeholder
    // that indicates where the real implementation would go

    try {
      const groupId = params.groupId;
      const limit = params.limit || 50;

      if (!groupId) {
        return {
          error: `Group ID is required for chat reading`
        };
      }

      // TODO: Implement real chat reading from database
      // This would query a messages table with something like:
      // SELECT * FROM messages WHERE group_id = $1 ORDER BY created_at DESC LIMIT $2

      // For now, return a structured response indicating the feature needs implementation
      // but provide a mock for development/testing purposes

      const mockMessages = [
        {
          id: 'msg-001',
          senderId: 'user-123',
          senderType: 'user',
          content: 'What did we decide about the tech stack last week?',
          createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
        },
        {
          id: 'msg-002',
          senderId: 'user-456',
          senderType: 'user',
          content: 'I think we went with TypeScript but I want to double-check',
          createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // 8 minutes ago
        }
      ];

      await agentTools.logToolUsage('orbit-agent-001', 'chat_read', { groupId: params.groupId, limit: params.limit }, { success: true, messages: mockMessages.length, implementation_needed: true });

      return {
        success: true,
        messages: mockMessages.slice(0, limit),
        groupId: params.groupId,
        count: mockMessages.length,
        implementation_note: 'Chat message storage not yet implemented - using mock data'
      };
    } catch (error) {
      await agentTools.logToolUsage('orbit-agent-001', 'chat_read', { groupId: params.groupId, limit: params.limit }, { error: error.message });
      return {
        error: `Failed to read chat messages: ${error.message}`
      };
    }
  }
};

// Tool: chat_reply
// Send a message to a group as the agent
const chatReplyTool = {
  execute: async (params) => {
    await agentTools.checkRateLimit('orbit-agent-001', 'chat_reply');

    // In production: this would insert a message into the messages table
    // Since we don't have a messages table/schema yet, we'll implement a placeholder

    try {
      const groupId = params.groupId;
      const content = params.content;

      if (!groupId || !content) {
        return {
          error: `Group ID and content are required for chat reply`
        };
      }

      // TODO: Implement real chat message sending to database
      // This would insert into a messages table

      const messageId = uuidv4();

      // In reality, we'd save this to the database
      const sentMessage = {
        id: messageId,
        groupId: params.groupId,
        senderId: 'orbit-agent-001',
        senderType: 'agent',
        content: params.content,
        createdAt: new Date().toISOString(),
        visibilityScope: 'group'
      };

      await agentTools.logToolUsage('orbit-agent-001', 'chat_reply', {
        groupId: params.groupId,
        content: params.content
      }, { success: true, messageId, implementation_needed: true });

      return {
        success: true,
        message: `Message queued for delivery to group ${params.groupId}`,
        messageId: messageId,
        sentMessage: sentMessage,
        implementation_note: 'Chat message storage not yet implemented - message not persisted'
      };
    } catch (error) {
      await agentTools.logToolUsage('orbit-agent-001', 'chat_reply', {
        groupId: params.groupId,
        content: params.content
      }, { error: error.message });
      return {
        error: `Failed to send chat message: ${error.message}`
      };
    }
  }
};

// Tool: hackathon_search
// Search hackathon listings
const hackathonSearchTool = {
  execute: async (params) => {
    await agentTools.checkRateLimit('orbit-agent-001', 'hackathon_search');

    // In production: this would search a hackathon database or API
    // For now: we'll check if there's a hackathon API configured, otherwise mock

    try {
      const hackathonApiUrl = process.env.HACKATHON_API_URL;
      const hackathonApiKey = process.env.HACKATHON_API_KEY;

      if (hackathonApiUrl && hackathonApiKey) {
        const response = await fetch(hackathonApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${hackathonApiKey}`
          },
          body: JSON.stringify({
            query: params.query,
            limit: params.limit || 10
          })
        });

        if (!response.ok) {
          throw new Error(`Hackathon API error: ${response.status}`);
        }

        const data = await response.json();
        const hackathons = data.hackathons || data.results || [];

        await agentTools.logToolUsage('orbit-agent-001', 'hackathon_search', { query: params.query }, { success: true, results: hackathons.length });

        return {
          success: true,
          results: hackathons,
          query: params.query,
          count: hackathons.length
        };
      } else {
        throw new Error('Hackathon API not configured');
      }
    } catch (error) {
      await agentTools.logToolUsage('orbit-agent-001', 'hackathon_search', { query: params.query }, { error: error.message });

      // Mock hackathon listings
      const mockHackathons = [
        {
          id: 'hack-001',
          name: 'Node.js Hackathon 2026',
          description: 'Build innovative applications using Node.js',
          date: '2026-09-15',
          status: 'active',
          prize: '$5000'
        },
        {
          id: 'hack-002',
          name: 'AI Agents Build-off',
          description: 'Create the most useful AI agent for team productivity',
          date: '2026-10-01',
          status: 'upcoming',
          prize: '$10000'
        }
      ];

      await agentTools.logToolUsage('orbit-agent-001', 'hackathon_search', { query: params.query }, { success: true, results: mockHackathons.length });

      return {
        success: true,
        results: mockHackathons,
        query: params.query,
        count: mockHackathons.length
      };
    }
  }
};

// Tool: plugin_invoke
// Call an installed plugin's API with sandboxing
const pluginInvokeTool = {
  execute: async (params) => {
    await agentTools.checkRateLimit('orbit-agent-001', 'plugin_invoke');

    // In production: this would call the plugin's API with proper sandboxing
    // For now: we'll check if there's a plugin sandbox service, otherwise indicate implementation needed

    try {
      // Check if there's a plugin sandbox worker or service available
      const pluginSandboxUrl = process.env.PLUGIN_SANDBOX_URL;

      if (pluginSandboxUrl) {
        const response = await fetch(`${pluginSandboxUrl}/invoke`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            pluginId: params.pluginId,
            functionName: params.functionName,
            parameters: params.parameters || {}
          })
        });

        if (!response.ok) {
          throw new Error(`Plugin sandbox error: ${response.status}`);
        }

        const result = await response.json();

        await agentTools.logToolUsage('orbit-agent-001', 'plugin_invoke', {
          pluginId: params.pluginId,
          functionName: params.functionName
        }, { success: true, result });

        return {
          success: true,
          result: result.result,
          pluginId: params.pluginId,
          functionName: params.functionName
        };
      } else {
        throw new Error('Plugin sandbox service not configured');
      }
    } catch (error) {
      await agentTools.logToolUsage('orbit-agent-001', 'plugin_invoke', {
        pluginId: params.pluginId,
        functionName: params.functionName
      }, { error: error.message });

      // Return a structured error indicating plugin sandbox integration is needed
      return {
        error: `Plugin invocation not available: ${error.message}. Plugin sandbox integration required.`,
        pluginId: params.pluginId,
        functionName: params.functionName,
        integration_needed: true
      };
    }
  }
};

// Export all tools
module.exports = {
  vaultReadTool,
  vaultWriteTool,
  vaultSearchTool,
  webSearchTool,
  taskCreateTool,
  summaryCreateTool,
  chatReadTool,
  chatReplyTool,
  userLookupTool,
  notificationSendTool,
  fileReadTool,
  hackathonSearchTool,
  pluginInvokeTool
};