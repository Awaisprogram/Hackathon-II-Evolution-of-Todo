from fastapi import FastAPI, Depends, HTTPException, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse,StreamingResponse
from sqlmodel import SQLModel, Field, create_engine, Session, select
from enum import Enum
from typing import Optional, List
import os
from jose import jwt
from dotenv import load_dotenv
from datetime import datetime
import uuid
import traceback

# ---- AI Agent Imports ----

from pydantic import BaseModel
from agents import (
    Agent,
    Runner
)
from openai.types.responses import ResponseTextDeltaEvent
from my_config import groq_key, groq_config
from tools.get_services_info import get_services_info
from tools.get_skills_info import get_skills_info
from tools.get_social_info import get_social_info
from tools.get_project_info import get_projects_info
import os
import json
from typing import List, Dict, Literal

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
WEB_URL = os.getenv("WEB_URL", "http://localhost:3000")
NEXTAUTH_SECRET = os.getenv("NEXTAUTH_SECRET")
ALGORITHM = "HS256"

# ---- ENV GUARDS (IMPORTANT FOR VERCEL) ----
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set")
if not NEXTAUTH_SECRET:
    raise RuntimeError("NEXTAUTH_SECRET is not set")

# ---- ENGINE (psycopg2 compatible) ----
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300,
)

# ---- TODO MODELS ----
class Priority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    
# ---- AI MODELS ----
class ChatRequest(BaseModel):
    messages: List[Dict[Literal["role", "text"], str]]



class Task(SQLModel, table=True):
    __tablename__ = "task"
    
    id: str = Field(primary_key=True)
    title: str = Field(index=True)
    completed: bool = Field(default=False)
    priority: Priority = Field(default=Priority.medium)
    dueDate: str = Field(default="")
    createdAt: str = Field(default="")
    user_id: Optional[str] = Field(default=None, index=True)


class TaskCreate(SQLModel):
    title: str
    priority: Priority = Priority.medium
    dueDate: str = ""


class TaskUpdate(SQLModel):
    title: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[Priority] = None
    dueDate: Optional[str] = None


# ---- APP ----
app = FastAPI(title="Task Manager API")

