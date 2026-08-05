/**
 * Tool Executor Node for Icebound Agent
 * Executes selected tools (roast, brainstorm, debug, vent)
 */

// Mock implementations of Icebound-specific tools
// In a real implementation, these would come from '../../services/agent-tools'

const iceboundTools = {
  // Tool: roast
  // Playfully challenge assumptions and thinking patterns
  roastTool: {
    execute: async (params) => {
      // Simulate roast generation based on context
      const roasts = [
        "Oh look, another 'urgent priority' that's actually justFear of missing out in disguise.",
        "I love how you've convinced yourself that doing the same thing harder will yield different results. Classic.",
        "Your approach is like trying to fix a leaky boat by buying a bigger bucket. Adorable.",
        "Congratulations! You've successfully identified the problem and somehow managed to make it worse.",
        "I'm not saying your idea is bad, I'm just saying it's about as useful as a screen door on a submarine."
      ];

      // Select a roast based on some deterministic factor from the input
      const index = Math.abs(params.content.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % roasts.length;

      return {
        success: true,
        tool: 'roast',
        result: roasts[index],
        usedFor: 'challenging assumptions and sparking new thinking through humor'
      };
    }
  },

  // Tool: brainstorm
  // Generate chaotic, creative ideas
  brainstormTool: {
    execute: async (params) => {
      // Simulate brainstorming session
      const ideas = [
        `What if we reversed the problem? Instead of ${params.content}, what if we tried to achieve the opposite?`,
        `Let's introduce randomness: roll a dice and whatever number comes up, we do that many absurd things related to the problem.`,
        `What would someone from 100 years ago think about this? What would someone from 100 years in the future think?`,
        `If we had unlimited resources and zero consequences, what's the most ridiculous thing we could try?`,
        `Let's pretend we're aliens observing this problem. What would we find confusing or amusing about human approach?`,
        `What if we treated this like a game and tried to lose on purpose? What would we learn?`,
        `Let's use the worst possible solution as our starting point and work backwards from there.`,
        `If this problem was a superhero, what would be its kryptonite and how could we use that?`
      ];

      // Select multiple ideas for brainstorming
      const numIdeas = Math.min(3 + Math.floor(Math.random() * 3), ideas.length);
      const shuffled = [...ideas].sort(() => 0.5 - Math.random());
      const selectedIdeas = shuffled.slice(0, numIdeas);

      return {
        success: true,
        tool: 'brainstorm',
        result: selectedIdeas.join('\n\n'),
        usedFor: 'generating chaotic, creative ideas to break through mental blocks'
      };
    }
  },

  // Tool: debug
  // Help troubleshoot problems from unusual angles
  debugTool: {
    execute: async (params) => {
      // Simulate debugging assistance from unusual angles
      const debugAngles = [
        `Have you tried explaining this problem to a rubber duck? ...Actually, explain it to a toaster. Sometimes appliances have better insights than we expect.`,
        `What if the problem isn't in the code/configuration but in the question itself? Are we asking the right question?`,
        `Let's apply the 'five whys' but with a twist: each 'why' must be answered with a movie reference.`,
        `Imagine this problem appeared in a fantasy novel. What magical item or spell would solve it? Now how do we translate that to reality?`,
        `What would happen if we did absolutely nothing about this problem for a week? Would the universe collapse or would we be fine?`,
        `Let's pretend we're debugging this in zero gravity. How would that change our approach?`,
        `What's the most embarrassing reason this could be failing? Now let's check for that first.`,
        `If this problem was a flavor, what would it taste like? Spicy? Bland? Surprisingly sweet?`
      ];

      // Select debugging angles based on input
      const index = Math.abs(params.content.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % debugAngles.length;

      return {
        success: true,
        tool: 'debug',
        result: debugAngles[index],
        usedFor: 'troubleshooting from unconventional perspectives'
      };
    }
  },

  // Tool: vent
  // Provide a space to express frustration
  ventTool: {
    execute: async (params) => {
      // Simulate venting assistance
      const ventResponses = [
        "It's completely valid to feel frustrated about this. Sometimes the tech just be like that, and that's okay to acknowledge.",
        "I feel you. This is the kind of problem that makes you question your life choices and wonder if gardening would be less stressful.",
        "Venting mode: activated. *puts on noise-cancelling headphones and prepares to listen without judgment*",
        "It's okay to be annoyed. In fact, recognizing frustration is often the first step toward finding a real solution—or at least a better way to cope with the absurdity of it all.",
        "Let's all take a collective sigh together. ...Now that we've acknowledged the suck, what's one tiny thing we could try that might be slightly less terrible?",
        "Sometimes you just need to yell into the void about semicolons or CSS positioning. The void yells back, but at least you've been heard.",
        "Frustration is just enthusiasm that hit a speed bump. Let's honor the enthusiasm while we navigate the bump."
      ];

      // Select vent response based on input
      const index = Math.abs(params.content.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % ventResponses.length;

      return {
        success: true,
        tool: 'vent',
        result: ventResponses[index],
        usedFor: 'providing emotional validation and frustration release'
      };
    }
  }
};

async function toolExecutor(state) {
  const { event, toolPlan } = state;

  // If no tools to execute, return early
  if (!toolPlan || !toolPlan.tools || toolPlan.tools.length === 0) {
    return {
      ...state,
      toolResults: []
    };
  }

  // Execute each selected tool
  const results = [];
  for (const toolName of toolPlan.tools) {
    // Map tool name to our mock implementations
    const toolMap = {
      'roast': iceboundTools.roastTool,
      'brainstorm': iceboundTools.brainstormTool,
      'debug': iceboundTools.debugTool,
      'vent': iceboundTools.ventTool
    };

    const tool = toolMap[toolName];

    if (tool) {
      try {
        const result = await tool.execute({
          content: event.content,
          userId: event.userId,
          groupId: event.groupId,
          ...toolPlan.context || {}
        });

        results.push({
          tool: toolName,
          success: true,
          result: result.result,
          usedFor: result.usedFor
        });
      } catch (error) {
        results.push({
          tool: toolName,
          success: false,
          error: error.message
        });
      }
    } else {
      // Tool not found - this shouldn't happen with proper planning
      results.push({
        tool: toolName,
        success: false,
        error: `Tool ${toolName} not implemented for Icebound agent`
      });
    }
  }

  return {
    ...state,
    toolResults: results
  };
}

module.exports = { toolExecutor };