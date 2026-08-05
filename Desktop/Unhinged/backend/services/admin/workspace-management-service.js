/**
 * Workspace Management Service
 * Handles workspace-related operations for the admin console
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class WorkspaceManagementService {
  /**
   * Get all workspaces with optional filtering
   * @param {Object} filters - Filter options (visibility, ownerId, searchTerm)
   * @returns {Promise<Array>} List of workspaces
   */
  async getWorkspaces(filters = {}) {
    const { visibility, ownerId, searchTerm, page = 1, limit = 50 } = filters;

    const where = {};

    if (visibility) where.visibility = visibility;
    if (ownerId) where.owner_user_id = ownerId;
    if (searchTerm) {
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { slug: { contains: searchTerm, mode: 'insensitive' } }
      ];
    }

    const [workspaces, totalCount] = await prisma.$transaction([
      prisma.workspace.findMany({
        where,
        skip: (page - 1) * limit,
        take: parseInt(limit),
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          name: true,
          slug: true,
          owner_user_id: true,
          visibility: true,
          retention_policy: true,
          e2ee_enabled: true,
          vault_path: true,
          max_members: true,
          created_at: true,
          updated_at: true
        }
      }),
      prisma.workspace.count({ where })
    ]);

    return {
      workspaces,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    };
  }

  /**
   * Get a workspace by ID
   * @param {string} workspaceId - Workspace ID
   * @returns {Promise<Object>} Workspace object
   */
  async getWorkspaceById(workspaceId) {
    return prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: {
        id: true,
        name: true,
        slug: true,
        owner_user_id: true,
        visibility: true,
        retention_policy: true,
        e2ee_enabled: true,
        vault_path: true,
        max_members: true,
        created_at: true,
        updated_at: true
      }
    });
  }

  /**
   * Update workspace settings
   * @param {string} workspaceId - Workspace ID
   * @param {Object} data - Fields to update
   * @returns {Promise<Object>} Updated workspace
   */
  async updateWorkspace(workspaceId, data) {
    const allowedUpdates = [
      'name', 'visibility', 'retention_policy',
      'e2ee_enabled', 'vault_path', 'max_members'
    ];

    const updateData = {};
    allowedUpdates.forEach(key => {
      if (data[key] !== undefined) {
        updateData[key] = data[key];
      }
    });

    return prisma.workspace.update({
      where: { id: workspaceId },
      data: updateData,
      select: {
        id: true,
        name: true,
        slug: true,
        visibility: true,
        e2ee_enabled: true,
        updated_at: true
      }
    });
  }

  /**
   * Get workspace statistics
   * @returns {Promise<Object>} Workspace statistics
   */
  async getWorkspaceStats() {
    const [totalWorkspaces, activeWorkspaces, workspacesByVisibility,
           e2eeEnabledCount, totalMembers] = await prisma.$transaction([
      prisma.workspace.count(),
      prisma.workspace.count({ where: { visibility: { not: 'private' } } }), // Assuming non-private means active
      prisma.workspace.groupBy({
        by: ['visibility'],
        _count: true
      }),
      prisma.workspace.count({ where: { e2ee_enabled: true } }),
      prisma.workspace_members.count()
    ]);

    return {
      totalWorkspaces,
      activeWorkspaces,
      workspacesByVisibility: Object.fromEntries(
        workspacesByVisibility.map(w => [w.visibility, w._count])
      ),
      e2eeEnabledCount,
      totalMembers
    };
  }

  /**
   * Get members of a workspace
   * @param {string} workspaceId - Workspace ID
   * @param {Object} filters - Filter options (role, status)
   * @returns {Promise<Array>} List of workspace members
   */
  async getWorkspaceMembers(workspaceId, filters = {}) {
    const { role, status, page = 1, limit = 50 } = filters;

    const where = { workspace_id: workspaceId };

    if (role) where.role = role;
    if (status) where.status = status;

    const [members, totalCount] = await prisma.$transaction([
      prisma.workspaceMember.findMany({
        where,
        skip: (page - 1) * limit,
        take: parseInt(limit),
        orderBy: { joined_at: 'desc' },
        select: {
          id: true,
          user_id: true,
          role: true,
          status: true,
          joined_at: true,
          muted_until: true,
          user: {
            select: {
              id: true,
              email: true,
              display_name: true,
              avatar_url: true
            }
          }
        }
      }),
      prisma.workspaceMember.count({ where })
    ]);

    return {
      members,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    };
  }
}

module.exports = new WorkspaceManagementService();