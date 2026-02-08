// app/api/chat/route.ts

export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // Get the JWT token directly (this is what your Python backend expects)
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    if (!token) {
      console.error("[Chat API] No token found - user not authenticated");
      return NextResponse.json(
        { error: "Unauthorized - Please log in" },
        { status: 401 }
      );
    }

    console.log("[Chat API] User email:", token.email);
    
    // Create a JWT string that your Python backend can decode
    // NextAuth stores the session JWT in cookies, but we need to encode it for the Authorization header
    const { SignJWT } = await import('jose');
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
    
    const accessToken = await new SignJWT({ 
      email: token.email,
      name: token.name,
      sub: token.sub,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(secret);

    console.log("[Chat API] JWT token created for:", token.email);

    const pythonRes = await fetch(`${process.env.BACKEND_URL}/chat`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ messages }),
    });

    if (!pythonRes.ok) {
      const errorText = await pythonRes.text();
      console.error(`[Chat API] Python backend error (${pythonRes.status}):`, errorText);
      throw new Error(
        `Python backend responded with status: ${pythonRes.status}`
      );
    }

    // Create a streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const reader = pythonRes.body?.getReader();
          const decoder = new TextDecoder();

          if (reader) {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              const chunk = decoder.decode(value, { stream: true });
              controller.enqueue(new TextEncoder().encode(chunk));
            }
          }
          controller.close();
        } catch (error) {
          console.error("Error processing stream:", error);
          const errorData = JSON.stringify({
            error: "Sorry, there was an error processing your request.",
          });
          controller.enqueue(
            new TextEncoder().encode(`${errorData}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in chat API:", error);

    // Return error as streaming response
    const errorStream = new ReadableStream({
      start(controller) {
        const errorData = JSON.stringify({
          error: "Sorry, there was an error processing your request. Try later",
        });
        controller.enqueue(new TextEncoder().encode(errorData));
        controller.close();
      },
    });

    return new NextResponse(errorStream, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }
}