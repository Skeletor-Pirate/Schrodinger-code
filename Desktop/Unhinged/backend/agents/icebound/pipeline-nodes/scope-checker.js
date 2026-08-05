/**
 * Scope Checker Node for Icebound Agent
 * Validates that the event is within the agent's allowed scopes
 */

async function scopeChecker(state) {
  const { event } = state;

  // Icebound agent is allowed in specific groups (potentially different from Orbit)
  // According to the implementation plan, Icebound has access to "allowed groups or dedicated rooms"
  const allowedGroups = ['group-alpha', 'group-beta', 'dm-threads', 'chaos-room', 'debug-lounge'];

  if (!event.groupId || !allowedGroups.includes(event.groupId)) {
    return {
      ...state,
      scopeCheck: {
        passed: false,
        reason: `Group ${event.groupId} is not in allowed groups list for Icebound agent`
      }
    };
  }

  return {
    ...state,
    scopeCheck: {
      passed: true,
      reason: `Group ${event.groupId} is allowed for Icebound agent`
    }
  };
}

module.exports = { scopeChecker };