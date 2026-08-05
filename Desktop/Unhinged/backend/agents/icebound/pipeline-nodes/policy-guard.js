/**
 * Policy Guard Node for Icebound Agent
 * Checks for spam and agent policies
 */

async function policyGuard(state) {
  const { event, scopeCheck } = state;

  // If scope check failed, don't proceed
  if (!scopeCheck || !scopeCheck.passed) {
    return {
      ...state,
      policyCheck: {
        passed: false,
        reason: 'Scope check failed'
      }
    };
  }

  // In a real implementation, this would check:
  // - Is the message spam? (rate limiting, duplicate content)
  // - Does the user/agent violate any policies?
  // - Is the agent enabled in this context?
  // - Are there any content filters to apply?

  // For now, we'll do a basic spam check (simplified)
  const spamIndicators = [
    'buy now', 'click here', 'free money', 'limited time offer'
  ];

  const contentLower = event.content.toLowerCase();
  const isSpam = spamIndicators.some(indicator => contentLower.includes(indicator));

  if (isSpam) {
    return {
      ...state,
      policyCheck: {
        passed: false,
        reason: 'Message detected as spam'
      }
    };
  }

  // Icebound-specific policy: allow more chaotic content but still prevent abuse
  // In a real implementation, this might allow more creative/experimental content
  // while still preventing harmful content

  return {
    ...state,
    policyCheck: {
      passed: true,
      reason: 'Content passes policy checks for Icebound agent'
    }
  };
}

module.exports = { policyGuard };