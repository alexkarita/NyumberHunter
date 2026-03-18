import { NextResponse } from "next/server";

const cache = {};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "apartment nairobi";

  if (cache[query]) {
    return NextResponse.json({ url: cache[query] });
  }

  try {
    console.log("Fetching Pexels for:", query);
    console.log("API Key:", process.env.PEXELS_API_KEY ? "Found" : "Missing");

    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=15`,
      {
        headers: {
          Authorization: process.env.PEXELS_API_KEY,
        },
      }
    );

    console.log("Pexels status:", response.status);
    const data = await response.json();
    console.log("Pexels response:", JSON.stringify(data).slice(0, 200));

    if (data.photos && data.photos.length > 0) {
      const random = data.photos[Math.floor(Math.random() * data.photos.length)];
      const url = random.src.large;
      cache[query] = url;
      return NextResponse.json({ url });
    }

    return NextResponse.json({ url: null });
  } catch (error) {
    console.error("Pexels error:", error);
    return NextResponse.json({ url: null });
  }
}