import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { phone, message } = await request.json();

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
          text: {
            body: message
          }
        }),
      }
    );

    const data = await response.json();
    console.log("WhatsApp response:", JSON.stringify(data));

    if (data.error) {
      throw new Error(data.error.message);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("WhatsApp ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}