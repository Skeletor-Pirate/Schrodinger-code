/**
 * Vault Sync Worker with Batching
 * Handles synchronization between operational database and Obsidian vault
 * Implements batching to prevent Git performance issues
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class VaultSyncWorker {
  constructor() {
    this.vaultPath = process.env.VAULT_PATH || './vault';
    this.batchInterval = parseInt(process.env.VAULT_BATCH_INTERVAL_MS) || 30000; // 30 seconds
    this.maxBatchSize = parseInt(process.env.VAULT_MAX_BATCH_SIZE) || 100;
    this.pendingWrites = new Map(); // filepath => {content, timestamp}
    this.isProcessing = false;
    this.lastCommitTime = Date.now();

    // Ensure vault directory exists
    this.ensureVaultDirectory();

    // Start the batch processing interval
    this.batchIntervalId = setInterval(() => this.processBatch(), this.batchInterval);
  }

  /**
   * Ensure the vault directory exists
   */
  async ensureVaultDirectory() {
    try {
      await fs.mkdir(this.vaultPath, { recursive: true });

      // Initialize git repository if not already initialized
      const gitDir = path.join(this.vaultPath, '.git');
      try {
        await fs.access(gitDir);
      } catch (error) {
        await execAsync('git init', { cwd: this.vaultPath });
        await execAsync('git config user.name "UNHINGED System"', { cwd: this.vaultPath });
        await execAsync('git config user.email "system@unhinged.app"', { cwd: this.vaultPath });

        // Create initial commit
        await fs.writeFile(path.join(this.vaultPath, '.gitignore'), '__MACOSX/\n.DS_Store\nThumbs.db\n');
        await execAsync('git add .', { cwd: this.vaultPath });
        await execAsync('git commit -m "Initial commit"', { cwd: this.vaultPath });
      }
    } catch (error) {
      console.error('Failed to ensure vault directory:', error);
    }
  }

  /**
   * Queue a write operation to the vault
   * @param {string} relativePath - Path relative to vault root
   * @param {string} content - Content to write
   */
  async queueWrite(relativePath, content) {
    const filePath = path.join(this.vaultPath, relativePath);

    // Ensure directory exists
    const dirPath = path.dirname(filePath);
    await fs.mkdir(dirPath, { recursive: true });

    // Add to pending writes
    this.pendingWrites.set(relativePath, {
      content,
      timestamp: Date.now(),
      filePath
    });

    // Process immediately if we've reached max batch size
    if (this.pendingWrites.size >= this.maxBatchSize) {
      await this.processBatch();
    }
  }

  /**
   * Process the batch of pending writes
   */
  async processBatch() {
    // Prevent concurrent processing
    if (this.isProcessing || this.pendingWrites.size === 0) {
      return;
    }

    this.isProcessing = true;
    const batchStartTime = Date.now();

    try {
      const writesToProcess = new Map(this.pendingWrites);
      this.pendingWrites.clear();

      // Write all files in the batch
      for (const [relativePath, { content }] of writesToProcess) {
        await fs.writeFile(path.join(this.vaultPath, relativePath), content, 'utf8');
      }

      // Commit changes to Git
        await this.commitChanges(writesToProcess.size);

      this.lastCommitTime = Date.now();

      // Log performance metrics
      const batchDuration = Date.now() - batchStartTime;
      console.log(`[Vault Sync] Processed batch of ${writesToProcess.size} writes in ${batchDuration}ms`);
    } catch (error) {
      console.error('[Vault Sync] Error processing batch:', error);
      // In case of error, Put the writes back in the queue
      for (const [relativePath, data] of writesToProcess) {
        this.pendingWrites.set(relativePath, data);
      }
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Commit changes to Git repository
   * @param {number} fileCount - Number of files changed in this batch
   */
  async commitChanges(fileCount) {
    try {
      // Check if there are any changes to commit
      const { stdout: statusOutput } = await execAsync('git status --porcelain', {
        cwd: this.vaultPath
      });

      if (!statusOutput.trim()) {
        // No changes to commit
        return;
      }

      // Add all changes
      await execAsync('git add .', { cwd: this.vaultPath });

      // Create commit message
      const timestamp = new Date().toISOString();
      const commitMessage = `chore(vault): sync ${fileCount} files at ${timestamp}`;

      // Commit changes
      await execAsync(`git commit -m "${commitMessage}"`, {
        cwd: this.vaultPath
      });

      // Optional: Push to remote if configured
      if (process.env.VAULT_GIT_REMOTE) {
        await execAsync('git push origin main || true', {
          cwd: this.vaultPath
        });
      }
    } catch (error) {
      console.error('[Vault Sync] Git commit error:', error);
      throw error;
    }
  }

  /**
   * Force process all pending writes immediately
   */
  async forceFlush() {
    if (this.pendingWrites.size > 0) {
      await this.processBatch();
    }
  }

  /**
   * Stop the worker (cleanup)
   */
  stop() {
    if (this.batchIntervalId) {
      clearInterval(this.batchIntervalId);
    }

    // Process any remaining writes before stopping
    return this.forceFlush();
  }
}

// Create and export a singleton instance
const vaultSyncWorker = new VaultSyncWorker();
module.exports = vaultSyncWorker;

// If this script is run directly, keep the process alive
if (require.main === module) {
  process.on('SIGINT', async () => {
    console.log('[Vault Sync] Shutting down...');
    await vaultSyncWorker.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('[Vault Sync] Shutting down...');
    await vaultSyncWorker.stop();
    process.exit(0);
  });
}