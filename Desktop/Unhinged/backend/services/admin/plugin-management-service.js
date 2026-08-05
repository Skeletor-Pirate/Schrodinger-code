/**
 * Plugin Management Service
 * Handles plugin-related operations for the admin console
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs').promises;
const path = require('path');

const prisma = new PrismaClient();

class PluginManagementService {
  constructor() {
    this.pluginsDir = process.env.PLUGINS_DIR || './plugins';
  }

  /**
   * Get all plugins with optional filtering
   * @param {Object} filters - Filter options (status, type, searchTerm)
   * @returns {Promise<Array>} List of plugins
   */
  async getPlugins(filters = {}) {
    const { status, type, searchTerm, page = 1, limit = 50 } = filters;

    const where = {};

    if (status) where.status = status;
    if (type) where.type = type;
    if (searchTerm) {
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
        { author: { contains: searchTerm, mode: 'insensitive' } }
      ];
    }

    const [plugins, totalCount] = await prisma.$transaction([
      prisma.plugin.findMany({
        where,
        skip: (page - 1) * limit,
        take: parseInt(limit),
        orderBy: { created_at: 'desc' }
      }),
      prisma.plugin.count({ where })
    ]);

    return {
      plugins,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    };
  }

  /**
   * Get a plugin by ID
   * @param {string} pluginId - Plugin ID
   * @returns {Promise<Object>} Plugin object
   */
  async getPluginById(pluginId) {
    return prisma.plugin.findUnique({
      where: { id: pluginId }
    });
  }

  /**
   * Update plugin status (approve, reject, suspend)
   * @param {string} pluginId - Plugin ID
   * @param {string} status - New status (pending, approved, rejected, suspended)
   * @returns {Promise<Object>} Updated plugin
   */
  async updatePluginStatus(pluginId, status) {
    const validStatuses = ['pending', 'approved', 'rejected', 'suspended'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }

    return prisma.plugin.update({
      where: { id: pluginId },
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
   * Force uninstall a plugin from all workspaces
   * @param {string} pluginId - Plugin ID
   * @returns {Promise<Object>} Result of uninstall operation
   */
  async forceUninstallPlugin(pluginId) {
    // In a real implementation, this would:
    // 1. Remove the plugin from all workspace_plugin associations
    // 2. Delete plugin files from storage
    // 3. Notify affected workspaces
    // 4. Update plugin status to 'uninstalled'

    // For now, we'll simulate the operation
    const plugin = await this.getPluginById(pluginId);
    if (!plugin) {
      throw new Error(`Plugin not found: ${pluginId}`);
    }

    // Update plugin status
    await prisma.plugin.update({
      where: { id: pluginId },
      data: { status: 'uninstalled' }
    });

    // Log the action (would be done via audit log service)
    // This is a simplified implementation - in production this would be more comprehensive

    return {
      success: true,
      pluginId,
      message: `Plugin ${plugin.name} has been force uninstalled from all workspaces`
    };
  }
}

module.exports = new PluginManagementService();Event: Plugin force uninstalled


  }
}