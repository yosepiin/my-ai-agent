import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req) {
  try {
    const { message, history } = await req.json();
    const messages = [...history, { role: "user", content: message }];

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: "Kamu adalah AI agent yang membantu user. Jawab dalam Bahasa Indonesia.",
      messages,
    });

    const text = response.content
      .map(b => b.type === "text" ? b.text : "")
      .filter(Boolean)
      .join("\n");

    return Response.json({ reply: text });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
