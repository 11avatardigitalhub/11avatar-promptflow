export async function callDeepSeek(prompt: string): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY || "";
  
  if (!apiKey) {
    return "Error: DeepSeek API key not configured. Please add DEEPSEEK_API_KEY to environment variables.";
  }

  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${apiKey}` 
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return `Error: ${response.status} - ${errorText}`;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "No response generated";
  } catch (error: any) {
    return `Error: ${error.message}`;
  }
}