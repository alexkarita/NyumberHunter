import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const recentCalls = {};

export async function POST(request) {
  try {
    const { userId, userPhone } = await request.json();

    const now = Date.now();
    if (recentCalls[userId] && now - recentCalls[userId] < 60000) {
      console.log("Agent already ran recently for:", userId, "— skipping");
      return NextResponse.json({ success: true, message: "Already ran recently" });
    }
    recentCalls[userId] = now;

    console.log("Agent Step 1");
    const { data: prefs } = await supabase
      .from("preferences")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!prefs) throw new Error("No preferences found");

    console.log("Agent Step 2");
    let query = supabase.from("listings").select("*");
    if (prefs.preferred_areas?.length > 0) {
      query = query.in("area", prefs.preferred_areas);
    }
    if (prefs.max_budget) {
      query = query.lte("price", prefs.max_budget);
    }

    const { data: listings } = await query;
    if (!listings || listings.length === 0) throw new Error("No listings found");

    console.log("Found", listings.length);

    const top3 = listings.slice(0, 3);
    console.log("Top 3:", top3.map((l) => l.title));

    const msg =
      "NyumbaHunter Agent Results!\n\n" +
      "1. " + top3[0]?.title + "\nKsh " + top3[0]?.price + "/month\n\n" +
      "2. " + top3[1]?.title + "\nKsh " + top3[1]?.price + "/month\n\n" +
      "3. " + top3[2]?.title + "\nKsh " + top3[2]?.price + "/month\n\n" +
      "Visit: https://nyumbahunter.vercel.app";

    const waRes = await fetch(
      "https://graph.facebook.com/v18.0/" + process.env.WHATSAPP_PHONE_ID + "/messages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.WHATSAPP_TOKEN,
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: "254" + userPhone.substring(1),
          type: "text",
          text: { body: msg },
        }),
      }
    );

    const waData = await waRes.json();
    console.log("WhatsApp sent:", JSON.stringify(waData));

    return NextResponse.json({ success: true, message: "Agent completed!" });
  } catch (error) {
    console.error("Agent ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}