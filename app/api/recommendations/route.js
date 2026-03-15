import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { preferences, listings } = await request.json();

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
       "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        max_tokens: 1000,
        messages: [
          {
            role: "system",
            content: `You are a house hunting assistant for NyumbaHunter. Always respond in JSON format only. No markdown, no extra text.`
          },
          {
            role: "user",
            content: `A user has these preferences:
- Preferred areas: ${preferences.preferred_areas?.join(", ") || "Any"}
- Max budget: Ksh ${preferences.max_budget || 15000}
- Bedrooms: ${preferences.min_bedrooms === 0 ? "Bedsitter" : (preferences.min_bedrooms || "Any")}
- Must have water: ${preferences.must_have_water ? "Yes" : "No"}

Here are available listings:
${JSON.stringify(listings.slice(0, 15).map(l => ({ id: l.id, title: l.title, price: l.price, area: l.area, bedrooms: l.bedrooms, water_reliability: l.water_reliability })))}.

Pick the top 3 listings that best match the user preferences.
Rank them from best match to worst match.

Return ONLY this JSON with no extra text:
{"message": "friendly 1 sentence intro", "listings": [{"id": "use exact id from listings above", "rank": 1, "reason": "why this matches"}, {"id": "use exact id from listings above", "rank": 2, "reason": "why this matches"}, {"id": "use exact id from listings above", "rank": 3, "reason": "why this matches"}]}

IMPORTANT: Only return the id, rank and reason fields. Use the EXACT id values from the listings provided above. Do not make up or modify any ids.`
          }
        ],
      }),
    });

    const data = await response.json();
    console.log("Recommendations:", JSON.stringify(data));

    if (!data.choices) {
      throw new Error("API error: " + JSON.stringify(data));
    }

    const text = data.choices[0].message.content;
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Recommendations ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}