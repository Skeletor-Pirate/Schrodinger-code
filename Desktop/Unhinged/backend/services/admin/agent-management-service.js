/**
 * Agent Management Service
 * Handles agent-related operations for the admin console
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class AgentManagementService {
  /**
   * Get all custom agents with optional filtering
   * @param {Object} filters - Filter options (status, ownerId, workspaceId)
   * @returns {Promise<Array>} List of custom agents
   */
  async getCustomAgents(filters = {}) {
    const { status, ownerId, workspaceId, page = 1, limit = 50 } = filters;

    const where = {};

    if (status) where.status = status;
    if (ownerId) where.owner_user_id = ownerId;
    if (workspaceId) where.workspace_id = workspaceId;

    const [agents, totalCount] = await prisma.$transaction([
      prisma.customAgent.findMany({
        where,
        skip: (page - 1) * limit,
        take: parseInt(limit),
        orderBy: { created_at: 'desc' }
      }),
      prisma.customAgent.count({ where })
    ]);

    return {
      agents,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    };
  }

  /**
   * Get a custom agent by ID
   * @param {string} agentId - Agent ID
   * @returns {Promise<Object>} Custom agent object
   */
  async getCustomAgentById(agentId) {
    return prisma.customAgent.findUnique({
      where: { id: agentId }
    });
  }

  /**
   * Update custom agent status
   * @param {string} agentId - Agent ID
   * @param {string} status - New status (draft, testing, published, suspended)
   * @returns {Promise<Object>} Updated agent
   */
  async updateCustomAgentStatus(agentId, status) {
    const validStatuses = ['draft', 'testing', 'published', 'suspended'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }

    return prisma.customAgent.update({
      where: { id: agentId },
      data: { status },
      select: {
        id: true,
        name: true,
        status: true,
        updated_at: true
      }
    });
  }

  /**
   * Suspend an abusive agent
   * @param {string} agentId - Agent ID
   * @param {string} reason - Reason for suspension
   * @returns {Promise<Object>} Updated agent with suspension info
   */
  async suspendAgent(agentId, reason) {
    // Update agent status to suspended
    const updatedAgent = await prisma.customAgent.update({
      where: { id: agentId },
      data: {
        status: 'suspended',
        // In a real implementation, we might store suspension reason and timestamp
        updated_at: new Date()
      }
    });

    // Log the suspension action (would be done via audit log service)

    return {
      ...updatedAgent,
      suspensionReason: reason,
      suspendedAt: new Date()
    };
  }

  /**
   * Get agent runs/usage statistics
   * @param {Object} filters - Filter options (agentId, dateRange)
   * @returns {Promise<Object>} Agent usage statistics
   */
  async getAgentStats(filters = {}) {
    const { agentId, startDate, endDate } = filters;

    const where = {};
    if (agentId) where.agent_id = agentId;
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = new Date(startDate);
      if (endDate) where.timestamp.lte = new Date(endDate);
    }

    const [totalRuns, runsByStatus, runsByAgent, recentRuns] = await prisma.$transaction([
      prisma.agentRun.count({ where }),
      prisma.agentRun.groupBy({
        by: ['status'],
        _count: true,
        where
      }),
      prisma.agentRun.groupBy({
        by: ['agent_id'],
        _count: true,
        where,
        orderBy: { _count: 'desc' },
        take: 10
      }),
      prisma.agentRun.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        take: 10,
        select: {
          id: true,
          agent_id: true,
          status: true,
          started_at: true,
          ended_at: true,
          agent: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })
    ]);

    return {
      totalRuns,
      runsByStatus: Object.fromEntries(
        runsByStatus.map(r => [r.status, r._count])
      ),
      topAgents: runsByAgent.map(a => ({
        agentId: a.agent_id,
        runCount: a._count
      })),
      recentRuns
    };
  }
}

module.exports = new AgentManagementService();