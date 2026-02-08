"""
Shared utilities for MCP Server
"""
from typing import Dict, Any
from sqlmodel import Session
from services.task_service import TaskService


def validate_user_ownership(user_id: str, task_id: int, db: Session) -> bool:
    """
    Validate that the user owns the task they're trying to access.

    Args:
        user_id: ID of the requesting user
        task_id: ID of the task to check
        db: Database session

    Returns:
        bool: True if user owns the task, False otherwise
    """
    try:
        task_service = TaskService()
        task = task_service.get_task_by_id(user_id, task_id, db)
        return task is not None
    except Exception:
        return False


def validate_task_exists(task_id: int, db: Session) -> bool:
    """
    Validate that a task exists in the database.

    Args:
        task_id: ID of the task to check
        db: Database session

    Returns:
        bool: True if task exists, False otherwise
    """
    try:
        # We need to get the task without user validation to check existence
        from models.task import Task
        task = db.get(Task, task_id)
        return task is not None
    except Exception:
        return False