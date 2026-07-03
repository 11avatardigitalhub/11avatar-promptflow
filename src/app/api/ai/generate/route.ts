import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt, model } = await request.json();

    if (model === "gemini") {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
      
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        }),
      });
      
      const data = await res.json();
      
      if (data.error) {
        return NextResponse.json({ output: "Gemini Error: " + data.error.message });
      }
      
      const output = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
      return NextResponse.json({ output });
    }

    if (model === "deepseek") {
      return NextResponse.json({ output: "DeepSeek: Insufficient balance. Please use Gemini (Free)." });
    }

    return NextResponse.json({ output: "Please select a model." });
  } catch (error: any) {
    return NextResponse.json({ output: "Error: " + error.message });
  }
}