/**
 * Trigger Evaluator Node for Icebound Agent
 * Determines if agent should respond (keywords, mentions, proactive)
 */

async function triggerEvaluator(state) {
  const { event, policyCheck } = state;

  // If policy check failed, don't proceed
  if (!policyCheck || !policyCheck.passed) {
    return {
      ...state,
      triggerEvaluation: {
        shouldRespond: false,
        reason: 'Policy check failed'
      }
    };
  }

  // Icebound trigger logic:
  // - Responds to direct mentions (@icebound)
  // - Responds to specific keywords that indicate need for chaotic thinking
  // - Can be proactive in certain contexts (less frequent than Orbit)
  // - Responds to requests for "chaotic perspective", "brainstorming", etc.

  const content = event.content;
  const userId = event.userId;

  // Check for direct mention
  const hasMention = content.includes('@icebound') || content.includes('@Icebound');

  // Check for trigger keywords/phrases
  const triggerPhrases = [
    'chaotic',
    'brainstorm',
    'think outside the box',
    'crazy idea',
    'wtf',
    'WTF',
    'what the',
    'how would you',
    'give me a wild',
    'need a different perspective',
    'stuck on',
    'can\'t figure out',
    'debug this',
    'vent',
    'roast me',
    'playful',
    'chaos'
  ];

  const hasTriggerPhrase = triggerPhrases.some(phrase =>
    content.toLowerCase().includes(phrase.toLowerCase())
  );

  // Check if user is asking for a chaotic/problem-solving perspective
  const perspectiveRequests = [
    'perspective',
    'angle',
    'take on',
    'what do you think',
    'thoughts on',
    'opinion'
  ];

  const hasPerspectiveRequest = perspectiveRequests.some(phrase =>
    content.toLowerCase().includes(phrase.toLowerCase())
  );

  // Icebound is more likely to respond to requests for chaotic thinking
  const shouldRespond = hasMention || hasTriggerPhrase ||
    (hasPerspectiveRequest && Math.random() > 0.3); // 70% chance to respond to perspective requests

  let reason = '';
  if (hasMention) {
    reason = 'Direct mention detected';
  } else if (hasTriggerPhrase) {
    reason = 'Trigger phrase detected';
  } else if (hasPerspectiveRequest && Math.random() > 0.3) {
    reason = 'Perspective request with random roll';
  } else {
    reason = 'No triggers detected';
  }

  return {
    ...state,
    triggerEvaluation: {
      shouldRespond: shouldRespond,
      reason: reason,
      triggerType: hasMention ? 'mention' :
                  hasTriggerPhrase ? 'keyword' :
                  hasPerspectiveRequest ? 'perspective' : 'none'
    }
  };
}

module.exports = { triggerEvaluator };