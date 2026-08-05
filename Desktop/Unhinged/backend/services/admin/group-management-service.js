/**
 * Group Management Service
 * Handles group-related operations for the admin console
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class GroupManagementService {
  /**
   * Get all groups with optional filtering
   * @param {Object} filters - Filter options (workspaceId, type, visibility, searchTerm)
   * @returns {Promise<Array>} List of groups
   */
  async getGroups(filters = {}) {
    const { workspaceId, type, visibility, searchTerm, page = 1, limit = 50 } = filters;

    const where = {};

    if (workspaceId) where.workspace_id = workspaceId;
    if (type) where.type = type;
    if (visibility) where.visibility = visibility;
    if (searchTerm) {
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } }
      ];
    }

    const [groups, totalCount] = await prisma.$transaction([
      prisma.group.findMany({
        where,
        skip: (page - 1) * limit,
        take: parseInt(limit),
        orderBy: { created_at: 'desc' }
      }),
      prisma.group.count({ where })
    ]);

    return {
      groups,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    };
  }

  /**
   * Get a group by ID
   * @param {string} groupId - Group ID
   * @returns {Promise<Object>} Group object
   */
  async getGroupById(groupId) {
    return prisma.group.findUnique({
      where: { id: groupId }
    });
  }

  /**
   * Update group settings
   * @param {string} groupId - Group ID
   * @param {Object} data - Fields to update
   * @returns {Promise<Object>} Updated group
   */
  async updateGroup(groupId, data) {
    const allowedUpdates = [
      'name', 'type', 'visibility', 'agent_enabled', 'archived_at'
    ];

    const updateData = {};
    allowedUpdates.forEach(key => {
      if (data[key] !== undefined) {
        updateData[key] = data[key];
      }
    });

    return prisma.group.update({
      where: { id: groupId },
      data: updateData,
      select: {
        id: true,
        name: true,
        type: true,
        visibility: true,
        agent_enabled: true,
        archived_at: true,
        updated_at: true
      }
    });
  }

  /**
   * Suspend a group (disable agent access and optionally archive)
   * @param {string} groupId - Group ID
   * @param {boolean} archive - Whether to archive the group
   * @returns {Promise<Object>} Updated group
   */
  async suspendGroup(groupId, archive = false) {
    const updateData = {
      agent_enabled: false
    };

    if (archive) {
      updateData.archived_at = new Date();
    }

    return prisma.group.update({
      where: { id: groupId },
      data: updateData,
      select: {
        id: true,
        name: true,
        agent_enabled: true,
        archived_at: true
      }
    });
  }

  /**
   * Remove a member from a group
   * @param {string} groupId - Group ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Result of removal operation
   */
  async removeGroupMember(groupId, userId) {
    // Check if the membership exists
    const membership = await prisma.groupMember.findFirst({
      where: {
        group_id: groupId,
        user_id: userId
      }
    });

    if (!membership) {
      throw new Error(`User is not a member of this group`);
    }

    // Remove the membership
    await prisma.groupMember.delete({
      where: {
        id: membership.id
      }
    });

    return {
      success: true,
      groupId,
      userId,
      message: `User removed from group successfully`
    };
  }

  /**
   * Get group statistics
   * @returns {Promise<Object>} Group statistics
   */
  async getGroupStats() {
    const [totalGroups, activeGroups, groupsByType, groupsByVisibility] = await prisma.$transaction([
      prisma.group.count(),
      prisma.group.count({ where: { archived_at: null } }),
      prisma.group.groupBy({
        by: ['type'],
        _count: true
      }),
      prisma.group.groupBy({
        by: ['visibility'],
        _count: true
      })
    ]);

    return {
      totalGroups,
      activeGroups,
      groupsByType: Object.fromEntries(
        groupsByType.map(g => [g.type, g._count])
      ),
      groupsByVisibility: Object.fromEntries(
        groupsByVisibility.map(g => [g.visibility, g._count])
      )
    };
  }
}

module.exports = new GroupManagementService();