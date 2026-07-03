import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt, model } = await request.json();

    let output = "";

    if (model === "deepseek") {
      const apiKey = process.env.DEEPSEEK_API_KEY || "";
      const res = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: prompt },
          ],
          stream: false,
        }),
      });
      const data = await res.json();
      output = data.choices?.[0]?.message?.content || JSON.stringify(data);
    } else if (model === "gemini") {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );
      const data = await res.json();
      output = data.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(data);
    } else {
      return NextResponse.json({ error: "Invalid model" }, { status: 400 });
    }

    return NextResponse.json({ output });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}