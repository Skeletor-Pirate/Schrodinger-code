/**
 * Orbit Agent - Team Assistant
 * Implements the LangGraph orchestrator pipeline for the Orbit agent
 */

const { StateGraph, END, Annotation } = require('@langchain/langgraph');
const { ChatOpenAI } = require('@langchain/openai');
const {
  vaultReadTool,
  vaultWriteTool,
  vaultSearchTool,
  webSearchTool,
  taskCreateTool,
  summaryCreateTool,
  chatReadTool,
  chatReplyTool
} = require('../../services/agent-tools');
const { scopeChecker } = require('./pipeline-nodes/scope-checker');
const { policyGuard } = require('./pipeline-nodes/policy-guard');
const { triggerEvaluator } = require('./pipeline-nodes/trigger-evaluator');
const { personaRouter } = require('./pipeline-nodes/persona-router');
const { memoryRetriever } = require('./pipeline-nodes/memory-retriever');
const { toolPlanner } = require('./pipeline-nodes/tool-planner');
const { toolExecutor } = require('./pipeline-nodes/tool-executor');
const { replyComposer } = require('./pipeline-nodes/reply-composer');
const { vaultWriter } = require('./pipeline-nodes/vault-writer');
const { auditLogger } = require('./pipeline-nodes/audit-logger');
const { feedbackCollector } = require('./pipeline-nodes/feedback-collector');

class OrbitAgent {
  constructor() {
    // Initialize the language model
    this.llm = new ChatOpenAI({
      modelName: process.env.OPENAI_MODEL || 'gpt-4o',
      temperature: 0.7,
      openAIApiKey: process.env.OPENAI_API_KEY
    });

    // Build the LangGraph workflow
    this.workflow = this.buildWorkflow();
  }

  buildWorkflow() {
    // Define the state schema
    const StateAnnotation = Annotation.Root({
      event: Annotation(),
      scopeCheck: Annotation(),
      policyCheck: Annotation(),
      triggerEvaluation: Annotation(),
      persona: Annotation(),
      memories: Annotation(),
      toolPlan: Annotation(),
      toolResults: Annotation(),
      reply: Annotation(),
      vaultWrite: Annotation(),
      auditLog: Annotation(),
      feedback: Annotation()
    });

    const workflow = new StateGraph(StateAnnotation);

    // Add nodes for each step in the pipeline
    workflow.addNode('eventListener', this.eventListener.bind(this));
    workflow.addNode('scopeChecker', scopeChecker);
    workflow.addNode('policyGuard', policyGuard);
    workflow.addNode('triggerEvaluator', triggerEvaluator);
    workflow.addNode('personaRouter', personaRouter);
    workflow.addNode('memoryRetriever', memoryRetriever);
    workflow.addNode('toolPlanner', toolPlanner);
    workflow.addNode('toolExecutor', toolExecutor);
    workflow.addNode('replyComposer', replyComposer);
    workflow.addNode('vaultWriter', vaultWriter);
    workflow.addNode('auditLogger', auditLogger);
    workflow.addNode('feedbackCollector', feedbackCollector);

    // Define the edges (flow)
    workflow.addEdge('eventListener', 'scopeChecker');
    workflow.addEdge('scopeChecker', 'policyGuard');
    workflow.addEdge('policyGuard', 'triggerEvaluator');
    workflow.addEdge('triggerEvaluator', 'personaRouter');
    workflow.addEdge('personaRouter', 'memoryRetriever');
    workflow.addEdge('memoryRetriever', 'toolPlanner');
    workflow.addEdge('toolPlanner', 'toolExecutor');
    workflow.addEdge('toolExecutor', 'replyComposer');
    workflow.addEdge('replyComposer', 'vaultWriter');
    workflow.addEdge('vaultWriter', 'auditLogger');
    workflow.addEdge('auditLogger', 'feedbackCollector');
    workflow.addEdge('feedbackCollector', END);

    // Set the entry point
    workflow.setEntryPoint('eventListener');

    // Compile the workflow
    return workflow.compile();
  }

  async eventListener(state) {
    // Listen for events from various sources:
    // - WebSocket messages (chat events)
    // - API triggers (scheduled tasks, webhooks)
    // - Direct invocations (testing, admin)

    // For now, we'll simulate receiving an event
    // In a real implementation, this would connect to actual event sources

    return {
      ...state,
      event: {
        type: 'message', // or 'scheduled', 'trigger', etc.
        groupId: 'group-alpha',
        userId: 'user-123',
        content: 'What did we decide about the tech stack last week?',
        timestamp: new Date().toISOString()
      }
    };
  }

  async run() {
    // Initialize the state and run the workflow
    const initialState = {};
    const finalState = await this.workflow.invoke(initialState);
    return finalState;
  }
}

// Export a singleton instance
const orbitAgent = new OrbitAgent();
module.exports = orbitAgent;

// If this script is run directly, allow basic testing
if (require.main === module) {
  async function runTest() {
    try {
      const result = await orbitAgent.run();
      console.log('Orbit agent execution completed:', result);
      process.exit(0);
    } catch (error) {
      console.error('Orbit agent execution failed:', error);
      process.exit(1);
    }
  }

  runTest().catch(console.error);
}