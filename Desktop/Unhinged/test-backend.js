// Simple test to verify backend service instances can be imported
try {
  const vaultSyncWorker = require('./backend/services/vault-sync-worker');
  const conflictResolutionService = require('./backend/services/conflict-resolution-service');
  const pluginSecurityService = require('./backend/services/plugin-security-service');

  console.log('✓ Backend service instances imported successfully');

  // Test that the instances have the expected methods
  console.log('\\nVault Sync Worker methods:');
  console.log('- queueWrite:', typeof vaultSyncWorker.queueWrite);
  console.log('- forceFlush:', typeof vaultSyncWorker.forceFlush);
  console.log('- stop:', typeof vaultSyncWorker.stop);

  console.log('\\nConflict Resolution Service methods:');
  console.log('- resolveConflict:', typeof conflictResolutionService.resolveConflict);
  console.log('- autoResolveConflicts:', typeof conflictResolutionService.autoResolveConflicts);
  console.log('- hasConflictMarkers:', typeof conflictResolutionService.hasConflictMarkers);

  console.log('\\nPlugin Security Service methods:');
  console.log('- hasPermission:', typeof pluginSecurityService.hasPermission);
  console.log('- executePluginFunction:', typeof pluginSecurityService.executePluginFunction);
  console.log('- validateManifest:', typeof pluginSecurityService.validateManifest);

  // Test that we can call a simple method that doesn't require initialization
  console.log('\\nTesting basic functionality...');

  // Test conflict resolution service - hasConflictMarkers with non-existent file should return false
  conflictResolutionService.hasConflictMarkers('/non/existent/file.md').then(result => {
    console.log('✓ hasConflictMarkers returned:', result);

    // Clean up vault sync worker
    return vaultSyncWorker.stop();
  }).then(() => {
    console.log('✓ VaultSyncWorker stopped cleanly');
    console.log('\\n✓ All basic tests successful');
  }).catch(err => {
    console.error('✗ Error during testing:', err.message);
    process.exit(1);
  });
} catch (error) {
  console.error('✗ Failed to import backend services:', error.message);
  console.error(error.stack);
  process.exit(1);
}