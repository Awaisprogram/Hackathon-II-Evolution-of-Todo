"""
MCP Tool: delete_task
Purpose: Delete a task
"""

from typing import Dict, Any
from enum import Enum


async def delete_task(
    user_id: str,
    id: str,
) -> Dict[str, Any]:
    """
    Delete a task.
    
    Example usage:
    - "Delete task [id]"
    - "Remove task [id]"
    
    Args:
        user_id: User's ID from JWT authentication context
        id: Task ID to delete
    
    Returns:
        dict: Success message or error
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
            
            # Delete the task
            db.delete(db_task)
            db.commit()
            
            return {
                "status": "deleted",
                "message": "Task deleted successfully",
                "id": id
            }
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": f"Failed to delete task: {str(e)}", "status": "error"}

