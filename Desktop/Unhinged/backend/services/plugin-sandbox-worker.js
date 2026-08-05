/**
 * Plugin Sandbox Worker
 * Runs in a separate thread to provide isolation for plugin execution
 */

const { parentPort, workerData } = require('worker_threads');
const fs = require('fs').promises;
const path = require('path');
const vm = require('vm');

// Extract worker data
const {
  pluginId,
  entryPoint,
  args,
  vaultPath,
  pluginsDir,
  timeout,
  maxMemory
} = workerData;

// Set up a timeout for the worker
let timeoutId = setTimeout(() => {
  console.error(`[Plugin Sandbox] Timeout exceeded for plugin ${pluginId}`);
  process.exit(1);
}, timeout);

// Memory usage monitoring
const checkMemoryUsage = () => {
  const used = process.memoryUsage().heapUsed;
  if (used > maxMemory) {
    console.error(`[Plugin Sandbox] Memory limit exceeded for plugin ${pluginId}`);
    process.exit(1);
  }
};

// Check memory every second
const memoryInterval = setInterval(checkMemoryUsage, 1000);

// Create a sandbox context for the plugin
const sandbox = {
  // Global-like objects that are safe to expose
  console: {
    log: (...args) => parentPort.postMessage({ type: 'log', data: args }),
    error: (...args) => parentPort.postMessage({ type: 'error', data: args }),
    warn: (...args) => parentPort.postMessage({ type: 'warn', data: args })
  },
  // Safe APIs
  Buffer,
  process: {
    env: process.env,
    // Only expose safe parts of process
    version: process.version,
    versions: process.versions,
    // Expose only what's needed
    nextTick: global.process.nextTick.bind(global.process)
  },
  // Path and URL utilities
  path,
  // Safe timers
  setTimeout: global.setTimeout.bind(global),
  clearTimeout: global.clearTimeout.bind(global),
  setInterval: global.setInterval.bind(global),
  clearInterval: global.clearInterval.bind(global),
  // Require with restrictions
  require: createSafeRequire(),
  // Vault access (restricted)
  vault: {
    readFile: createSafeVaultRead(),
    writeFile: createSafeVaultWrite()
  }
};

// Safe require function that limits what can be required
function createSafeRequire() {
  return function(moduleId) {
    // Only allow certain built-in modules
    const allowedBuiltins = [
      'fs', 'path', 'os', 'util', 'events', 'stream',
      'buffer', 'util', 'querystring', 'url', 'string_decoder',
      'assert', 'child_process', 'cluster', 'crypto', 'dgram',
      'dns', 'domain', 'events', 'http', 'https', 'net',
      'os', 'path', 'process', 'punystring', 'querystring',
      'readline', 'repl', 'smalloc', 'tls', 'tracing', 'tty',
      'url', 'util', 'v8', 'vm', 'zlib'
    ];

    // Check if it's an allowed built-in
    if (allowedBuiltins.includes(moduleId)) {
      return require(moduleId);
    }

    // For local modules, restrict to plugin directory only
    if (!moduleId.startsWith('.') && !moduleId.startsWith('/')) {
      throw new Error(`Cannot require external module: ${moduleId}`);
    }

    // Resolve the module path relative to the plugin directory
    const resolvedPath = path.resolve(pluginsDir, 'installed', pluginId, moduleId);

    // Ensure the resolved path is still within the plugin directory
    if (!resolvedPath.startsWith(path.resolve(pluginsDir, 'installed', pluginId))) {
      throw new Error(`Cannot access files outside plugin directory: ${moduleId}`);
    }

    try {
      return require(resolvedPath);
    } catch (error) {
      throw new Error(`Failed to require module ${moduleId}: ${error.message}`);
    }
  };
}

// Safe vault read function
function createSafeVaultRead() {
  return async function(relativePath) {
    // Validate the path is safe
    if (typeof relativePath !== 'string') {
      throw new Error('Path must be a string');
    }

    // Prevent directory traversal
    if (relativePath.includes('..') || relativePath.startsWith('/')) {
      throw new Error('Invalid path: directory traversal not allowed');
    }

    // Ensure it's within the vault
    const fullPath = path.resolve(vaultPath, relativePath);
    if (!fullPath.startsWith(vaultPath)) {
      throw new Error('Cannot access files outside vault');
    }

    try {
      const content = await fs.readFile(fullPath, 'utf8');
      return content;
    } catch (error) {
      throw new Error(`Failed to read vault file ${relativePath}: ${error.message}`);
    }
  };
}

// Safe vault write function
function createSafeVaultWrite() {
  return async function(relativePath, content) {
    // Validate inputs
    if (typeof relativePath !== 'string') {
      throw new Error('Path must be a string');
    }
    if (typeof content !== 'string') {
      throw new Error('Content must be a string');
    }

    // Prevent directory traversal
    if (relativePath.includes('..') || relativePath.startsWith('/')) {
      throw new Error('Invalid path: directory traversal not allowed');
    }

    // Ensure it's within the vault
    const fullPath = path.resolve(vaultPath, relativePath);
    if (!fullPath.startsWith(vaultPath)) {
      throw new Error('Cannot access files outside vault');
    }

    try {
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, content, 'utf8');
    } catch (error) {
      throw new Error(`Failed to write vault file ${relativePath}: ${error.message}`);
    }
  };
}

// Message handler for requests from the main thread
async function handleMessage(message) {
  try {
    switch (message.type) {
      case 'execute':
        // Clear any previous timeout
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          console.error(`[Plugin Sandbox] Execution timeout for plugin ${pluginId}`);
          process.exit(1);
        }, timeout);

        // Execute the requested function
        const pluginModule = require(path.resolve(pluginsDir, 'installed', pluginId, entryPoint));

        if (typeof pluginModule[message.functionName] !== 'function') {
          throw new Error(`Function ${message.functionName} not found in plugin ${pluginId}`);
        }

        const result = await pluginModule[message.functionName](...message.args);

        // Send result back
        parentPort.postMessage({ type: 'result', data: result });
        break;

      case 'ping':
        parentPort.postMessage({ type: 'pong' });
        break;

      default:
        throw new Error(`Unknown message type: ${message.type}`);
    }
  } catch (error) {
    // Send error back to main thread
    parentPort.postMessage({ type: 'error', data: error.message });
  } finally {
    // Reset timeout
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      console.error(`[Plugin Sandbox] Timeout exceeded for plugin ${pluginId}`);
      process.exit(1);
    }, timeout);
  }
}

// Listen for messages from the main thread
parentPort.on('message', handleMessage);

// Initialize the plugin when the worker starts
parentPort.postMessage({ type: 'ready' });

// Cleanup on process exit
process.on('exit', () => {
  clearInterval(memoryInterval);
  clearTimeout(timeoutId);
});