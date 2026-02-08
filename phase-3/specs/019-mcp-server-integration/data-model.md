# Data Model: MCP Server Integration for AI Chatbot Task Management

## Overview
This document defines the data models and structures required for the MCP Server implementation that will enable natural language task management through the AI chatbot.

## MCP Tool Input/Output Models

### add_task Tool
**Input Parameters**:
- `user_id`: string (required) - User's ID from JWT context
- `title`: string (required, max 200 chars) - Task title
- `description`: string (optional, max 1000 chars) - Task description

**Output Response**:
```json
{
  "task_id": integer,
  "title": string,
  "status": "created",
  "message": string
}
```

### list_tasks Tool
**Input Parameters**:
- `user_id`: string (required) - User's ID
- `status`: string (optional) - Filter by status ("all", "pending", "completed")

**Output Response**:
```json
{
  "tasks": [
    {
      "id": integer,
      "title": string,
      "description": string,
      "completed": boolean,
      "created_at": string
    }
  ],
  "count": integer,
  "status": "success"
}
```

### update_task Tool
**Input Parameters**:
- `user_id`: string (required) - User's ID
- `task_id`: integer (required) - Task ID to update
- `title`: string (optional) - New title
- `description`: string (optional) - New description

**Output Response**:
```json
{
  "task_id": integer,
  "title": string,
  "description": string,
  "status": "updated"
}
```

### delete_task Tool
**Input Parameters**:
- `user_id`: string (required) - User's ID
- `task_id`: integer (required) - Task ID to delete

**Output Response**:
```json
{
  "task_id": integer,
  "title": string,
  "status": "deleted"
}
```

### complete_task Tool
**Input Parameters**:
- `user_id`: string (required) - User's ID
- `task_id`: integer (required) - Task ID to complete

**Output Response**:
```json
{
  "task_id": integer,
  "title": string,
  "completed": boolean,
  "status": "completed" | "incomplete"
}
```

## Error Response Model
**Standard Error Response**:
```json
{
  "error": string,
  "status": "error"
}
```

## Existing Data Model Integration

### Task Entity (from existing TaskService)
- **Attributes**: id, title (required), description (optional), completed (boolean), created_at, updated_at, user_id
- **Constraints**: title required (max 200 chars), description optional (max 1000 chars), user ownership enforced

### User Entity (from existing system)
- **Attributes**: id, authentication tokens, session data
- **Constraints**: users can only access their own tasks

## MCP Protocol Models

### Tool Registration
- **Name**: Tool name (add_task, list_tasks, update_task, delete_task, complete_task)
- **Description**: Brief description of the tool's purpose
- **Parameters**: JSON Schema defining expected input parameters
- **Returns**: JSON Schema defining expected output format

### Tool Call Format
- **Method**: Tool name to be called
- **Arguments**: Dictionary of parameters to pass to the tool
- **Response**: Structured response according to MCP protocol

## Validation Rules

### Input Validation
1. **Title Validation**: Must be 1-200 characters, cannot be empty or whitespace only
2. **Description Validation**: Must be ≤1000 characters if provided
3. **User ID Validation**: Must be a valid user ID from authentication context
4. **Task ID Validation**: Must be a positive integer for update/delete/complete operations
5. **Status Validation**: Must be one of "all", "pending", "completed" for list_tasks

### Business Logic Validation
1. **Ownership Validation**: Tools must verify that the user owns the task being operated on
2. **Existence Validation**: Tools must verify that the task exists before operating on it
3. **Permission Validation**: Users can only operate on their own tasks

## State Transitions

### Task State Transitions
- **Pending → Completed**: Via complete_task tool
- **Completed → Pending**: Via complete_task tool (toggles status)
- **Created**: Via add_task tool
- **Deleted**: Via delete_task tool (removes from system)

## Serialization Formats

### MCP Request Format
```json
{
  "method": "add_task",
  "params": {
    "user_id": "user123",
    "title": "Buy groceries",
    "description": "Milk and eggs"
  }
}
```

### MCP Response Format
```json
{
  "result": {
    "task_id": 8,
    "title": "Buy groceries",
    "status": "created",
    "message": "Task created successfully"
  }
}
```