const handler = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { messages } = req.body;
    const lastMsg = messages[messages.length - 1].content;

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/ai/run/@cf/meta/llama-4-scout-17b-16e-instruct`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.CF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "你是一个友好专业的AI学习助手。用清晰易懂的中文回答问题，多举例子帮助理解。" },
            ...messages
          ],
        }),
      }
    );

    const data = await response.json();
    const reply = data.result?.response || "抱歉，出错了";
    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI 服务出错：" + err.message });
  }
};

module.exports = handler;
