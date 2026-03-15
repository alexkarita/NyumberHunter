import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { message, listings } = await request.json();

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        max_tokens: 500,
        messages: [
          {
            role: "system",
            content: `You are a helpful house hunting assistant for NyumbaHunter. You help people find houses in Ruaka, Ruiru and Thika Road area in Kenya. Here are the available listings: ${JSON.stringify(listings)}. When recommending listings, return a JSON response with this format: {"message": "your response here", "listings": [array of matching listing objects]}. Only return listings that match what the user is asking for. If no listings match, return an empty array for listings.`,
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();
    const text = data.choices[0].message.content;

    try {
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json({ message: text, listings: [] });
    }
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}