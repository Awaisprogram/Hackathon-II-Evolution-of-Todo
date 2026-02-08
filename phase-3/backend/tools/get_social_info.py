from agents import function_tool


@function_tool
async def get_social_info():
    """Get information related to Awais's Social Handles and Contact Details."""
    return """
    **Socials:**
    **Emails:** awaisbinmehmoodahmed@gmail.com
    **Linkedin:** https://www.linkedin.com/in/awais-mehmood-903500309/
    **Contact Number:** 03130480064
    """
