# API Contract: Task Management MCP Tools

## Overview
This document defines the API contracts for the 5 MCP tools that enable natural language task management through the AI chatbot.

## Tool: add_task

### Purpose
Create a new task for the authenticated user.

### Input Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | string | Yes | User's ID from authentication context |
| title | string | Yes | Task title (max 200 characters) |
| description | string | No | Task description (max 1000 characters) |

### Success Response
```json
{
  "task_id": 123,
  "title": "Buy groceries",
  "status": "created",
  "message": "Task created successfully"
}
```

### Error Response
```json
{
  "error": "Title cannot be empty",
  "status": "error"
}
```

### Validation Rules
- Title must be 1-200 characters
- Description must be ≤1000 characters if provided
- User must be authenticated and authorized to create tasks for themselves

## Tool: list_tasks

### Purpose
Retrieve the authenticated user's tasks with optional filtering.

### Input Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | string | Yes | User's ID from authentication context |
| status | string | No | Filter by status ("all", "pending", "completed") |

### Success Response
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Buy groceries",
      "description": "Milk and eggs",
      "completed": false,
      "created_at": "2026-01-18T10:00:00"
    }
  ],
  "count": 1,
  "status": "success"
}
```

### Error Response
```json
{
  "error": "Invalid status filter",
  "status": "error"
}
```

### Validation Rules
- Status must be one of "all", "pending", or "completed"
- User must be authenticated and authorized to view their own tasks

## Tool: update_task

### Purpose
Modify an existing task for the authenticated user.

### Input Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | string | Yes | User's ID from authentication context |
| task_id | integer | Yes | ID of the task to update |
| title | string | No | New task title (max 200 characters) |
| description | string | No | New task description (max 1000 characters) |

### Success Response
```json
{
  "task_id": 123,
  "title": "Updated task title",
  "description": "Updated description",
  "status": "updated"
}
```

### Error Response
```json
{
  "error": "Task not found",
  "status": "error"
}
```

### Validation Rules
- Task ID must exist and belong to the authenticated user
- Title must be ≤200 characters if provided
- Description must be ≤1000 characters if provided
- At least one update field must be provided

## Tool: delete_task

### Purpose
Remove a task for the authenticated user.

### Input Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | string | Yes | User's ID from authentication context |
| task_id | integer | Yes | ID of the task to delete |

### Success Response
```json
{
  "task_id": 123,
  "title": "Original task title",
  "status": "deleted"
}
```

### Error Response
```json
{
  "error": "Task not found",
  "status": "error"
}
```

### Validation Rules
- Task ID must exist and belong to the authenticated user
- User must be authenticated and authorized to delete their own tasks

## Tool: complete_task

### Purpose
Toggle the completion status of a task for the authenticated user.

### Input Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | string | Yes | User's ID from authentication context |
| task_id | integer | Yes | ID of the task to toggle completion status |

### Success Response
```json
{
  "task_id": 123,
  "title": "Task title",
  "completed": true,
  "status": "completed"
}
```

### Error Response
```json
{
  "error": "Task not found",
  "status": "error"
}
```

### Validation Rules
- Task ID must exist and belong to the authenticated user
- User must be authenticated and authorized to modify their own tasks
- Status field indicates whether task is now completed or incomplete

## Common Error Codes

| Error Code | Description |
|------------|-------------|
| INVALID_INPUT | Provided parameters do not meet validation requirements |
| AUTHENTICATION_FAILED | User is not properly authenticated |
| UNAUTHORIZED_ACCESS | User does not have permission for requested operation |
| RESOURCE_NOT_FOUND | Requested resource (e.g., task) does not exist |
| DATABASE_ERROR | Internal error occurred while accessing database |

## Security Requirements
- All tools require valid user authentication
- Users can only operate on their own tasks
- All inputs must be validated before processing
- Authentication context must be verified for each operation