import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { model, messages, stream, temperature, max_tokens } = await req.json();

  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  const GOOGLE_API_URL = "https://generativelanguage.googleapis.com/v1beta";

  let modelName = model.startsWith("models/") ? model : `models/${model}`;
  
  if (modelName.includes("gemma-3") && !modelName.endsWith("-it")) {
    modelName = `${modelName}-it`;
  }

  const googlePayload = {
    contents: messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content || m.message }],
    })),
    generationConfig: {
      temperature: temperature || 0.7,
      maxOutputTokens: max_tokens || 1024,
    },
  };

  try {
    if (stream) {
      const response = await fetch(
        `${GOOGLE_API_URL}/${modelName}:streamGenerateContent?alt=sse&key=${GOOGLE_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(googlePayload),
        }
      );

      const encoder = new TextEncoder();
      const decoder = new TextDecoder();

      const transformStream = new ReadableStream({
        async start(controller) {
          const reader = response.body?.getReader();
          if (!reader) return;

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                try {
                  const json = JSON.parse(line.substring(6));
                  const text = json.candidates?.[0]?.content?.parts?.[0]?.text || "";

                  const openAiChunk = {
                    id: Date.now().toString(),
                    object: "chat.completion.chunk",
                    created: Math.floor(Date.now() / 1000),
                    model: model,
                    choices: [
                      {
                        index: 0,
                        delta: { content: text },
                        finish_reason:
                          json.candidates?.[0]?.finishReason === "STOP"
                            ? "stop"
                            : null,
                      },
                    ],
                  };
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify(openAiChunk)}\n\n`)
                  );
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        },
      });

      return new Response(transformStream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    } else {
      const response = await fetch(
        `${GOOGLE_API_URL}/${modelName}:generateContent?key=${GOOGLE_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(googlePayload),
        }
      );

      const data = await response.json();
      if (data.error) throw data.error;

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      return NextResponse.json({
        id: Date.now().toString(),
        object: "chat.completion",
        created: Math.floor(Date.now() / 1000),
        model: model,
        choices: [
          {
            index: 0,
            message: { role: "assistant", content: text },
            finish_reason: "stop",
          },
        ],
        usage: data.usageMetadata,
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        error: {
          message: error.message || "Internal Server Error",
          type: "api_error",
        },
      },
      { status: 500 }
    );
  }
}
