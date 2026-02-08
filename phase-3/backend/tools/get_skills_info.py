from agents import function_tool


@function_tool
async def get_skills_info():
    """Get information related to Awais's Skills"""
    return """
    **Frontend Skills:**
    HTML, CSS, JavaScript/TypeScript, React.js, Next.js, Vite, Tailwind CSS, Redux.js, Framer Motion, GSAP, React Three Fiber, Three.js, Sanity CMS(Content Management System)

    Backend Skills (Agents):
    Python, AI Agents, AI Chatbots, Open AI Agents SDK(Software Development Kit), Gemini Models

    **Other Skills:**
    Git, GitHub, Vercel

    **Skills to Highlight:**
    - Next.js, Tailwind CSS, HTML, CSS, JavaScript
    - UI/UX Design from Figma converted to Next.js
    - Sanity CMS(Content Management System)
    - AI Agents & AI Chatbots
    """
