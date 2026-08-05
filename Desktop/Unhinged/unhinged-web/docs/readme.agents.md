# UNHINGED Agent System

## Overview

The UNHINGED agent system consists of intelligent AI assistants that help users with various tasks, from general collaboration to specialized technical work. Built on LangGraph for advanced workflow orchestration, the agents provide persistent memory, context-aware assistance, and seamless integration with the platform's knowledge base and tools.

## Agent Personalities

UNHINGED features two primary agent personalities, each designed for different types of interactions and workloads:

### 🤖 Orbit Agent - The Collaborative Assistant
- **Role**: General-purpose AI assistant for team collaboration and communication
- **Strengths**: 
  - Meeting coordination and scheduling
  - Task management and project tracking
  - Communication facilitation and summarization
  - General knowledge retrieval and explanation
  - Workflow automation and process guidance
- **Personality Traits**: Friendly, helpful, organized, communicative
- **Typical Use Cases**:
  - "Orbit, can you schedule a team meeting for Thursday?"
  - "Orbit, summarize what we decided in yesterday's project discussion"
  - "Orbit, help me create a task list for the upcoming release"
  - "Orbit, what's the status of the marketing campaign?"

### ❄️ Icebound Agent - The Technical Specialist
- **Role**: Specialized AI assistant for technical tasks, development, and analysis
- **Strengths**:
  - Code analysis, debugging, and optimization
  - Technical documentation generation
  - Architecture and design guidance
  - Performance profiling and bottleneck identification
  - Technical research and learning assistance
- **Personality Traits**: Analytical, precise, knowledgeable, detail-oriented
- **Typical Use Cases**:
  - "Icebound, can you review this Python function for potential bugs?"
  - "Icebound, explain how this API endpoint designed for user authentication?"
  - "Icebound, help me optimize this database query for better performance"
  - "Icebound, what are the best practices for React hooks?"

## Core Architecture

### LangGraph Orchestration
Both agents use LangGraph for workflow management, providing:
- **State Persistence**: Workflow state saved between steps for long-running processes
- **Conditional Logic**: Dynamic workflow routing based on intermediate results
- **Error Handling**: Built-in retry mechanisms and fallback strategies
- **Human-in-the-Loop**: Capability to pause for user input or approval
- **Memory Integration**: Direct access to short-term and long-term memory systems

### Agent State Structure
```
AgentState {
  // Conversation context
  messages: Message[];           // Chat history with user
  currentTask: string | null;    // Active task being worked on
  
  // Memory systems
  shortTermMemory: MemoryItem[]; // Recent conversation context
  longTermMemory: MemoryItem[];  // Retrieved knowledge from RAG
  
  // Task execution
  plannedTools: ToolCall[];      // Tools planned for execution
  toolResults: ToolResult[];     // Results from executed tools
  intermediateSteps: any[];      // Data from workflow steps
  
  // Configuration
  agentId: string;               // Unique agent identifier
  agentType: 'orbit' | 'icebound'; // Agent personality
  permissions: Permission[];     // Granted capabilities
  
  // Metadata
  timestamp: Date;               // Workflow start time
  workspaceId: string;           // Current workspace context
  groupId: string;               // Current group context
}
```

### Workflow Execution Flow
1. **Input Reception**: User message received via chat interface
2. **State Initialization**: Create or retrieve agent state
3. **Scope Validation**: Check permissions for requested actions
4. **Memory Retrieval**: Fetch relevant context from knowledge base
5. **Planning Phase**: Determine needed tools and approach
6. **Execution Phase**: Run approved tools with audit logging
7. **Response Generation**: Compose final answer from results
8. **Feedback Collection**: Gather user response for learning
9. **State Persistence**: Save updated state for future interactions
10. **Vault Logging**: Record interaction in Obsidian vault

## Memory Systems

### Short-Term Memory (STM)
- **Purpose**: Maintain conversation context for coherent interactions
- **Storage**: In-memory during agent session
- **Capacity**: Configurable window of recent exchanges (default: 10 messages)
- **Content**: User messages, agent responses, tool executions
- **Management**: FIFO eviction when capacity exceeded
- **Use Case**: Understanding references like "What did we just discuss?"

### Long-Term Memory (LTM) - Retrieval-Augmented Generation
- **Purpose**: Access persistent knowledge base for informed responses
- **Storage**: 
  - Vector embeddings in ChromaDB (semantic search)
  - Keyword index in BM25 (textual search)
  - Obsidian vault (source of truth)
