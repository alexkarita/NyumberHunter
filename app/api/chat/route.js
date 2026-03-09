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
        max_tokens: 2000,
        messages: [
          {
            role: "system",
            content: `You are a house hunting assistant for NyumbaHunter, an app that helps people find houses in Ruaka, Ruiru and Thika Road areas of Nairobi, Kenya.

Here are all the available listings:
${JSON.stringify(listings)}

Respond ONLY in JSON format with no extra text outside the JSON:
{"message": "your friendly response here", "listings": [array of matching listing objects or empty array]}

Rules:
- Only include listings that genuinely match what the user is asking for
- If no listings match return empty array and explain in message
- Keep message friendly and helpful
- Prices are in Kenyan Shillings (Ksh)
- Always respond in JSON format only`
          },
          {
            role: "user",
            content: message
          }
        ],
      }),
    });

    const data = await response.json();
    console.log("Groq response:", JSON.stringify(data));

    if (!data.choices) {
      throw new Error("API error: " + JSON.stringify(data));
    }

    const text = data.choices[0].message.content;
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}