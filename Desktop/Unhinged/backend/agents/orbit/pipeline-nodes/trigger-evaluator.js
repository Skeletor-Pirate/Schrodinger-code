/**
 * Trigger Evaluator Node
 * Determines if the agent should respond based on trigger rules
 */

async function triggerEvaluator(state) {
  const { event, policyCheck } = state;

  // If policy check failed, don't proceed
  if (!policyCheck.passed) {
    return {
      ...state,
      triggerEvaluation: {
        shouldRespond: false,
        reason: policyCheck.reason
      }
    };
  }

  // In a real implementation, this would evaluate:
  // - Keyword triggers
  // - Mention triggers (@agent-name)
  // - Scheduled triggers
  // - Reply triggers (responding to specific messages)
  // - Proactive triggers (based on context analysis)

  const triggerRules = {
    keywords: ['orbit', 'assistant', 'help', 'summary', 'recap'],
    mentions: ['@orbit', '@assistant'],
    proactive: true // Orbit can be proactive
  };

  // Check if we should respond
  let shouldRespond = false;
  let reason = '';

  // Check for direct mentions
  const mentionMatch = triggerRules.mentions.some(mention =>
    event.content.includes(mention)
  );

  // Check for keywords
  const keywordMatch = triggerRules.keywords.some(keyword =>
    event.content.toLowerCase().includes(keyword.toLowerCase())
  );

  // Check if it's a reply to our previous message (would need context)
  const isReplyToUs = false; // Placeholder

  // Proactive check - Orbit can initiate conversations
  const proactiveTrigger = triggerRules.proactive &&
    Math.random() < 0.3; // 30% chance to be proactive for demo

  if (mentionMatch) {
    shouldRespond = true;
    reason = 'Direct mention detected';
  } else if (keywordMatch) {
    shouldRespond = true;
    reason = 'Keyword trigger detected';
  } else if (isReplyToUs) {
    shouldRespond = true;
    reason = 'Replying to our previous message';
  } else if (proactiveTrigger) {
    shouldRespond = true;
    reason = 'Proactive trigger (Orbit being helpful)';
  } else {
    shouldRespond = false;
    reason = 'No trigger conditions met';
  }

  return {
    ...state,
    triggerEvaluation: {
      shouldRespond,
      reason
    }
  };
}

module.exports = { triggerEvaluator };