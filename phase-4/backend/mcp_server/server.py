"""
MCP Server for Todo Task Management
Uses Official MCP Python SDK
"""

from mcp.server.fastmcp import FastMCP
import asyncio
from typing import Optional

# Initialize MCP Server
mcp = FastMCP("Todo Task Management Server")

# Import and register tools - these use the main.py Task model and Session
from tools.add_task import add_task
from tools.list_tasks import list_tasks
from tools.update_task import update_task
from tools.delete_task import delete_task
from tools.complete_task import complete_task
from tools.incomplete_task import incomplete_task

# Register tools with MCP Server
mcp.tool()(add_task)
mcp.tool()(list_tasks)
mcp.tool()(update_task)
mcp.tool()(delete_task)
mcp.tool()(complete_task)
mcp.tool()(incomplete_task)

# All todo CRUD tools are now implemented


# Run MCP Server
async def main():
    """Run the MCP server"""
    mcp.run()


if __name__ == "__main__":
    asyncio.run(main())
