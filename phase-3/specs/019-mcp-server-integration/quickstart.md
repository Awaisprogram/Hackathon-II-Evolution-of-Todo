# Quickstart Guide: MCP Server Integration for AI Chatbot Task Management

## Overview
This guide provides instructions for setting up, running, and testing the MCP Server that enables natural language task management through the AI chatbot.

## Prerequisites
- Python 3.12+
- Node.js 18+ (for frontend)
- PostgreSQL-compatible database (Neon)
- Google Gemini API key
- Existing project dependencies installed

## Installation

### Backend Setup
1. **Install MCP Server dependencies**:
   ```bash
   cd backend/mcp_server
   pip install -r requirements.txt
   ```

2. **Ensure backend dependencies are installed**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

### Environment Configuration
1. **Configure environment variables** (same as main backend):
   ```bash
   # In backend/.env
   DATABASE_URL=postgresql://...
   GEMINI_API_KEY=your_gemini_api_key
   SECRET_KEY=your_secret_key
   ```

## Running the Application

### Development Mode
1. **Start MCP Server** (Terminal 1):
   ```bash
   cd backend/mcp_server
   python server.py
   ```

2. **Start FastAPI Backend** (Terminal 2):
   ```bash
   cd backend
   uvicorn main:app --reload --port 8000
   ```

3. **Start Frontend** (Terminal 3):
   ```bash
   cd frontend
   pnpm dev
   ```

### Production Mode
Using Docker Compose:
```yaml
version: '3.8'
services:
  mcp-server:
    build: ./backend/mcp_server
    command: python server.py
    environment:
      - DATABASE_URL=${DATABASE_URL}
    networks:
      - internal

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - SECRET_KEY=${SECRET_KEY}
    depends_on:
      - mcp-server
    networks:
      - internal
      - external

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
    depends_on:
      - backend
    networks:
      - external

networks:
  internal:
    driver: bridge
  external:
    driver: bridge
```

## Testing the MCP Server

### Manual Testing
1. **Verify MCP Server is running**:
   - Check that MCP Server starts without errors
   - Confirm MCP tools are registered and available

2. **Test natural language commands**:
   - "Add task buy milk" → Should create task in database
   - "Show my tasks" → Should list tasks
   - "Complete task 1" → Should mark task as completed
   - "Delete task 2" → Should remove task
   - "Update task 3 to new title" → Should update title

3. **Verify bidirectional sync**:
   - Create task via web UI → Check if visible in chat
   - Create task via chat → Check if visible in web UI

### API Testing
1. **Direct MCP tool testing** (via MCP client):
   ```python
   from mcp import ClientSession, StdioServerParameters
   from mcp.client.stdio import stdio_client

   server_params = StdioServerParameters(
       command="python",
       args=["backend/mcp_server/server.py"]
   )

   async with stdio_client(server_params) as (read, write):
       async with ClientSession(read, write) as session:
           await session.initialize()
           result = await session.call_tool("add_task", {
               "user_id": "test_user",
               "title": "Test task"
           })
           print(result)
   ```

## Troubleshooting

### Common Issues
1. **MCP Server won't start**:
   - Verify MCP SDK is properly installed
   - Check Python path and dependencies
   - Ensure database connection is available

2. **Agent can't connect to MCP tools**:
   - Verify MCP Server is running
   - Check that tool definitions match agent expectations
   - Confirm authentication context is passed correctly

3. **Tasks not syncing between interfaces**:
   - Verify both interfaces use the same database
   - Check that user authentication is properly enforced
   - Confirm TaskService is called consistently

### Debugging Commands
1. **Check MCP Server status**:
   ```bash
   cd backend/mcp_server
   python -c "from server import server; print('MCP Server initialized')"
   ```

2. **Verify database connection**:
   ```bash
   cd backend
   python -c "from database import engine; print('DB connected:', bool(engine))"
   ```

## Next Steps
1. Complete the implementation of MCP tools
2. Integrate with the AI agent
3. Test end-to-end functionality
4. Optimize performance
5. Deploy to production