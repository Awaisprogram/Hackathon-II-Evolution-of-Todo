"""
MCP Tool: add_task
Purpose: Create new task for the user via chatbot
"""

from typing import Dict, Any, Optional
from enum import Enum


class Priority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


async def add_task(
    user_id: str,
    title: str,
    priority: str = "medium",
    dueDate: str = "",
) -> Dict[str, Any]:
    """
    Create a new task for the user.
    
    Example usage:
    - "Create a task: Buy groceries with high priority"
    - "Add todo: Finish project report with medium priority"
    
    Args:
        user_id: User's ID from JWT authentication context
        title: Task title (required, max 200 chars)
        priority: Task priority: low, medium, or high (default: medium)
        dueDate: Due date in ISO format or empty string (default: empty)
    
    Returns:
        dict: {id, title, priority, dueDate, completed, status, message}
    """
    try:
        # Validate inputs for empty title
        if not title or len(title.strip()) == 0:
            return {"error": "Title cannot be empty", "status": "error"}
        
        # Import from main.py to use existing Task model and Session
        import sys
        import os
        sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        from main import Task, Session, engine
        from datetime import datetime
        import uuid
        
        # Use the existing database engine from main.py
        print(f"[MCP add_task] Creating task for user_id: {user_id}")
        print(f"[MCP add_task] Task details: title='{title}', priority={priority}")
        
        with Session(engine) as db:
            # Create new task
            task_id = str(uuid.uuid4())
            now = datetime.utcnow().isoformat()
            
            db_task = Task(
                id=task_id,
                title=title.strip(),
                priority=priority,
                dueDate=dueDate or now,
                createdAt=now,
                completed=False,
                user_id=user_id,
            )
            
            db.add(db_task)
            db.commit()
            db.refresh(db_task)
            
            return {
                "id": db_task.id,
                "title": db_task.title,
                "priority": db_task.priority.value if hasattr(db_task.priority, 'value') else db_task.priority,
                "dueDate": db_task.dueDate,
                "completed": db_task.completed,
                "createdAt": db_task.createdAt,
                "status": "created",
                "message": f"Task '{db_task.title}' created successfully"
            }
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": f"Failed to create task: {str(e)}", "status": "error"}