- **Retrieval**: Hybrid search combining semantic and textual relevance
- **Updating**: Real-time synchronization with file system watcher
- **Use Case**: Answering questions like "What was our decision about tech stack?"

### Memory Summarization Worker
- **Purpose**: Consolidate old memories for efficient storage
- **Operation**: Runs periodically to summarize conversations older than threshold
- **Technique**: Extract key points, decisions, and action items
- **Storage**: Summaries stored in `summaries/` folder in vault
- **Benefit**: Reduces storage needs while preserving important information
- **Schedule**: Configurable cron job (default: hourly)

## Tool Framework

### Design Principles
1. **Least Privilege**: Agents only get permissions they need
2. **Permission Checking**: Every tool validates agent authorization
3. **Rate Limiting**: Prevents abuse and ensures fair resource usage
4. **Audit Logging**: All tool usage recorded for security and compliance
5. **Error Handling**: Structured error responses with context for debugging
6. **Fallback Mechanisms**: Graceful degradation when services unavailable
7. **Idempotency**: Safe to retry operations when appropriate

### Tool Categories
#### Vault Interaction Tools
- **vault_read**: Read markdown files from permitted vault folders
- **vault_write**: Write/update markdown files in permitted folders
- **vault_search**: Semantic and keyword search over vault knowledge
- **Allowed Paths**: 
  - Read: `chats/`, `memories/`, `decisions/`, `tasks/`, `agent-logs/`, `summaries/`, `templates/`, `groups/`, `users/`
  - Write: `summaries/`, `tasks/`, `agent-logs/{agent-type}/`, `inbox/`

#### Knowledge & Research Tools
- **web_search**: Internet search via configurable API (Google, Bing, etc.)
- **hackathon_search**: Search hackathon listings and events
- **Fallback**: Mock implementations when APIs not configured

#### Productivity & Collaboration Tools
- **task_create**: Create task notes with frontmatter in vault
- **summary_create**: Generate summary notes from chats or other sources
- **user_lookup**: Retrieve user profiles from directory service
- **notification_send**: Queue notifications for delivery (email/in-app)
- **chat_read**: Read recent messages from permitted groups
- **chat_reply**: Send messages to groups as the agent

#### File & System Tools
- **file_read**: Read uploaded files (MinIO integration planned)
- **plugin_invoke**: Execute installed plugins in sandboxed environment

#### System & Administrative Tools
*(Available to privileged agents/admin contexts)*

### Tool Execution Process
1. **Request Validation**: Verify input parameters and format
2. **Permission Check**: Confirm agent has rights to use this tool
3. **Rate Limit Verification**: Ensure within allowed usage quota
4. **Pre-execution Hooks**: Optional validation or transformation
5. **Core Execution**: Perform the tool's primary function
6. **Post-execution Hooks**: Optional logging or cleanup
7. **Result Formatting**: Structure response for agent consumption
8. **Audit Logging**: Record execution details for compliance
9. **Error Handling**: Catch exceptions and return structured errors
10. **Response Return**: Send result back to agent workflow

## Permission System

### Permission Granularity
Permissions are granted at the tool level with specific constraints:
- **Tool-level**: `vault_read`, `web_search`, `task_create`, etc.
- **Path-level**: For vault tools, specific folder restrictions
- **Rate-limited**: Requests per time window (e.g., 30 requests/minute)
- **Contextual**: May vary based on workspace, group, or user role

### Default Permissions
#### Orbit Agent
- **Vault Read**: `chats/`, `memories/`, `decisions/`, `tasks/`, `summaries/`, `templates/`
- **Vault Write**: `summaries/`, `tasks/`, `agent-logs/orbit/`, `inbox/`
- **Web Search**: Available with rate limiting
- **Task Creation**: Full access to create tasks
- **Summary Creation**: Full access to create summaries
- **User Lookup**: Can lookup any user in system
- **Notification Send**: Can send notifications to users
- **Chat Read**: Can read messages in user's groups
- **Chat Reply**: Can reply in user's groups
- **File Read**: Limited to uploaded files in user's context
- **Hackathon Search**: Available when configured
- **Plugin Invoke**: Limited to approved plugins

#### Icebound Agent
- **Vault Read**: `memories/`, `decisions/`, `templates/`, `technical-docs/`, `code-snippets/`
- **Vault Write**: `summaries/`, `tasks/`, `agent-logs/icebound/`, `technical-docs/`, `code-snippets/`
- **Web Search**: Available with rate limiting (technical focus)
- **Task Creation**: Full access to create tasks
- **Summary Creation**: Full access to create summaries
- **User Lookup**: Can lookup any user in system
- **Notification Send**: Can send notifications to users
- **Chat Read**: Can read messages in technical groups
- **Chat Reply**: Can reply in technical groups
- **File Read**: Can read code files and technical documentation
- **Hackathon Search**: Available when configured
- **Plugin Invoke**: Can invoke development and analysis plugins

