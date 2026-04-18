import Anthropic from "@anthropic-ai/sdk";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const { messages } = req.body;

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: "你是一个友好专业的AI学习助手。用清晰易懂的中文回答问题，多举例子帮助理解。",
      messages,
    });

    res.status(200).json({ reply: response.content[0].text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI 服务出错，请稍后重试" });
  }
}
