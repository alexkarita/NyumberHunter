import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const { listing } = await request.json();

    // Get all preferences with whatsapp numbers
    const { data: allPrefs, error } = await supabase
      .from("preferences")
      .select("*")
      .not("whatsapp_number", "is", null);

    if (error) throw new Error(error.message);

    const matched = [];

    for (const pref of allPrefs) {
      // Check area match
      const areaMatch =
        !pref.preferred_areas ||
        pref.preferred_areas.length === 0 ||
        pref.preferred_areas.includes(listing.area);

      // Check budget match
      const budgetMatch =
        !pref.max_budget || listing.price <= pref.max_budget;

      // Check bedrooms match
      const bedroomMatch =
        pref.min_bedrooms === null ||
        listing.bedrooms >= pref.min_bedrooms;

      // Check water match
      const waterMatch =
        !pref.must_have_water ||
        listing.water_reliability === "Reliable";

      if (areaMatch && budgetMatch && bedroomMatch && waterMatch) {
        matched.push(pref);
      }
    }

    console.log(`Found ${matched.length} matching users`);

    // Send WhatsApp to each matched user
    const results = [];
    for (const pref of matched) {
      const phone = pref.whatsapp_number;
      if (!phone) continue;

      const message = `🏠 *NyumbaHunter Alert!*

A new listing matches your preferences:

*${listing.title}*
📍 ${listing.location}
💰 Ksh ${listing.price.toLocaleString()}/month
🛏️ ${listing.bedrooms === 0 ? "Bedsitter" : listing.bedrooms + " Bedroom"}
💧 Water: ${listing.water_reliability}
🔒 Security: ${listing.security_rating}/10

View listing:
https://nyumbahunter.vercel.app/listing/${listing.id}

Reply STOP to unsubscribe`;

      const response = await fetch(
        `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.WHATSAPP_TOKEN}`,
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: `254${phone.substring(1)}`,
            type: "text",
            text: { body: message }
          }),
        }
      );

      const data = await response.json();
      console.log(`Sent to ${phone}:`, JSON.stringify(data));
      results.push({ phone, success: !data.error });
    }

    return NextResponse.json({
      success: true,
      matched: matched.length,
      results
    });

  } catch (error) {
    console.error("Notify error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}