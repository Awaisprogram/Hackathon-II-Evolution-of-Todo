"""
MCP Server Configuration
"""
from typing import Optional
from pydantic import BaseModel, Field


class MCPConfig(BaseModel):
    """
    Configuration for the MCP Server
    """
    server_name: str = Field(default="Todo Task Management Server", description="Name of the MCP server")
    website_url: Optional[str] = Field(default=None, description="Website URL for the server")
    debug: bool = Field(default=False, description="Enable debug mode")
    timeout: int = Field(default=30, description="Timeout for tool execution in seconds")
    max_concurrent_tasks: int = Field(default=100, description="Maximum concurrent tasks")
    database_url: Optional[str] = Field(default=None, description="Database URL for the server")


# Global configuration instance
config = MCPConfig()