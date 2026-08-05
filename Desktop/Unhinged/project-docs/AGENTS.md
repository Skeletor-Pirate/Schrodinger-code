# UNHINGED Agents

UNHINGED is designed around two AI assistants orchestrated through LangGraph-style multi-step workflows.

## Orbit

Orbit is the collaborative team assistant. Its intended work includes meeting preparation, task and project coordination, summaries, team communication, knowledge lookup, and workflow guidance.

## Icebound

Icebound is the technical and creative problem-solving assistant. Its intended work includes code analysis, debugging, technical documentation, architecture guidance, performance investigation, research, brainstorming, and support during incidents.

## Intended execution flow

```text
User message
  → scope and policy checks
  → trigger/persona selection
  → memory retrieval from the RAG service
  → tool planning
  → permissioned tool execution
  → response composition
  → audit log, feedback, and vault write
```

Both agent directories contain pipeline-node implementations for the stages above. Agent actions should always be scoped to the current user, workspace, group, and allowed vault paths.

## Memory and knowledge

- Short-term memory keeps recent conversation context.
- Long-term memory uses the vault as a source of truth, ChromaDB for semantic retrieval, and BM25 for keyword retrieval.
- The RAG service watches vault changes, builds an index, and returns hybrid search results.
- A memory summarization worker is intended to consolidate older conversations into useful notes.

## Tool model

Planned tools include vault read/write/search, web and hackathon search, task creation, summaries, user lookup, notifications, chat read/reply, file reading, and plugin invocation. The design requires least privilege, rate limiting, validation, structured errors, and audit logging on every invocation.

Some of these tools currently use mocks or await real integrations with storage, database records, search providers, email, chat, and sandboxing. Treat them as development scaffolding until each one has been implemented and tested end-to-end.

## Guardrails required before release

- Enforce workspace/group/user boundaries in every retrieval and tool call.
- Validate tool input and constrain paths to permitted vault/storage locations.
- Log actions without logging credentials or unnecessary private content.
- Require explicit user consent for consequential actions such as external messages, file changes, plugin execution, or data exports.
- Configure quotas, timeout/retry limits, and a real sandbox for untrusted code/plugins.
- Add automated tests for allowed and denied tool calls, tenant isolation, and failure modes.
