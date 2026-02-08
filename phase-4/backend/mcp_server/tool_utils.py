"""
Shared utilities for MCP tools
"""

from typing import Dict, Any, Optional, Tuple, List
from sqlmodel import Session
from models.task import Task
from services.task_service import TaskService
from utils.errors import TaskNotFoundException, UnauthorizedTaskAccessException


def resolve_task(
    user_id: str,
    db: Session,
    task_id: Optional[int] = None,
    task_title: Optional[str] = None,
) -> Tuple[Optional[Task], Optional[Dict[str, Any]]]:
    """
    Common logic to resolve a task by ID or title.
    Returns (task_object, None) on success or (None, error_or_disambiguation_dict) on failure/clarification.
    """
    task_service = TaskService()

    try:
        # 1. Resolve by ID if provided
        if task_id is not None:
            try:
                task = task_service.get_task_by_id(user_id, task_id, db)
                return task, None
            except TaskNotFoundException:
                return None, {
                    "error": f"Task with ID {task_id} not found",
                    "status": "error",
                }
            except UnauthorizedTaskAccessException:
                return None, {
                    "error": f"Unauthorized access to task {task_id}",
                    "status": "error",
                }

        # 2. Resolve by Title if provided
        if task_title:
            matching_tasks = task_service.get_tasks_by_title(user_id, task_title, db)

            if not matching_tasks:
                return None, {
                    "error": f"No task found matching '{task_title}'",
                    "status": "error",
                }

            # If exactly one match
            if len(matching_tasks) == 1:
                return matching_tasks[0], None

            # Multiple matches - offer disambiguation
            matches = [
                {"id": t.id, "title": t.title, "completed": t.completed}
                for t in matching_tasks
            ]
            return None, {
                "disambiguation": f"Found {len(matching_tasks)} tasks matching '{task_title}'. Please specify which one by ID:",
                "matches": matches,
                "status": "needs_clarification",
            }

        return None, {
            "error": "Please provide either a task ID or task title",
            "status": "error",
        }
    except Exception as e:
        from sqlalchemy.exc import SQLAlchemyError

        if isinstance(e, SQLAlchemyError):
            return None, {
                "error": f"Database error during task resolution: {str(e)}",
                "status": "error",
            }
        return None, {
            "error": f"Unexpected error during task resolution: {str(e)}",
            "status": "error",
        }