### Permission Administration
- **Admin Console**: Grant/revoke permissions through UI
- **Role-Based Templates**: Predefined permission sets for roles
- **Contextual Overrides**: Workspace or group-specific permissions
- **Temporary Grants**: Time-limited permission elevation
- **Audit Trail**: All permission changes logged for compliance

## Knowledge Integration

### Obsidian Vault Integration
The agent system treats the Obsidian vault as the primary knowledge store:
- **Bidirectional Sync**: Agents both read from and write to the vault
- **Real-time Updates**: File system watcher detects changes immediately
- **Structured Data**: Frontmatter metadata for categorization and search
- **Linking Support**: Recognition of Obsidian-style wiki links (`[[page]]`)
- **Tag System**: Integration with Obsidian tagging for organization
- **Graph Visualization**: Knowledge connections visualized in admin panel

### Knowledge Flow
1. **Information Ingestion**: 
   - Users create/edit notes in Obsidian
   - File system watcher detects changes
   - RAG service processes new/updated content
   - Embeddings generated and stored in ChromaDB
   - Keyword index updated in BM25
   
2. **Knowledge Retrieval**:
   - Agent submits query via `vault_search` tool
   - RAG service performs hybrid search (vector + keyword)
   - Results ranked by relevance and returned
   - Agent incorporates results into response generation
   
3. **Knowledge Creation**:
   - Agent decides to create new note via `vault_write` tool
   - Content formatted with appropriate frontmatter
   - Note saved to designated vault folder
   - File system watcher detects new file
   - RAG service processes and indexes new content
   
4. **Learning from Interactions**:
   - All agent-tool interactions logged to vault
   - Summarization worker processes old logs periodically
   - Key insights extracted and stored as separate notes
   - Enables agents to "learn" from past successful interactions

## Communication Patterns

### Agent-to-Agent Communication
While primarily designed for user interaction, agents can communicate:
- **Message Passing**: Direct messaging between agents
- **Task Delegation**: One agent assigns work to another
- **Knowledge Sharing**: Sharing insights or findings
- **Coordination**: Collaborative problem-solving on complex tasks
- **Hierarchy**: Specialized agents consulting generalists or vice versa

### Agent-to-Service Communication
- **REST APIs**: Standard HTTP JSON interfaces for all backend services
- **WebSocket Connections**: Real-time updates for collaborative features
- **Event System**: Publish/subscribe for loose coupling
- **Message Queues**: Asynchronous processing for long-running tasks
- **Shared Database**: Direct access for complex queries (via Prisma/ORM)

### Agent-to-User Communication
- **Chat Interface**: Primary interaction mechanism via chat UI
- **Notifications**: Proactive alerts for important events
- **Suggestions**: Contextual recommendations based on user behavior
- **Guided Workflows**: Step-by-step assistance for complex processes
- **Feedback Collection**: Explicit requests for user input on performance

## Security Considerations

### Agent Sandboxing
- **Process Isolation**: Each agent runs in separate Node.js process
- **Resource Limits**: CPU and memory constraints per agent instance
- **Network Restrictions**: Outbound connections limited to approved services
- **File System Access**: Restricted to vault directory and temp folders
- **Tool Execution**: All external actions mediated through controlled tool framework

### Data Protection
- **Input Validation**: All agent inputs validated before processing
- **Output Encoding**: Agent responses sanitized before display
- **Session Security**: Agent sessions tied to user sessions with same expiry
- **Credential Management**: No storage of user credentials in agent memory
- **Audit Logging**: Complete trace of all agent actions for forensics

### Privacy Controls
- **Memory Isolation**: Agent memory not shared between different users
- **Context Boundaries**: Agents only access information in current workspace/group
- **Consent Requirements**: Explicit permission needed for cross-context access
- **Data Minimization**: Only necessary information retrieved for task completion
- **Right to be Forgotten**: User data deletion includes agent interaction logs

## Extensibility & Customization

### Creating Custom Agents
1. **Define Personality**: Specify traits, communication style, and expertise areas
2. **Configure Permissions**: Set appropriate tool access and rate limits
3. **Implement Specialized Tools**: Create domain-specific capabilities
4. **Train on Domain Data**: Use relevant documents and examples for better performance
5. **Test Thoroughly**: Validate behavior in various scenarios
6. **Deploy via Admin Console**: Register and make available to users

