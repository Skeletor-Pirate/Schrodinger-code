/**
 * Conflict Resolution Service
 * Handles merge conflicts in the Obsidian vault
 * Implements automatic conflict resolution strategies
 */

const fs = require('fs').promises;
const path = require('path');

class ConflictResolutionService {
  constructor() {
    this.vaultPath = process.env.VAULT_PATH || './vault';
    this.conflictMarker = '<<<<<<< HEAD\n';
  }

  /**
   * Detect if a file has conflict markers
   * @param {string} filePath - Absolute path to the file
   * @returns {boolean} True if conflict markers are found
   */
  async hasConflictMarkers(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      return content.includes('<<<<<<< HEAD') &&
             content.includes('=======') &&
             content.includes('>>>>>>>');
    } catch (error) {
      // If file doesn't exist or can't be read, no conflict
      return false;
    }
  }

  /**
   * Extract the three parts of a conflict (ours, theirs, base)
   * @param {string} content - File content with conflict markers
   * @returns {{ours: string, theirs: string, base: string}} The three parts
   */
  extractConflictParts(content) {
    const oursMatch = content.match(/<<<<<<< HEAD\n([\s\S]*?)\n=======/);
    const theirsMatch = content.match(/=======\n([\s\S]*?)\n>>>>>>>/);
    const baseMatch = content.match(/>>>>>>>\n([\s\S]*?)$/);

    return {
      ours: oursMatch ? oursMatch[1] : '',
      theirs: theirsMatch ? theirsMatch[1] : '',
      base: baseMatch ? baseMatch[1] : ''
    };
  }

  /**
   * Resolve a conflict using the specified strategy
   * @param {string} filePath - Absolute path to the file
   * @param {string} strategy - Resolution strategy ('ours', 'theirs', 'union', 'merge')
   * @returns {Promise<string>} Resolved content
   */
  async resolveConflict(filePath, strategy = 'auto') {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const { ours, theirs, base } = this.extractConflictParts(content);

      let resolvedContent;

      switch (strategy) {
        case 'ours':
          resolvedContent = ours;
          break;
        case 'theirs':
          resolvedContent = theirs;
          break;
        case 'union':
          // Simple union - concatenate both sides
          resolvedContent = `${ours}\n\n${theirs}`;
          break;
        case 'merge':
          // Try to merge intelligently (simple line-based merge for now)
          resolvedContent = this.simpleLineMerge(ours, theirs, base);
          break;
        case 'auto':
        default:
          // Automatic strategy: try to merge, fallback to union if merge fails
          resolvedContent = this.simpleLineMerge(ours, theirs, base);
          // If the merge didn't actually change anything (likely no real conflict),
          // or if it looks like it failed, use union
          if (resolvedContent === (ours + base + theirs) ||
              resolvedContent.includes('<<<<<<<')) {
            resolvedContent = `${ours}\n\n${theirs}`;
          }
          break;
      }

      // Write the resolved content back to the file
      await fs.writeFile(filePath, resolvedContent, 'utf8');

      return resolvedContent;
    } catch (error) {
      console.error(`[Conflict Resolution] Error resolving conflict in ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Simple line-based merge function
   * @param {string} ours - Our version
   * @param {string> theirs - Their version
   * @param {string} base - Base version
   * @returns {string} Merged content
   */
  simpleLineMerge(ours, theirs, base) {
    // For simplicity, we'll implement a basic approach:
    // If ours == base, take theirs
    // If theirs == base, take ours
    // If both changed differently, concatenate with a note

    const oursLines = ours.trim() ? ours.split('\n') : [];
    const theirsLines = theirs.trim() ? theirs.split('\n') : [];
    const baseLines = base.trim() ? base.split('\n') : [];

    // If ours is same as base, take theirs
    if (this.arraysEqual(oursLines, baseLines)) {
      return theirs;
    }

    // If theirs is same as base, take ours
    if (this.arraysEqual(theirsLines, baseLines)) {
      return ours;
    }

    // If both are same (no real conflict), return either
    if (this.arraysEqual(oursLines, theirsLines)) {
      return ours;
    }

    // Otherwise, attempt a simple merge by combining unique lines
    // This is a simplified approach - in practice, you'd want a proper diff/merge algorithm
    const allLines = new Set([
      ...oursLines.filter(line => line.trim() !== ''),
      ...theirsLines.filter(line => line.trim() !== '')
    ]);

    return Array.from(allLines).join('\n');
  }

  /**
   * Compare two arrays for equality
   * @param {Array} a - First array
   * @param {Array} b - Second array
   * @returns {boolean} True if arrays are equal
   */
  arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  /**
   * Scan the vault for files with conflict markers and resolve them
   * @param {string} strategy - Resolution strategy to use
   * @returns {Promise<Array>} List of resolved files
   */
  async autoResolveConflicts(strategy = 'auto') {
    const resolvedFiles = [];

    try {
      const files = await this.getAllMarkdownFiles(this.vaultPath);

      for (const filePath of files) {
        if (await this.hasConflictMarkers(filePath)) {
          await this.resolveConflict(filePath, strategy);
          resolvedFiles.push(filePath);
        }
      }

      if (resolvedFiles.length > 0) {
        console.log(`[Conflict Resolution] Auto-resolved ${resolvedFiles.length} conflicts`);
      }

      return resolvedFiles;
    } catch (error) {
      console.error('[Conflict Resolution] Error during auto-resolution:', error);
      throw error;
    }
  }

  /**
   * Get all markdown files in the vault recursively
   * @param {string} dir - Directory to search
   * @returns {Promise<Array>} List of markdown file paths
   */
  async getAllMarkdownFiles(dir) {
    const files = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const subFiles = await this.getAllMarkdownFiles(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * Create a conflict report for manual review
   * @param {string} filePath - Path to the conflicted file
   * @returns {Promise<Object>} Conflict report
   */
  async createConflictReport(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const { ours, theirs, base } = this.extractConflictParts(content);

      return {
        filePath,
        ours: ours || '(empty)',
        theirs: theirs || '(empty)',
        base: base || '(empty)',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`[Conflict Resolution] Error creating report for ${filePath}:`, error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const conflictResolutionService = new ConflictResolutionService();
module.exports = conflictResolutionService;

// If this script is run directly, allow testing
if (require.main === module) {
  const [, , filePath, strategy] = process.argv;

  if (!filePath) {
    console.error('Usage: node conflict-resolution-service.js <filePath> [strategy]');
    process.exit(1);
  }

  conflictResolutionService.resolveConflict(filePath, strategy || 'auto')
    .then(() => {
      console.log(`[Conflict Resolution] Resolved ${filePath}`);
      process.exit(0);
    })
    .catch(error => {
      console.error(`[Conflict Resolution] Failed to resolve ${filePath}:`, error);
      process.exit(1);
    });
}