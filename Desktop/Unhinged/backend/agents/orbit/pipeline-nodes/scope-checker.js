/**
 * Scope Checker Node
 * Validates that the event is within the agent's allowed scopes
 */

async function scopeChecker(state) {
  const { event } = state;

  // In a real implementation, this would check:
  // - Is the event from an allowed group/workspace?
  // - Is the event type something we should respond to?
  // - Are we enabled in this context?

  // For now, we'll do a basic check
  const allowedGroups = ['group-alpha', 'group-beta', 'dm-threads'];

  if (!event.groupId || !allowedGroups.includes(event.groupId)) {
    return {
      ...state,
      scopeCheck: {
        passed: false,
        reason: `Group ${event.groupId} is not in allowed groups list`
      }
    };
  }

  return {
    ...state,
    scopeCheck: {
      passed: true,
      reason: `Group ${event.groupId} is allowed`
    }
  };
}

module.exports = { scopeChecker };