### Developing Custom Tools
1. **Define Interface**: Specify input parameters and output format
2. **Implement Authorization**: Add permission checking logic
3. **Add Rate Limiting**: Integrate with rate limiting system
4. **Implement Core Logic**: Perform the tool's primary function
5. **Add Error Handling**: Return structured errors for failure cases
6. **Include Audit Logging**: Log usage for security and compliance
7. **Test Edge Cases**: Validate behavior with invalid inputs and error conditions
8. **Document Usage**: Provide clear examples and usage guidelines

### Knowledge Source Integration
Beyond Obsidian vault, agents can integrate with:
- **Corporate Wikis**: Confluence, Notion, SharePoint connectors
- **Document Repositories**: Google Drive, Dropbox, SharePoint
- **Code Repositories**: GitHub, GitLab, Bitbucket integrations
- **Knowledge Bases**: Internal wikis, FAQ systems, support documentation
- **External APIs**: News, weather, financial data, etc. (via web_search tool)

### Plugin System (Future)
- **Sandboxed Execution**: Plugins run in isolated iframes or Web Workers
- **API Access**: Controlled access to agent framework capabilities
- **UI Extension Points**: Custom panels in chat interface
- **Tool Contribution**: Plugins can expose new tools to agents
- **Marketplace Integration**: Discovery, installation, and updating of plugins
- **Version Compatibility**: Automatic checking of plugin-agent version matches
- **Permission Granularity**: Fine-grained control over what plugins can do

## Performance & Scaling

### Agent Instance Management
- **Pooling**: Pre-warmed agent instances for quick startup
- **Lazy Loading**: Agents initialized on first use to conserve resources
- **Horizontal Scaling**: Multiple instances behind load balancer
- **State Sharing**: Shared memory backend (Redis planned) for state persistence
- **Graceful Degradation**: Reduced functionality when resources constrained

### Response Time Optimization
- **Memory Caching**: Frequently accessed knowledge kept in memory
- **Tool Result Caching**: Cache results of expensive tool operations
- **Async Processing**: Non-blocking I/O for tool execution
- **Batch Operations**: Multiple similar requests processed together when possible
- **Prioritization**: Urgent requests (like direct messages) get higher priority

### Resource Utilization
- **Memory Efficiency**: Careful management of conversation history
- **CPU Optimization**: Efficient algorithms for text processing and matching
- **Disk I/O Minimization**: In-memory caches reduce file system access
- **Network Reduction**: Local processing minimizes external API calls
- **Garbage Collection**: Regular cleanup of temporary objects and caches

## Use Cases & Examples

### Team Collaboration Scenarios
**Scenario 1: Meeting Preparation**
- User: "Orbit, help me prepare for the sprint planning meeting"
- Orbit: Retrieves last meeting notes from vault, checks upcoming tasks, 
  reviews team capacity, creates agenda draft, shares with team

**Scenario 2: Project Status Update**
- User: "Icebound, what's the current status of the authentication module?"
- Icebound: Checks task board, reviews recent commits, examines test results,
  provides status summary with blockers and next steps

**Scenario 3: Onboarding New Member**
- User: "Orbit, help onboard Sarah to the marketing team"
- Orbit: Creates user account, assigns to marketing group, shares relevant 
  documentation, sets up introductory meeting, provides access to resources

### Technical Assistance Scenarios
**Scenario 4: Code Review**
- User: "Icebound, review this JavaScript function for security issues"
- Icebound: Analyzes code, identifies potential XSS vulnerability, 
  suggests fix using DOMPurify, explains why original was problematic

**Scenario 5: Architecture Guidance**
- User: "Icebound, recommend database schema for user preferences"
- Icebound: Evaluates options (JSON field, EAV model, separate table),
  considers query patterns, recommends normalized approach with examples

**Scenario 6: Learning Assistance**
- User: "Orbit, explain how JWT tokens work"
- Orbit: Retrieves security documentation, provides clear explanation with 
  examples, offers to create a quick reference note in the vault

### Automation & Workflow Scenarios
**Scenario 7: Weekly Reporting**
- User: "Orbit, generate last week's activity report"
- Orbit: Gathers metrics from various services, compiles summary,
  creates formatted report, emails to stakeholders, saves copy to vault

**Scenario 8: Incident Response**
- User: "Icebound, help investigate this production error"
- Icebound: Checks logs, traces request path, identifies recent changes,
  suggests rollback or fix, creates incident documentation in vault

