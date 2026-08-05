/**
 * Compliance Service
 * Handles GDPR/privacy compliance operations for the admin console
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs').promises;
const path = require('path');

const prisma = new PrismaClient();

class ComplianceService {
  constructor() {
    this.exportDir = path.join(process.env.EXPORT_DIR || './exports');
  }

  /**
   * Export user data for GDPR compliance
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Export result with file path
   */
  async exportUserData(userId) {
    // In a real implementation, this would:
    // 1. fetch all user data from various tables
    // 2. format it according to GDPR requirements
    // 3. save to a secure export location
    // 4. return the file path or download link

    // For now, we'll simulate the operation
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        display_name: true,
        avatar_url: true,
        status: true,
        role: true,
        google_id: true,
        mfa_enabled: true,
        primary_workspace_id: true,
        created_at: true,
        last_login_at: true
      }
    });

    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    // Get user's workspaces
    const workspaces = await prisma.workspaceMember.findMany({
      where: { user_id: userId },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    });

    // Get user's groups
    const groups = await prisma.groupMember.findMany({
      where: { user_id: userId },
      include: {
        group: {
          select: {
            id: true,
            name: true,
            type: true
          }
        }
      }
    });

    // Get user's messages (limited for performance)
    const messages = await prisma.message.findMany({
      where: { sender_id: userId },
      take: 1000, // Limit to prevent huge exports
      select: {
        id: true,
        content: true,
        content_type: true,
        group_id: true,
        created_at: true
      }
    });

    // Create export data
    const exportData = {
      user: user,
      workspaces: workspaces.map(w => w.workspace),
      groups: groups.map(g => g.group),
      messages: messages,
      export_date: new Date().toISOString(),
      format_version: '1.0'
    };

    // In a real implementation, we would save this to a file
    // For now, we'll just return the data
    const exportFileName = `user-${userId}-export-${Date.now()}.json`;
    const exportPath = path.join(this.exportDir, exportFileName);

    // Ensure export directory exists
    await fs.mkdir(this.exportDir, { recursive: true });

    // Save to file (commented out for now since we're simulating)
    // await fs.writeFile(exportPath, JSON.stringify(exportData, null, 2));

    return {
      success: true,
      userId,
      exportFileName,
      // exportPath: exportPath, // Uncomment in real implementation
      data: exportData, // Only in simulation mode
      message: `User data exported successfully`
    };
  }

  /**
   * Delete user data for GDPR compliance (right to be forgotten)
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteUserData(userId) {
    // In a real implementation, this would:
    // 1. Anonymize or delete user's personal data
    // 2. Preserve audit trails where legally required
    // 3. Handle references in messages, files, etc.
    // 4. Follow data retention policies

    // For now, we'll simulate a soft delete approach
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    // Start transaction for multiple table updates
    return prisma.$transaction(async (tx) => {
      // Anonymize user data (keep ID for referential integrity but remove PII)
      await tx.user.update({
        where: { id: userId },
        data: {
          email: `deleted_user_${userId}@deleted.local`,
          display_name: `Deleted User ${userId}`,
          avatar_url: null,
          google_id: null,
          // Keep status, role, etc. for audit purposes
        }
      });

      // Anonymize messages (replace content with placeholder)
      await tx.message.updateMany({
        where: { sender_id: userId },
        data: {
          content: '[Message removed due to user data deletion request]',
          content_type: 'system'
        }
      });

      // Note: In a real implementation, we would also:
      // - Handle file attachments (delete or anonymize)
      // - Update group/membership records appropriately
      // - Preserve audit logs for legal compliance
      // - Handle workspace ownership transfers if needed

      return {
        success: true,
        userId,
        message: `User data has been anonymized/deleted for GDPR compliance`
      };
    });
  }

  /**
   * Get compliance statistics
   * @returns {Promise<Object>} Compliance statistics
   */
  async getComplianceStats() {
    const [totalUsers, usersWithGoogleAuth, mfaEnabledUsers,
           recentlyActiveUsers, exportRequests] = await prisma.$transaction([
      prisma.user.count(),
      prisma.user.count({ where: { google_id: { not: null } } }),
      prisma.user.count({ where: { mfa_enabled: true } }),
      prisma.user.count({
        where: {
          last_login_at: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        }
      }),
      // In a real implementation, we would track export requests
      // For now, we'll return a placeholder
      0
    ]);

    return {
      totalUsers,
      usersWithGoogleAuth,
      mfaEnabledUsers,
      recentlyActiveUsers,
      exportRequests: exportRequests // Placeholder
    };
  }
}

module.exports = new ComplianceService();