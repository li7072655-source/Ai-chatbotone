const handler = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { messages } = req.body;

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
            {
              role: "system",
              content: `你是一个友好专业的AI学习助手。回答问题时，请严格按照以下格式输出：

<think>
在这里写出你的思考过程：分析问题、拆解步骤、推理逻辑。用中文，2-5句话即可。
</think>

然后在这里写出正式的回答，清晰易懂，多举例子帮助理解。

规则：
- 必须先输出<think>...</think>块，再输出正式回答
- 如果用户上传了文件内容，要基于文件内容来回答
- 代码示例要加注释
- 回答用中文`
            },
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