**Scenario 9: Knowledge Consolidation**
- User: "Orbit, summarize our decisions about frontend framework"
- Orbit: Searches vault for relevant discussions, extracts key points,
  creates comprehensive summary note, tags appropriately for future reference

## Monitoring & Observability

### Agent Metrics
- **Request Volume**: Number of user interactions per time period
- **Response Time**: Average and percentile durations for complete interactions
- **Tool Usage**: Frequency and success rates of each tool type
- **Error Rates**: Percentage of interactions resulting in errors
- **Memory Utilization**: STM and LTM access patterns and hit rates
- **Token Consumption**: Approximate LLM token usage for response generation

### Health Indicators
- **Agent Responsiveness**: Time to acknowledge and begin processing requests
- **Tool Availability**: Percentage of tools functioning correctly
- **Knowledge Freshness**: Lag between vault updates and search index availability
- **Session Stability**: Rate of agent restarts or crashes
- **User Satisfaction**: Explicit feedback ratings and implicit signals

### Logging & Tracing
- **Structured Logging**: JSON logs with correlation IDs for request tracing
- **Audit Trail**: Complete record of all agent-tool-user interactions
- **Performance Profiling**: Detailed timing of workflow steps
- **Error Diagnostics**: Stack traces and context for failures
- **Usage Analytics**: Aggregated data for product improvement decisions

## Future Enhancements

### Near-Term Improvements
1. **Real Tool Implementation**: Replace mocked tools with actual integrations
   - MinIO for file storage operations
   - PostgreSQL for chat message persistence
   - External search APIs for web_search tool
   - Email services for notification delivery
   
2. **Enhanced Memory Capabilities**
   - Cross-session memory persistence
   - Semantic clustering of related memories
   - Importance-based memory retention
   - Temporal reasoning capabilities

3. **Improved Agent Coordination**
   - Explicit agent-to-agent communication protocols
   - Collaborative problem-solving frameworks
   - Knowledge sharing and teaching mechanisms
   - Specialized agent teams for complex projects

4. **Advanced Personalization**
   - User-specific agent behavior adaptation
   - Learning from individual user preferences and patterns
   - Context-aware communication style adjustment
   - Skill-based agent matching for task routing

### Mid-Term Enhancements
1. **Multimodal Capabilities**
   - Image understanding and generation
   - Audio processing and speech recognition
   - Video analysis and summarization
   - Document parsing and information extraction

2. **Collaborative Agent Workflows**
   - Multi-agent task decomposition and execution
   - Role-based agent specialization in teams
   - Dynamic agent team formation based on task requirements
   - Peer review and validation mechanisms

3. **Integration Ecosystem Expansion**
   - Deeper integration with developer tools (IDEs, CI/CD)
   - Enhanced project management software connectors
   - Advanced analytics and business intelligence integration
   - Industry-specific knowledge bases and tools

### Long-Term Vision
1. **Autonomous Agent Teams**
   - Self-organizing agent groups for complex objectives
   - Adaptive workflow restructuring based on results
   - Continuous learning and improvement from outcomes
   - Cross-domain knowledge transfer and application

2. **Predictive Assistance**
   - Anticipatory suggestions based on user behavior patterns
   - Proactive problem detection and prevention
   - Future trend identification from knowledge base
   - Personalized recommendations for skill development

3. **Emotional Intelligence**
   - Sentiment analysis of user communications
   - Empathetic response generation
   - Conflict detection and mediation assistance
   - Well-being and stress level monitoring (with consent)

4. **Knowledge Evolution**
   - Automated knowledge validation and updating
   - Contradiction detection and resolution
   - Knowledge gap identification and filling suggestions
   - Evolutionary improvement of stored information

## Conclusion

The UNHINGED agent system represents a sophisticated approach to AI-assisted collaboration, combining the reasoning power of large language models with structured workflows, persistent memory, and specialized tool usage. By separating concerns between general collaboration (Orbit) and technical specialization (Icebound), the system provides tailored assistance while maintaining consistency in security, reliability, and user experience.

The LangGraph-based architecture ensures reliable, reproducible workflows with excellent observability and error handling. The integration with the Obsidian vault creates a living knowledge base that grows more valuable with use, while the tool framework provides safe, audited access to platform capabilities.

As the system evolves, continued focus on security, performance, and extensibility will ensure that UNHINGED agents remain trustworthy, efficient, and adaptable assistants for teams tackling increasingly complex challenges in the modern workplace.