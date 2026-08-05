/**
 * Plugin Security Service
 * Handles sandboxing, permission validation, and monitoring for plugins
 */

const { createWorker } = require('worker_threads');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');

class PluginSecurityService {
  constructor() {
    this.pluginsDir = process.env.PLUGINS_DIR || './plugins';
    this.sandboxTimeout = parseInt(process.env.PLUGIN_SANDBOX_TIMEOUT_MS) || 5000; // 5 seconds
    this.maxMemory = parseInt(process.env.PLUGIN_MAX_MEMORY_MB) * 1024 * 1024 || 50 * 1024 * 1024; // 50 MB default
    this.activeWorkers = new Map(); // pluginId => worker
    this.permissionCache = new Map(); // pluginId => permissions
    this.auditLog = []; // In-memory audit log (would be persisted in production)

    // Ensure plugins directory exists
    this.ensurePluginsDirectory();
  }

  /**
   * Ensure the plugins directory exists
   */
  async ensurePluginsDirectory() {
    try {
      await fs.mkdir(this.pluginsDir, { recursive: true });
      await fs.mkdir(path.join(this.pluginsDir, 'marketplace'), { recursive: true });
      await fs.mkdir(path.join(this.pluginsDir, 'installed'), { recursive: true });
    } catch (error) {
      console.error('Failed to ensure plugins directory:', error);
    }
  }

