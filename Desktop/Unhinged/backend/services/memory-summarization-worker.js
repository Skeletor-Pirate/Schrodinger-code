/**
 * Memory Summarization Worker
 * Periodically summarizes old memories to reduce storage and improve retrieval performance
 *
 * Environment Variables:
 *   MEMORY_SUMMARIZATION_INTERVAL_HOURS: How often to run summarization (default: 24)
 *   MEMORY_SUMMARIZATION_BATCH_SIZE: Number of memories to process per batch (default: 100)
 *   MEMORY_MAX_AGE_FOR_SUMMARIZATION_DAYS: Maximum age of memories to summarize (default: 30)
 */

const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');
const { execSync } = require('child_process');

const prisma = new PrismaClient();

class MemorySummarizationWorker {
  constructor() {
    this.isRunning = false;
    // Configure from environment variables with sensible defaults
    this.summarizationInterval = parseInt(process.env.MEMORY_SUMMARIZATION_INTERVAL_HOURS || '24') * 60 * 60 * 1000;
    this.batchSize = parseInt(process.env.MEMORY_SUMMARIZATION_BATCH_SIZE || '100');
    this.maxAgeForSummarization = parseInt(process.env.MEMORY_MAX_AGE_FOR_SUMMARIZATION_DAYS || '30') * 24 * 60 * 60 * 1000;
  }

  /**
   * Start the memory summarization worker
   */
  async start() {
    if (this.isRunning) {
      console.log('Memory summarization worker is already running');
      return;
    }

    this.isRunning = true;
    console.log('Starting memory summarization worker...');

    // Run initial summarization
    await this.summarizeOldMemories();

    // Set up periodic summarization
    this.intervalId = setInterval(async () => {
      try {
        await this.summarizeOldMemories();
      } catch (error) {
        console.error('Error in memory summarization worker:', error);
      }
    }, this.summarizationInterval);

    console.log(`Memory summarization worker started. Will run every ${this.summarizationInterval / (60 * 60 * 1000)} hours`);
  }

  /**
   * Stop the memory summarization worker
   */
  stop() {
    if (!this.isRunning) {
      console.log('Memory summarization worker is not running');
      return;
    }

    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    console.log('Memory summarization worker stopped');
  }

  /**
   * Summarize old memories that are older than maxAgeForSummarization
   */
  async summarizeOldMemories() {
    try {
      console.log('[Memory Worker] Starting memory summarization process...');

      // Get old memories that haven't been summarized yet
      const oldMemories = await prisma.memory.findMany({
        where: {
          createdAt: {
            lt: new Date(Date.now() - this.maxAgeForSummarization)
          },
          OR: [
            { summary: null },
            { summary: '' }
          ]
        },
        take: this.batchSize,
        orderBy: {
          createdAt: 'asc'
        }
      });

      if (oldMemories.length === 0) {
        console.log('[Memory Worker] No old memories found for summarization');
        return;
      }

      console.log(`[Memory Worker] Found ${oldMemories.length} memories to summarize (batch size: ${this.batchSize}, max age: ${this.maxAgeForSummarization / (24 * 60 * 60 * 1000)} days)`);

      // Process each memory
      let successful = 0;
      let failed = 0;
      for (const memory of oldMemories) {
        try {
          // Generate summary using a simple extraction approach
          // In a production system, this would use an LLM service
          const summary = await this.generateMemorySummary(memory.content);

          // Update the memory with the summary
          await prisma.memory.update({
            where: { id: memory.id },
            data: { summary }
          });

          console.log(`[Memory Worker] Summarized memory ${memory.id}`);
          successful++;
        } catch (error) {
          console.error(`[Memory Worker] Failed to summarize memory ${memory.id}:`, error);
          failed++;
          // Continue with other memories even if one fails
        }
      }

      console.log(`[Memory Worker] Completed summarization batch. Successfully processed ${successful}/${oldMemories.length} memories (${failed} failed)`);
    } catch (error) {
      console.error('[Memory Worker] Error during memory summarization:', error);
    }
  }

  /**
   * Generate a summary of memory content
   * In a production system, this would use an LLM service
   * For now, we'll use a simple extraction-based approach
   */
  async generateMemorySummary(content) {
    if (!content || content.length < 100) {
      return content; // Return original content if too short to summarize
    }

    // Simple extraction-based summarization
    // Take first and last sentences, plus any sentences with keywords
    const sentences = content.split(/(?<=[.!?])\s+/);

    if (sentences.length <= 3) {
      return content;
    }

    // Extractive summarization: take first sentence, last sentence, and middle sentence
    const firstSentence = sentences[0];
    const lastSentence = sentences[sentences.length - 1];
    const middleIndex = Math.floor(sentences.length / 2);
    const middleSentence = sentences[middleIndex];

    // Combine into a summary
    let summary = `${firstSentence} ${middleSentence} ${lastSentence}`;

    // Ensure it's not too long
    if (summary.length > 500) {
      summary = summary.substring(0, 497) + '...';
    }

    return summary.trim();
  }

  /**
   * Get statistics about memories that could be summarized
   */
  async getSummarizationStats() {
    try {
      console.log('[Memory Worker] Getting summarization statistics...');

      const oldUnsummarizedCount = await prisma.memory.count({
        where: {
          createdAt: {
            lt: new Date(Date.now() - this.maxAgeForSummarization)
          },
          OR: [
            { summary: null },
            { summary: '' }
          ]
        }
      });

      const totalMemories = await prisma.memory.count();
      const summarizedMemories = await prisma.memory.count({
        where: {
          NOT: [
            { summary: null },
            { summary: '' }
          ]
        }
      });

      const stats = {
        totalMemories,
        summarizedMemories,
        unsummarizedMemories: totalMemories - summarizedMemories,
        oldUnsummarizedCount: oldUnsummarizedCount,
        summarizationReady: oldUnsummarizedCount > 0
      };

      console.log(`[Memory Worker] Stats: ${JSON.stringify(stats)}`);
      return stats;
    } catch (error) {
      console.error('[Memory Worker] Error getting summarization stats:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const memorySummarizationWorker = new MemorySummarizationWorker();
module.exports = memorySummarizationWorker;