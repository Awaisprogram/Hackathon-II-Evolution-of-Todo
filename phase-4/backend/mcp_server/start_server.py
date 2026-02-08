#!/usr/bin/env python3
"""
Start script for MCP Server
"""
import asyncio
import sys
import os

from server import main


async def run_mcp_server():
    """Run the MCP Server."""
    print("Starting MCP Server for Task Management...")
    print("MCP Server will be available for agent connections")
    try:
        await main()
    except KeyboardInterrupt:
        print("\nMCP Server stopped by user")
    except Exception as e:
        print(f"MCP Server error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(run_mcp_server())
