/**
 * Policy Guard Node
 * Checks if the agent is allowed to act based on policies
 */

async function policyGuard(state) {
  const { event, scopeCheck } = state;

  // If scope check failed, don't proceed
  if (!scopeCheck.passed) {
    return {
      ...state,
      policyCheck: {
        passed: false,
        reason: scopeCheck.reason
      }
    };
  }

  // In a real implementation, this would check:
  // - Agent enabled/disabled status
  // - Content policies (is the message appropriate?)
  // - Rate limiting
  // - Permission to act in this context

  // For now, we'll allow most things but block some basic spam
  const spamPatterns = [
    /^(hi|hello|hey)\s*$/, // Simple greetings alone
    /^(test|testing)\s*$/i, // Test messages
    /^.{1,2}$/ // Extremely short messages
  ];

  const isSpam = spamPatterns.some(pattern =>
    pattern.test(event.content.trim())
  );

  if (isSpam) {
    return {
      ...state,
      policyCheck: {
        passed: false,
        reason: 'Message appears to be spam or test content'
      }
    };
  }

  return {
    ...state,
    policyCheck: {
      passed: true,
      reason: 'Message passed policy checks'
    }
  };
}

module.exports = { policyGuard };