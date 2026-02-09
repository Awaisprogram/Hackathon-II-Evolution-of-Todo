"""
MCP Tool: incomplete_task
Purpose: Mark a task as incomplete (pending)
"""

from typing import Dict, Any
from enum import Enum


async def incomplete_task(
    user_id: str,
    id: str,
) -> Dict[str, Any]:
    """
    Mark a task as incomplete (pending).
    
    Example usage:
    - "Mark task [id] as incomplete"
    - "Set task [id] to pending"
    
    Args:
        user_id: User's ID from JWT authentication context
        id: Task ID to mark as incomplete
    
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
            
            # Mark as incomplete
            db_task.completed = False
            db.commit()
            db.refresh(db_task)
            
            return {
                "id": db_task.id,
                "title": db_task.title,
                "priority": db_task.priority.value if hasattr(db_task.priority, 'value') else db_task.priority,
                "dueDate": db_task.dueDate,
                "completed": db_task.completed,
                "createdAt": db_task.createdAt,
                "status": "pending",
                "message": "Task marked as pending"
            }
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": f"Failed to mark task as incomplete: {str(e)}", "status": "error"}

