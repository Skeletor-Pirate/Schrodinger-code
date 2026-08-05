/**
 * Feedback Collector Node for Icebound Agent
 * Simulates feedback collection for learning (simulated)
 */

async function feedbackCollector(state) {
  const { event, persona, toolResults, reply } = state;

  // In a real implementation, this would:
  // 1. Collect implicit feedback (did user engage with response, ask follow-ups, etc.)
  // 2. Collect explicit feedback (user ratings, thumbs up/down, etc.)
  // 3. Use feedback to improve future agent responses
  // 4. Potentially trigger retraining or adjustment of agent parameters

  // For now, we'll simulate feedback collection

  try {
    // Simulate feedback based on response success and tool usage
    let feedbackScore = 0.5; // Default neutral score
    let feedbackReason = '';

    if (!reply || !reply.success) {
      feedbackScore = 0.2;
      feedbackReason = 'Agent failed to generate a successful response';
    } else {
      // Base score on whether we used tools successfully
      const successfulTools = state.toolResults
        ? state.toolResults.filter(r => r.success).length
        : 0;
      const totalTools = state.toolPlan ? state.toolPlan.tools.length : 0;

      if (totalTools > 0) {
        const toolSuccessRatio = successfulTools / totalTools;
        feedbackScore = 0.3 + (toolSuccessRatio * 0.5); // Range: 0.3 to 0.8
      } else {
        feedbackScore = 0.4; // No tools used but response succeeded
      }

      // Adjust based on Icebound-specific criteria
      // Icebound is successful if it provokes thought, even if not immediately useful
      const provocativeTools = state.toolResults
        ? state.toolResults.filter(r =>
            r.success &&
            ['roast', 'brainstorm'].includes(r.tool)
          ).length
        : 0;

      if (provocativeTools > 0) {
        feedbackScore = Math.min(0.95, feedbackScore + 0.15); // Bonus for provocative thinking
        feedbackReason = 'Generated provocative/challenging input';
      } else if (successfulTools > 0) {
        feedbackReason = 'Successfully executed requested tools';
      } else {
        feedbackReason = 'Provided response without tool usage';
      }

      // Add some randomness to simulate varied user reactions
      feedbackScore = Math.max(0.1, Math.min(0.9, feedbackScore + (Math.random() - 0.5) * 0.2));
    }

    const feedbackEntry = {
      agentId: 'icebound-agent-001',
      sessionId: `session-${Date.now()}`,
      timestamp: new Date().toISOString(),
      eventId: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      feedbackScore: feedbackScore, // 0.0 to 1.0
      feedbackType: 'simulated_implicit',
      feedbackReason: feedbackReason,
      context: {
        toolsUsed: state.toolPlan?.tools || [],
        successfulToolCount: state.toolResults
          ? state.toolResults.filter(r => r.success).length
          : 0,
        personaTone: persona?.tone,
        eventType: event.type
      }
    };

    // In a real implementation, we would store this feedback
    // For now, we'll just log what we would collect
    console.log('[Icebound Agent] Feedback collected:');
    console.log(JSON.stringify(feedbackEntry, null, 2));

    return {
      ...state,
      feedback: {
        success: true,
        entryId: `feedback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        score: feedbackScore,
        reason: feedbackReason,
        message: 'Successfully collected feedback for learning'
      }
    };
  } catch (error) {
    return {
      ...state,
      feedback: {
        success: false,
        error: `Failed to collect feedback: ${error.message}`
      }
    };
  }
}

module.exports = { feedbackCollector };