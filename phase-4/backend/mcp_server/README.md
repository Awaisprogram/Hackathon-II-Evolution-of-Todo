# MCP Server for Task Management

This MCP (Model Context Protocol) Server enables natural language task management through the AI chatbot by exposing task operations as standardized tools following the Model Context Protocol specification.

## Overview

The MCP Server acts as an intermediary between the AI agent and the existing TaskService, allowing users to perform task management operations through conversational commands while maintaining bidirectional sync with the existing web UI.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Types    │ -> │   AI Agent      │ -> │   MCP Server    │
│ "Add buy milk"  │    │ (Natural Lang)  │    │ (Task Tools)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        |
                                                        v
                                            ┌─────────────────┐
                                            │  TaskService    │
                                            │ (Business Logic)│
                                            └─────────────────┘
                                                        |
                                                        v
                                            ┌─────────────────┐
                                            │   Database      │
                                            │ (Neon/PostgreSQL)│
                                            └─────────────────┘
```

## MCP Tools

The server exposes 5 task management tools:

### 1. add_task

- **Purpose**: Create new task for user
- **Parameters**:
  - `user_id`: User's ID from JWT context (required)
  - `title`: Task title (required, max 200 chars)
  - `description`: Task description (optional, max 1000 chars)
- **Returns**: `{task_id, title, status, message}`

### 2. list_tasks

- **Purpose**: List user's tasks with optional filtering
- **Parameters**:
  - `user_id`: User's ID (required)
  - `status`: Filter by status ("all", "pending", "completed") - optional, default "all"
- **Returns**: `{tasks[], count, status}`

### 3. update_task

- **Purpose**: Update existing task details
- **Parameters**:
  - `user_id`: User's ID (required)
  - `task_id`: Task ID to update (required)
  - `title`: New title (optional)
  - `description`: New description (optional)
- **Returns**: `{task_id, title, description, status}`

### 4. delete_task

- **Purpose**: Delete a task
- **Parameters**:
  - `user_id`: User's ID (required)
  - `task_id`: Task ID to delete (required)
- **Returns**: `{task_id, title, status}`

### 5. complete_task

- **Purpose**: Toggle task completion status
- **Parameters**:
  - `user_id`: User's ID (required)
  - `task_id`: Task ID to complete (required)
- **Returns**: `{task_id, title, completed, status}`

## Integration Points

### With Existing Systems

- **TaskService**: Reuses existing `backend/services/task_service.py` for business logic
- **Database**: Uses existing Neon PostgreSQL with SQLModel ORM via `backend/database.py`
- **Authentication**: Validates user_id from agent context against JWT authentication
- **Models/Schemas**: Uses existing task models and schemas from `backend/models/task.py` and `backend/schemas/task_schemas.py`

### With AI Agent

- Agent connects to MCP Server via MCP protocol
- Natural language commands are parsed and converted to appropriate tool calls
- Tool responses are formatted into user-friendly messages

## Natural Language Examples

```
User: "Add buy milk to my list"
Agent: [Calls add_task(title="buy milk")] -> "✓ Added task: Buy milk (ID: 8)"

User: "Complete 'Buy milk'"
Agent: [Calls complete_task(task_title="Buy milk")] -> "✓ Task 'Buy milk' (ID: 8) marked as complete!"

User: "Update 'buy milk' to 'buy almond milk'"
Agent: [Calls update_task(task_title="buy milk", title="buy almond milk")] -> "✓ Updated task: 'Buy almond milk' (ID: 8)"

User: "What do I need to do?"
Agent: [Calls list_tasks(status="pending")] -> "You have 3 pending tasks:\n1. Buy milk\n2. Call mom\n3. Finish report"

User: "Delete task 3"
Agent: [Calls delete_task(task_id=3)] -> "✓ Deleted task 'Old task' (ID: 3)"
```

## Security

- User authentication enforced via user_id validation in all tools
- Users can only access their own tasks
- Input validation on all parameters
- Database operations use existing security patterns
- Error messages are user-friendly and don't expose internal details

## Bidirectional Sync

Tasks created via chat appear in web UI and vice versa:

- Chat → MCP Server → TaskService → Database → Web UI
- Web UI → TaskService → Database → MCP Server → Chat

## Development

### Starting the MCP Server

```bash
cd backend/mcp_server
python start_server.py
```

### Testing

The server integrates with the existing test suite. All functionality can be tested through the chat interface.

### Dependencies

- Official MCP Python SDK (`mcp`)
- Existing backend dependencies (SQLModel, Pydantic, etc.)

## Deployment

The MCP Server runs as a separate process alongside the main FastAPI application. In production, both services should run in containers with internal networking.

## Error Handling

- Input validation with clear error messages
- Database connection errors gracefully handled
- Authentication failures properly caught
- Task ownership validation enforced
- User-friendly error responses

## Performance

- MCP tool execution under 200ms
- Agent response with MCP tools under 3 seconds
- MCP Server startup under 2 seconds
- Reuses existing optimized database queries
