import { NextResponse } from "next/server";

// OpenRouter models ordered by performance and speed
const OPENROUTER_MODELS = [
  "google/gemini-2.0-flash-lite-001:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "deepseek/deepseek-chat",
  "openai/gpt-4o-mini",
  "qwen/qwen-2.5-coder-32b-instruct:free",
  "mistralai/mistral-7b-instruct:free",
];

export async function POST(req: Request) {
  try {
    const { prompt, system, jsonMode, model } = await req.json();

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenRouter API Key not configured in .env.local" },
        { status: 500 }
      );
    }

    // Use requested model if explicitly provided, otherwise fallback chain of models
    const modelsToTry = model ? [model, ...OPENROUTER_MODELS] : OPENROUTER_MODELS;

    let lastError = "";

    for (const currentModel of modelsToTry) {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "HTTP-Referer": "https://aijobanalyzer.com",
            "X-Title": "AI Job Market Analyzer",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: currentModel,
            messages: [
              ...(system ? [{ role: "system", content: system }] : []),
              { role: "user", content: prompt },
            ],
            response_format: jsonMode ? { type: "json_object" } : undefined,
            temperature: 0.7,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices?.[0]?.message?.content || "";
          if (content) {
            return NextResponse.json({
              content,
              model: currentModel,
              usage: data.usage,
              provider: "OpenRouter Free",
            });
          }
        } else {
          lastError = await response.text();
          console.warn(`OpenRouter model ${currentModel} returned ${response.status}:`, lastError);
        }
      } catch (err: unknown) {
        lastError = err instanceof Error ? err.message : String(err);
        console.warn(`Fetch failed for OpenRouter model ${currentModel}:`, lastError);
      }
    }

    return NextResponse.json(
      { error: `All OpenRouter free models failed. Last error: ${lastError}` },
      { status: 502 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in /api/ai/completion route:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

