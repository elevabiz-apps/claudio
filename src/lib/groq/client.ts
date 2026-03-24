export function isGroqConfigured(): boolean {
  return Boolean(process.env.GROQ_API_KEY);
}

export interface GroqMessage {
  role: "user" | "assistant" | "system";
  content: string | GroqContentPart[];
}

export interface GroqContentPart {
  type: "text" | "image_url";
  text?: string;
  image_url?: { url: string };
}

export async function groqChatComplete(
  messages: GroqMessage[],
  model: string,
  maxTokens = 2048
): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`${res.status} ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}
