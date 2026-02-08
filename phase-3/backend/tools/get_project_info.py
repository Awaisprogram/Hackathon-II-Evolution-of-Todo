from agents import function_tool

@function_tool
async def get_projects_info():
    """Fetch detailed information about Awais's offered services and completed projects."""

    return """
    ** Featured Projects:**
    - Portfolio Website
    - Ecommerce Website
    - AI Agents & Chatbots
    - UI-to-Code Conversions
    - Inventory Management System
    - Blogging Websites
    - Admin Dashboards
    """