/**
 * Admin Services Index
 * Exports all admin-related services
 */

const userManagementService = require('./user-management-service');
const workspaceManagementService = require('./workspace-management-service');
const auditLogService = require('./audit-log-service');
const pluginManagementService = require('./plugin-management-service');
const agentManagementService = require('./agent-management-service');
const groupManagementService = require('./group-management-service');
const complianceService = require('./compliance-service');

module.exports = {
  userManagement: userManagementService,
  workspaceManagement: workspaceManagementService,
  auditLog: auditLogService,
  pluginManagement: pluginManagementService,
  agentManagement: agentManagementService,
  groupManagement: groupManagementService,
  compliance: complianceService
};