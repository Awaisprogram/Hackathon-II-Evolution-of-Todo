export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const pythonRes = await fetch(`${process.env.BACKEND_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    if (!pythonRes.ok) {
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
