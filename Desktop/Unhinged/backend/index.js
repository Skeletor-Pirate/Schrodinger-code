/**
 * UNHINGED Backend Services
 * Entry point for accessing backend services
 */

const vaultSyncWorker = require('./services/vault-sync-worker');
const conflictResolutionService = require('./services/conflict-resolution-service');
const pluginSecurityService = require('./services/plugin-security-service');
const adminServices = require('./services/admin');
const memorySummarizationWorker = require('./services/memory-summarization-worker');

// Start the memory summarization worker
memorySummarizationWorker.start();

module.exports = {
  vaultSyncWorker,
  conflictResolutionService,
  pluginSecurityService,
  ...adminServices,
  memorySummarizationWorker
};