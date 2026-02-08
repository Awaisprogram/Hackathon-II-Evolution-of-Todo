"""
MCP Tool: list_tasks
Purpose: List all tasks for the user with optional filtering
"""

from typing import Dict, Any, List, Optional
from enum import Enum


class TaskStatus(str, Enum):
    all = "all"
    pending = "pending"
    completed = "completed"


async def list_tasks(
    user_id: str,
    status: str = "all",
    priority: Optional[str] = None,
) -> Dict[str, Any]:
    """
    List all tasks for the user with optional filtering.
    
    Example usage:
    - "List all my tasks"
    - "Show me pending tasks"
    - "What are my completed tasks?"
    - "Show me high priority tasks"
    
    Args:
        user_id: User's ID from JWT authentication context
        status: Filter by status - "all", "pending", or "completed" (default: "all")
        priority: Filter by priority - "low", "medium", or "high" (optional)
    
    Returns:
        dict: {tasks: [{id, title, priority, dueDate, completed, createdAt}], count, status}
    """
    try:
        # Validate status parameter
        if status not in ["all", "pending", "completed"]:
            return {
                "error": "Status must be 'all', 'pending', or 'completed'",
                "status": "error"
            }
        
        # Validate priority if provided
        valid_priorities = ["low", "medium", "high"]
        if priority is not None and priority.lower() not in valid_priorities:
            return {
                "error": f"Priority must be one of: {', '.join(valid_priorities)}",
                "status": "error"
            }
        
        # Import from main.py to use existing Task model and Session
        import sys
        import os
        sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        from main import Task, Session, engine, select
        
        # Use the existing database engine from main.py
        with Session(engine) as db:
            # Build query for user's tasks
            statement = select(Task).where(Task.user_id == user_id)
            
            # Apply status filter
            if status == "pending":
                statement = statement.where(Task.completed == False)
            elif status == "completed":
                statement = statement.where(Task.completed == True)
            
            # Apply priority filter if provided
            if priority is not None:
                statement = statement.where(Task.priority == priority.lower())
            
            # Order by created date (newest first)
            statement = statement.order_by(Task.createdAt.desc())
            
            tasks = db.exec(statement).all()
            
            # Format tasks for response
            tasks_list = [
                {
                    "id": task.id,
                    "title": task.title,
                    "priority": task.priority.value if hasattr(task.priority, 'value') else task.priority,
                    "dueDate": task.dueDate,
                    "completed": task.completed,
                    "createdAt": task.createdAt
                }
                for task in tasks
            ]
            
            return {
                "tasks": tasks_list,
                "count": len(tasks_list),
                "status": "success"
            }
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": f"Failed to list tasks: {str(e)}", "status": "error"}