  /**
   * Validate a plugin manifest
   * @param {Object} manifest - Plugin manifest to validate
   * @returns {{valid: boolean, errors: Array}} Validation result
   */
  validateManifest(manifest) {
    const errors = [];

    // Required fields
    if (!manifest.name) errors.push('Plugin name is required');
    if (!manifest.version) errors.push('Plugin version is required');
    if (!manifest.description) errors.push('Plugin description is required');
    if (!manifest.author) errors.push('Plugin author is required');
    if (!manifest.type) errors.push('Plugin type is required');

    // Validate type
    const validTypes = ['ui', 'tool', 'workflow', 'agent_skill', 'data_connector'];
    if (manifest.type && !validTypes.includes(manifest.type)) {
      errors.push(`Plugin type must be one of: ${validTypes.join(', ')}`);
    }

    // Validate permissions if present
    if (manifest.permissions) {
      if (!Array.isArray(manifest.permissions)) {
        errors.push('Plugin permissions must be an array');
      } else {
        const validPermissions = [
          'vault_read:', 'vault_write:', 'vault_search:',
          'chat_read:', 'chat_reply:', 'web_search:',
          'file_read:', 'task_create:', 'summary_create:',
          'hackathon_search:', 'plugin_invoke:', 'user_lookup:',
          'notification_send:'
        ];

        manifest.permissions.forEach((permission, index) => {
          if (typeof permission !== 'string') {
            errors.push(`Permission at index ${index} must be a string`);
          } else {
            const validPrefix = validPermissions.some(prefix => permission.startsWith(prefix));
            if (!validPrefix) {
              errors.push(`Permission "${permission}" is not valid. Must start with one of: ${validPermissions.join(', ')}`);
            }
          }
        });
      }
    }

    // Validate surfaces if present
    if (manifest.surfaces) {
      if (!Array.isArray(manifest.surfaces)) {
        errors.push('Plugin surfaces must be an array');
      } else {
        const validSurfaces = ['window', 'widget', 'panel', 'background'];
        manifest.surfaces.forEach((surface, index) => {
          if (typeof surface !== 'string') {
            errors.push(`Surface at index ${index} must be a string`);
          } else if (!validSurfaces.includes(surface)) {
            errors.push(`Surface "${surface}" is not valid. Must be one of: ${validSurfaces.join(', ')}`);
          }
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if a plugin has a specific permission
   * @param {string} pluginId - Plugin identifier
   * @param {string} permission - Permission to check
   * @returns {boolean} True if plugin has the permission
   */
  async hasPermission(pluginId, permission) {
    // Check cache first
    if (this.permissionCache.has(pluginId)) {
      const cachedPermissions = this.permissionCache.get(pluginId);
      return cachedPermissions.some(p =>
        permission.startsWith(p) || p.endsWith('*') && permission.startsWith(p.slice(0, -1))
      );
    }

    // Load permissions from manifest if not cached
    try {
      const manifest = await this.loadPluginManifest(pluginId);
      this.permissionCache.set(pluginId, manifest.permissions || []);
      return this.hasPermission(pluginId, permission); // Recursive call with cached values
    } catch (error) {
      console.error(`[Plugin Security] Error loading manifest for ${pluginId}:`, error);
      return false; // Deny by default on error
    }
  }

  /**
   * Load a plugin's manifest
   * @param {string} pluginId - Plugin identifier
   * @returns {Promise<Object>} Plugin manifest
   */
  async loadPluginManifest(pluginId) {
    const manifestPath = path.join(this.pluginsDir, 'installed', pluginId, 'manifest.json');
    try {
      const manifestContent = await fs.readFile(manifestPath, 'utf8');
      return JSON.parse(manifestContent);
    } catch (error) {
      throw new Error(`Failed to load manifest for plugin ${pluginId}: ${error.message}`);
    }
  }

  /**
   * Create a sandboxed worker for plugin execution
   * @param {string} pluginId - Plugin identifier
   * @param {string} entryPoint - Path to plugin entry point
   * @param {Object} args - Arguments to pass to the plugin
   * @returns {Promise<Worker>} Worker thread for plugin execution
   */
  async createSandboxedWorker(pluginId, entryPoint, args = {}) {
    // Validate plugin permissions before creating worker
    const manifest = await this.loadPluginManifest(pluginId);

    // Check if plugin is allowed to execute
    if (!manifest.enabled !== false && manifest.status !== 'suspended') {
      throw new Error(`Plugin ${pluginId} is not enabled or is suspended`);
    }

    // Create worker with limited resources
    const worker = new createWorker(
      path.resolve(__dirname, './plugin-sandbox-worker.js'),
      {
        workerData: {
          pluginId,
          entryPoint,
          args,
          vaultPath: process.env.VAULT_PATH,
          pluginsDir: this.pluginsDir,
          timeout: this.sandboxTimeout,
          maxMemory: this.maxMemory
        }
      }
    );

    // Track the worker
    this.activeWorkers.set(pluginId, worker);

    // Set up error handling
    worker.on('error', (err) => {
      this.logAuditEvent(pluginId, 'worker_error', { error: err.message });
      console.error(`[Plugin Security] Worker error for plugin ${pluginId}:`, err);
    });

    worker.on('exit', (code) => {
      this.activeWorkers.delete(pluginId);
      this.logAuditEvent(pluginId, 'worker_exit', { exitCode: code });

      if (code !== 0) {
        console.warn(`[Plugin Security] Plugin ${pluginId} exited with code ${code}`);
      }
    });

    // Set up message handling
    worker.on('message', (message) => {
      this.logAuditEvent(pluginId, 'worker_message', { message });
    });

    return worker;
  }

  /**
   * Execute a plugin function in a sandbox
   * @param {string} pluginId - Plugin identifier
   * @param {string} functionName - Name of the function to execute
   * @param {Array} args - Arguments to pass to the function
   * @returns {Promise<any>} Result of the function execution
   */
  async executePluginFunction(pluginId, functionName, args = []) {
    // Validate that the plugin has permission to execute
    const manifest = await this.loadPluginManifest(pluginId);

    // For now, we'll assume all plugins have execute permission if enabled
    // In a more sophisticated system, you'd check specific function permissions
    if (!this.hasPermission(pluginId, 'plugin_invoke:*')) {
      throw new Error(`Plugin ${pluginId} does not have permission to be invoked`);
    }

    // Check if we already have a worker for this plugin
    let worker = this.activeWorkers.get(pluginId);

    // If not, create one
    if (!worker) {
      const entryPoint = path.join(this.pluginsDir, 'installed', pluginId, manifest.entry || 'index.js');
      worker = await this.createSandboxedWorker(pluginId, entryPoint);
    }

    // Return a promise that resolves when the worker responds
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Plugin ${pluginId} execution timed out after ${this.sandboxTimeout}ms`));
      }, this.sandboxTimeout);

      const handler = (message) => {
        clearTimeout(timeoutId);
        if (message.type === 'result') {
          resolve(message.data);
        } else if (message.type === 'error') {
          reject(new Error(message.data));
        }
      };

      worker.once('message', handler);

      // Send the execution request
      worker.postMessage({
        type: 'execute',
        functionName,
        args
      });
    });
  }

  /**
   * Log an audit event
   * @param {string} pluginId - Plugin identifier
   * @param {string} eventType - Type of event
   * @param {Object} details - Event details
   */
  logAuditEvent(pluginId, eventType, details = {}) {
    const event = {
      timestamp: new Date().toISOString(),
      pluginId,
      eventType,
      details
    };

    this.auditLog.push(event);

    // Keep only last 1000 events in memory
    if (this.auditLog.length > 1000) {
      this.auditLog.shift();
    }

    // In a production system, this would be sent to a logging service or database
    console.log(`[Plugin Security Audit] ${pluginId}: ${eventType}`, details);
  }

  /**
   * Stop all active workers
   */
  async stopAllWorkers() {
    for (const [pluginId, worker] of this.activeWorkers) {
      worker.terminate();
    }
    this.activeWorkers.clear();
  }
}

// Create and export a singleton instance
const pluginSecurityService = new PluginSecurityService();
module.exports = pluginSecurityService;

// If this script is run directly, allow basic testing
if (require.main === module) {
  const [, , command, pluginId] = process.argv;

  async function runTest() {
    if (command === 'validate' && pluginId) {
      try {
        const manifest = await pluginSecurityService.loadPluginManifest(pluginId);
        const validation = pluginSecurityService.validateManifest(manifest);
        console.log('Validation result:', validation);
        process.exit(validation.valid ? 0 : 1);
      } catch (error) {
        console.error('Validation failed:', error.message);
        process.exit(1);
      }
    } else if (command === 'permission' && pluginId) {
      const [, , , permission] = process.argv;
      if (!permission) {
        console.error('Usage: node plugin-security-service.js permission <pluginId> <permission>');
        process.exit(1);
      }

      try {
        const hasPerm = await pluginSecurityService.hasPermission(pluginId, permission);
        console.log(`Plugin ${pluginId} has permission ${permission}:`, hasPerm);
        process.exit(hasPerm ? 0 : 1);
      } catch (error) {
        console.error('Permission check failed:', error.message);
        process.exit(1);
      }
    } else {
      console.error('Usage:');
      console.error('  node plugin-security-service.js validate <pluginId>');
      console.error('  node plugin-security-service.js permission <pluginId> <permission>');
      process.exit(1);
    }
  }

  runTest().catch(console.error);
}