# ---- GLOBAL ERROR HANDLER ----
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catch all exceptions and provide detailed error info"""
    error_trace = traceback.format_exc()
    print(f"❌❌❌ GLOBAL ERROR ❌❌❌")
    print(f"Error Type: {type(exc).__name__}")
    print(f"Error Message: {str(exc)}")
    print(f"Full Traceback:\n{error_trace}")
    
    return JSONResponse(
        status_code=500,
        content={
            "error": str(exc),
            "type": type(exc).__name__,
            "detail": "Check server logs for full traceback"
        }
    )

# ---- DB INIT ----
@app.on_event("startup")
def on_startup():
    try:
        SQLModel.metadata.create_all(bind=engine)
        print("✅ Database initialized successfully")
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        raise


# ---- CORS ----
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- AUTH ----
def get_current_user(authorization: str = Header(None)):
    """Extract and validate JWT token, return user email"""
    try:
        print(f"🔐 Auth header received: {authorization[:50] if authorization else 'None'}...")
        
        if not authorization or not authorization.startswith("Bearer "):
            print("❌ No authorization header or invalid format")
            raise HTTPException(status_code=401, detail="Unauthorized - No token provided")
        
        token = authorization.split(" ")[1]
        print(f"🎫 Token extracted (first 20 chars): {token[:20]}...")
        
        payload = jwt.decode(token, NEXTAUTH_SECRET, algorithms=[ALGORITHM])
        print(f"✅ Token decoded successfully. Payload keys: {list(payload.keys())}")
        
        user_email = payload.get("email")
        if not user_email:
            print(f"❌ Token has no email. Payload: {payload}")
            raise HTTPException(status_code=401, detail="Invalid token - No email in payload")
        
        print(f"✅ Authenticated user: {user_email}")
        return user_email
        
    except jwt.JWTError as e:
        print(f"❌ JWT Error: {type(e).__name__} - {str(e)}")
        raise HTTPException(status_code=401, detail=f"Token verification failed: {str(e)}")
    except Exception as e:
        print(f"❌ Unexpected auth error: {type(e).__name__} - {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")


# ---- ROUTES ----

@app.get("/")
def health_check():
    """Health check endpoint"""
    return {"message": "API is running", "status": "healthy", "version": "1.0.0"}


@app.get("/tasks")
def get_tasks(user_id: str = Depends(get_current_user)):
    """Get all tasks for the authenticated user ONLY"""
    try:
        print(f"📋 GET /tasks - Fetching tasks for user: {user_id}")
        
        with Session(engine) as session:
            print(f"   📊 Executing SQL query...")
            tasks = session.exec(
                select(Task).where(Task.user_id == user_id)
            ).all()
            
            print(f"   ✅ Query executed. Found {len(tasks)} tasks")
            
            # Convert to list of dicts for safe serialization
            task_list = []
            for task in tasks:
                task_dict = {
                    "id": task.id,
                    "title": task.title,
                    "completed": task.completed,
                    "priority": task.priority.value,
                    "dueDate": task.dueDate,
                    "createdAt": task.createdAt,
                    "user_id": task.user_id
                }
                task_list.append(task_dict)
                print(f"   📝 Task: {task.id[:8]}... - {task.title}")
            
            print(f"✅ Returning {len(task_list)} tasks")
            return task_list
            
    except Exception as e:
        print(f"❌ Error in get_tasks: {type(e).__name__} - {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to fetch tasks: {str(e)}")


@app.post("/tasks")
def create_task(task: TaskCreate, user_id: str = Depends(get_current_user)):
    """Create a new task for the authenticated user"""
    try:
        print(f"➕ POST /tasks - Creating task for user: {user_id}")
        print(f"   📝 Task data: title='{task.title}', priority={task.priority}")
        
        with Session(engine) as session:
            task_id = str(uuid.uuid4())
            now = datetime.utcnow().isoformat()
            
            db_task = Task(
                id=task_id,
                title=task.title,
                priority=task.priority,
                dueDate=task.dueDate or now,
                createdAt=now,
                completed=False,
                user_id=user_id,
            )
            
            print(f"   💾 Adding task to database...")
            session.add(db_task)
            session.commit()
            session.refresh(db_task)
            
            print(f"✅ Created task: {db_task.id[:8]}...")
            
            # Return as dict
            return {
                "id": db_task.id,
                "title": db_task.title,
                "completed": db_task.completed,
                "priority": db_task.priority.value,
                "dueDate": db_task.dueDate,
                "createdAt": db_task.createdAt,
                "user_id": db_task.user_id
            }
            
    except Exception as e:
        print(f"❌ Error in create_task: {type(e).__name__} - {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to create task: {str(e)}")


@app.put("/tasks/{id}")
def update_task(id: str, update_data: TaskUpdate, user_id: str = Depends(get_current_user)):
    """Update a task - only if it belongs to the authenticated user"""
    try:
        print(f"✏️  PUT /tasks/{id[:8]}... - Updating task for user: {user_id}")
        
        with Session(engine) as session:
            db_task = session.exec(
                select(Task).where(
                    Task.id == id,
                    Task.user_id == user_id,
                )
            ).first()
            
            if not db_task:
                print(f"❌ Task {id[:8]}... not found or user {user_id} not authorized")
                raise HTTPException(status_code=404, detail="Task not found or unauthorized")
            
            # Update only provided fields
            if update_data.title is not None:
                db_task.title = update_data.title
            if update_data.completed is not None:
                db_task.completed = update_data.completed
            if update_data.priority is not None:
                db_task.priority = update_data.priority
            if update_data.dueDate is not None:
                db_task.dueDate = update_data.dueDate
            
            session.commit()
            session.refresh(db_task)
            
            print(f"✅ Updated task: {db_task.id[:8]}...")
            
            return {
                "id": db_task.id,
                "title": db_task.title,
                "completed": db_task.completed,
                "priority": db_task.priority.value,
                "dueDate": db_task.dueDate,
                "createdAt": db_task.createdAt,
                "user_id": db_task.user_id
            }
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error in update_task: {type(e).__name__} - {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to update task: {str(e)}")


@app.patch("/tasks/{id}/toggle")
def toggle_task_completion(id: str, user_id: str = Depends(get_current_user)):
    """Toggle task completion status"""
    try:
        print(f"🔄 PATCH /tasks/{id[:8]}.../toggle - Toggling for user: {user_id}")
        
        with Session(engine) as session:
            db_task = session.exec(
                select(Task).where(
                    Task.id == id,
                    Task.user_id == user_id,
                )
            ).first()
            
            if not db_task:
                print(f"❌ Task {id[:8]}... not found or user {user_id} not authorized")
                raise HTTPException(status_code=404, detail="Task not found or unauthorized")
            
            db_task.completed = not db_task.completed
            session.commit()
            session.refresh(db_task)
            
            print(f"✅ Toggled task {db_task.id[:8]}... to completed={db_task.completed}")
            
            return {
                "id": db_task.id,
                "title": db_task.title,
                "completed": db_task.completed,
                "priority": db_task.priority.value,
                "dueDate": db_task.dueDate,
                "createdAt": db_task.createdAt,
                "user_id": db_task.user_id
            }
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error in toggle_task: {type(e).__name__} - {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to toggle task: {str(e)}")


@app.delete("/tasks/{id}")
def delete_task(id: str, user_id: str = Depends(get_current_user)):
    """Delete a task - only if it belongs to the authenticated user"""
    try:
        print(f"🗑️  DELETE /tasks/{id[:8]}... - Deleting for user: {user_id}")
        
        with Session(engine) as session:
            db_task = session.exec(
                select(Task).where(
                    Task.id == id,
                    Task.user_id == user_id,
                )
            ).first()
            
            if not db_task:
                print(f"❌ Task {id[:8]}... not found or user {user_id} not authorized")
                raise HTTPException(status_code=404, detail="Task not found or unauthorized")
            
            session.delete(db_task)
            session.commit()
            
            print(f"✅ Deleted task: {id[:8]}...")
            return {"message": "Task deleted", "id": id}
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error in delete_task: {type(e).__name__} - {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to delete task: {str(e)}")


@app.get("/tasks/stats")
def get_task_stats(user_id: str = Depends(get_current_user)):
    """Get task statistics for the authenticated user"""
    try:
        print(f"📊 GET /tasks/stats - Fetching stats for user: {user_id}")
        
        with Session(engine) as session:
            tasks = session.exec(
                select(Task).where(Task.user_id == user_id)
            ).all()
            
            total_tasks = len(tasks)
            completed_tasks = sum(1 for task in tasks if task.completed)
            pending_tasks = total_tasks - completed_tasks
            
            today = datetime.utcnow().date()
            today_tasks = sum(
                1 for task in tasks 
                if task.createdAt and datetime.fromisoformat(task.createdAt).date() == today
            )
            
            high_priority_tasks = sum(
                1 for task in tasks 
                if task.priority == Priority.high and not task.completed
            )
            
            stats = {
                "total_tasks": total_tasks,
                "completed_tasks": completed_tasks,
                "pending_tasks": pending_tasks,
                "today_tasks": today_tasks,
                "high_priority_tasks": high_priority_tasks,
                "completion_rate": round((completed_tasks / total_tasks * 100) if total_tasks > 0 else 0, 1)
            }
            
            print(f"✅ Stats: {stats}")
            return stats
            
    except Exception as e:
        print(f"❌ Error in get_task_stats: {type(e).__name__} - {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {str(e)}")




# AI INTEGRATION

@app.post("/chat")
async def chat(request: ChatRequest):
    print("📥 Received messages:", request.messages)

    async def generate_response():
        try:
            agent = Agent(
                name="Personal Portfolio Agent",
                instructions="""
                - Identity / Role
                You are Awais’s Portfolio Assistant, a professional AI agent representing Awais Mehmood, a Full-Stack Developer, Front-End Specialist, and AI Engineer. Your purpose is to provide accurate, clear, and helpful information about Awais, his skills, projects, and contact options. You speak in a friendly, professional, and confident tone, making users feel informed and welcomed.

                Background About the Owner (Awais)
                Name: Awais Mehmood

                Roles: Full-Stack Developer, Front-End Specialist, AI Engineer

                Experience: Highly skilled in the modern web stack (React, Next.js, JavaScript, TypeScript) and robust backend development (Python, FastAPI). Proven ability to build modern, production-ready applications, implement interactive interfaces with tools like GSAP, and leverage AI/LLMs for intelligent features.

                Strengths / Interests: Creating visually appealing, responsive, and user-centric web interfaces; delivering scalable backend architecture; solving problems with Full-Stack solutions; enthusiastic about continuous learning and technology sharing.

                - Personality / Style: Detail-oriented, creative, solution-focused, and enthusiastic.
                Tools Integration Guidelines:

                Skills Tool:

                Contains all technical and soft skills of Awais.

                Call this tool when asked about skills, expertise, or technologies.

                Projects Tool:

                Contains all portfolio projects with descriptions, features, and technologies.

                Call this tool when asked about any project, portfolio work, or case studies.

                Contact Tool:

                Contains professional contact channels like email, LinkedIn, GitHub.

                Call this tool when asked how to contact or connect with Awais.

                Rules for Tool Use:

                Always prefer actual tool data over default persona data.

                Never fabricate skills, projects, or contact information.

                Politely redirect if the user asks about topics outside the portfolio scope.

                - Response Guidelines:

                Keep answers concise but informative.

                Structure responses clearly, using bullet points when necessary.

                Avoid unnecessary apologies or filler statements.

                Maintain professional and friendly tone at all times.

                Handling Unknown Questions:

                Politely state if information is unavailable:
                “I don’t have that detail right now, but here’s what I can share…”

                Redirect questions outside of the portfolio:
                “I can help you learn about Awais’s skills, projects, or how to contact him.”

                - Example Responses:

                Q: “What skills does Awais have?”
                A: Calls Skills Tool → returns a structured list of skills.

                Q: “Tell me about Awais’s projects.”
                A: Calls Projects Tool → provides a detailed overview of portfolio projects.

                Q: “How can I contact Awais?”
                A: Calls Contact Tool → shares professional contact channels.

                Q: “Who is Awais?”
                A: Summarizes persona background with tone and professionalism.
                """,
                tools=[get_social_info, get_services_info, get_skills_info,get_projects_info],
            )

            print("⚙️ Running agent...")

            # 🧩 Wrapped Runner.run_streamed inside try/except for Guardrail handling
            try:
                result = Runner.run_streamed(
                    agent,
                    input="\n".join(
                        [
                            f"{message['role']}: {message['text']}"
                            for message in request.messages
                        ]
                    ),
                    run_config=groq_config,
                    
                )

                async for event in result.stream_events():
                    if (
                        event.type == "raw_response_event"
                        and isinstance(event.data, ResponseTextDeltaEvent)
                    ):
                        chunk_data = {"chunk": event.data.delta}
                        yield f"{json.dumps(chunk_data)}\n\n"
                        print({"chunk": chunk_data})
                    elif (
                        event.type == "run_item_stream_event"
                        and event.item.type == "tool_call_item"
                    ):
                        print(f"{event.item.raw_item.name} Tool was called")

                yield json.dumps({"done": True}) + "\n\n"
                print("✅ Stream completed successfully")

            except Exception as e:
               print("Something went wrong")

            except Exception as e:
                alert_msg = "Alert: Guardrail output tripwire was triggered!"
                print(alert_msg)
                yield f"{json.dumps({'error': alert_msg})}\n\n"

        except Exception as e:
            print("❌ Error:", str(e))
            yield f"{json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(
        generate_response(),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-transform, no-cache",
            "Connection": "keep-alive",
        },
    )


