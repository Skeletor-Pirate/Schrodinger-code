/**
 * Audit Log Service
 * Handles audit logging for the admin console
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class AuditLogService {
  /**
   * Log an audit event
   * @param {Object} event - Audit event data
   * @returns {Promise<Object>} Created audit log entry
   */
  async logEvent(event) {
    const {
      userId,
      action,
      resourceType,
      resourceId,
      details,
      ipAddress,
      userAgent
    } = event;

    return prisma.auditLog.create({
      data: {
        user_id: userId,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        details: details || {},
        ip_address: ipAddress,
        user_agent: userAgent
      }
    });
  }

  /**
   * Get audit logs with filtering and pagination
   * @param {Object} filters - Filter options (userId, action, resourceType, dateRange)
   * @param {Object} pagination - Pagination options (page, limit)
   * @returns {Promise<Object>} Audit logs with pagination
   */
  async getAuditLogs(filters = {}, pagination = {}) {
    const {
      userId,
      action,
      resourceType,
      startDate,
      endDate
    } = filters;

    const { page = 1, limit = 100 } = pagination;

    const where = {};

    if (userId) where.user_id = userId;
    if (action) where.action = action;
    if (resourceType) where.resource_type = resourceType;
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = new Date(startDate);
      if (endDate) where.timestamp.lte = new Date(endDate);
    }

    const [logs, totalCount] = await prisma.$transaction([
      prisma.auditLog.findMany({
        where,
        skip: (page - 1) * limit,
        take: parseInt(limit),
        orderBy: { timestamp: 'desc' },
        select: {
          id: true,
          user_id: true,
          action: true,
          resource_type: true,
          resource_id: true,
          details: true,
          ip_address: true,
          user_agent: true,
          timestamp: true,
          user: {
            select: {
              id: true,
              email: true,
              display_name: true
            }
          }
        }
      }),
      prisma.auditLog.count({ where })
    ]);

    return {
      logs,
      pagination: {
        page,
        limit: parseInt(limit),
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    };
  }

  /**
   * Get audit statistics
   * @returns {Promise<Object>} Audit statistics
   */
  async getAuditStats() {
    const [totalLogs, logsByAction, logsByUser, recentActivity] = await prisma.$transaction([
      prisma.auditLog.count(),
      prisma.auditLog.groupBy({
        by: ['action'],
        _count: true
      }),
      prisma.auditLog.groupBy({
        by: ['user_id'],
        _count: true,
        orderBy: { _count: 'desc' },
        take: 10
      }),
      prisma.auditLog.findMany({
        where: {
          timestamp: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        },
        orderBy: { timestamp: 'desc' },
        take: 10,
        select: {
          id: true,
          action: true,
          resource_type: true,
          timestamp: true,
          user: {
            select: {
              id: true,
              display_name: true
            }
          }
        }
      })
    ]);

    return {
      totalLogs,
      logsByAction: Object.fromEntries(
        logsByAction.map(a => [a.action, a._count])
      ),
      topActiveUsers: logsByUser.map(u => ({
        userId: u.user_id,
        actionCount: u._count
      })),
      recentActivity
    };
  }
}

module.exports = new AuditLogService();