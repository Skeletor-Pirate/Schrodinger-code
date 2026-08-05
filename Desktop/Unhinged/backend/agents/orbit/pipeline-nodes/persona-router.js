/**
 * Persona Router Node
 * Determines the agent's tone and response style
 */

async function personaRouter(state) {
  const { event, triggerEvaluation } = state;

  // If we shouldn't respond, don't proceed with persona
  if (!triggerEvaluation.shouldRespond) {
    return {
      ...state,
      persona: {
        tone: 'silent',
        style: 'none',
        reason: triggerEvaluation.reason
      }
    };
  }

  // Orbit's persona: sarcastic, funny, dry
  // In a real implementation, this might vary based on:
  // - Time of day
  // - Group context
  // - Recent interaction history
  // - User preferences

  const persona = {
    tone: 'sarcastic-funny-dry',
    style: 'helpful-but-playful',
    characteristics: [
      'witty remarks',
      'light teasing',
      'useful information delivered with humor',
      'never mean-spirited',
      'always brings value'
    ],
    responseConstraints: {
      maxLength: 500,
      mustIncludeHumor: true,
      avoidTopics: ['sensitive personal issues', 'heavy criticism without constructive feedback']
    }
  };

  return {
    ...state,
    persona
  };
}

module.exports = { personaRouter };