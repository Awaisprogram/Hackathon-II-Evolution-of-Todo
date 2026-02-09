"""
MCP Tool: update_task
Purpose: Update an existing task
"""

from typing import Dict, Any, Optional
from enum import Enum


class Priority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


async def update_task(
    user_id: str,
    id: str,
    title: Optional[str] = None,
    priority: Optional[str] = None,
    dueDate: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Update an existing task.
    
    Example usage:
    - "Update task [id] to have title 'New Title'"
    - "Change the priority of task [id] to high"
    
    Args:
        user_id: User's ID from JWT authentication context
        id: Task ID to update
        title: New task title (optional)
        priority: New task priority - low, medium, or high (optional)
        dueDate: New due date in ISO format (optional)
    
    Returns:
        dict: Updated task info or error
    """
    try:
        # Import from main.py to use existing Task model and Session
        import sys
        import os
        sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        from main import Task, Session, engine
        
        # Use the existing database engine from main.py
        with Session(engine) as db:
            # Convert ID to integer for DB query
            task_id = int(id)
            # Find the task belonging to the user
            db_task = db.exec(
                select(Task).where(Task.id == task_id, Task.user_id == user_id)
            ).first()
            
            if not db_task:
                return {
                    "error": "Task not found",
                    "status": "error"
                }
            
            # Update only provided fields
            if title is not None:
                db_task.title = title
            if priority is not None:
                db_task.priority = priority
            if dueDate is not None:
                db_task.dueDate = dueDate
            
            db.commit()
            db.refresh(db_task)
            
            return {
                "id": db_task.id,
                "title": db_task.title,
                "priority": db_task.priority.value if hasattr(db_task.priority, 'value') else db_task.priority,
                "dueDate": db_task.dueDate,
                "completed": db_task.completed,
                "createdAt": db_task.createdAt,
                "status": "updated",
                "message": "Task updated successfully"
            }
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": f"Failed to update task: {str(e)}", "status": "error"}

