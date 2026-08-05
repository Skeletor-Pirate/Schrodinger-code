/**
 * Services Index
 * Exports all services for initialization
 */

const adminServices = require('./admin/index');
const agentTools = require('./agent-tools');
const conflictResolutionService = require('./conflict-resolution-service');
const memorySummarizationWorker = require('./memory-summarization-worker');
const pluginSandboxWorker = require('./plugin-sandbox-worker');
const pluginSecurityService = require('./plugin-security-service');
const vaultSyncWorker = require('./vault-sync-worker');

module.exports = {
  admin: adminServices,
  agentTools,
  conflictResolutionService,
  memorySummarizationWorker,
  pluginSandboxWorker,
  pluginSecurityService,
  vaultSyncWorker
};