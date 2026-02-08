"""
MCP Tool: complete_task
Purpose: Mark a task as completed
"""

from typing import Dict, Any
from enum import Enum


async def complete_task(
    user_id: str,
    id: str,
) -> Dict[str, Any]:
    """
    Mark a task as completed.
    
    Example usage:
    - "Complete task [id]"
    - "Mark task [id] as done"
    
    Args:
        user_id: User's ID from JWT authentication context
        id: Task ID to complete
    
    Returns:
        dict: Updated task info or error
    """
    try:
        # Import from main.py to use existing Task model and Session
        import sys
        import os
        sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        from main import Task, Session, engine, select
        
        # Use the existing database engine from main.py
        with Session(engine) as db:
            # Find the task belonging to the user
            db_task = db.exec(
                select(Task).where(Task.id == id, Task.user_id == user_id)
            ).first()
            
            if not db_task:
                return {
                    "error": "Task not found",
                    "status": "error"
                }
            
            # Mark as completed
            db_task.completed = True
            db.commit()
            db.refresh(db_task)
            
            return {
                "id": db_task.id,
                "title": db_task.title,
                "priority": db_task.priority.value if hasattr(db_task.priority, 'value') else db_task.priority,
                "dueDate": db_task.dueDate,
                "completed": db_task.completed,
                "createdAt": db_task.createdAt,
                "status": "completed",
                "message": "Task marked as completed"
            }
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": f"Failed to complete task: {str(e)}", "status": "error"}

