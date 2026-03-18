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
            content: `You are a house hunting assistant. Always respond with valid JSON only. No markdown, no backticks, no extra text. Only output the JSON object.`
          },
          {
            role: "user",
            content: `Pick top 3 listings for this user.
Preferences: areas=${preferences.preferred_areas?.join(",")}, budget=${preferences.max_budget}, bedrooms=${preferences.min_bedrooms}, water=${preferences.must_have_water}
Listings: ${JSON.stringify(listings.slice(0, 15).map(l => ({ id: l.id, title: l.title, price: l.price, area: l.area, bedrooms: l.bedrooms, water_reliability: l.water_reliability })))}
Return ONLY this exact JSON format:
{"message":"one sentence","listings":[{"id":"exact_id","rank":1,"reason":"why"},{"id":"exact_id","rank":2,"reason":"why"},{"id":"exact_id","rank":3,"reason":"why"}]}`
          }
        ],
      }),
    });

    const data = await response.json();
    if (!data.choices) throw new Error("API error: " + JSON.stringify(data));

    const text = data.choices[0].message.content;

    // Clean the response
    let clean = text.replace(/```json|```/g, "").trim();

    // Extract just the JSON object if there is extra text
    const jsonMatch = clean.match(/\{[\s\S]*\}/);
    if (jsonMatch) clean = jsonMatch[0];

    // Fix trailing commas only
    clean = clean
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']');

    const parsed = JSON.parse(clean);
    return NextResponse.json(parsed);

  } catch (error) {
    console.error("Recommendations ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}