from agents import function_tool


@function_tool
async def get_services_info():
    
    """Get information related to Services that Awais offers."""
    return """
        **Services:**
            - Admin Dashboards
            - Portfolio Websites
            - E-Commerce Platforms
            - UI-to-Code Conversions
            - Custom Web Apps
            - Custom AI Agents & AI Chatbots
    """
