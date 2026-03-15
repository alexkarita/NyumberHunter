"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I am your NyumbaHunter assistant. Tell me what kind of house you are looking for and I will find the best matches for you.",
      listings: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [allListings, setAllListings] = useState([]);
  const bottomRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setAllListings(data);
    }
    init();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          listings: allListings.slice(0, 10),
        }),
      });

      const parsed = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: parsed.message,
          listings: parsed.listings || [],
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry I could not process your request. Please try again.",
          listings: [],
        },
      ]);
    }

    setLoading(false);
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#030712", color: "white" }}>

      <nav style={{ background: "#111827", borderBottom: "1px solid #1f2937", padding: "16px 24px", flexShrink: 0 }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1
            onClick={() => router.push("/")}
            style={{ fontSize: "22px", fontWeight: "bold", color: "#60a5fa", cursor: "pointer" }}
          >
            NyumbaHunter
          </h1>
          <button
            onClick={() => router.push("/")}
            style={{ color: "#9ca3af", fontSize: "14px", background: "none", border: "none", cursor: "pointer" }}
          >
            Back to listings
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: "900px", width: "100%", margin: "0 auto", padding: "20px 24px 0", flexShrink: 0 }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "4px" }}>AI House Assistant</h2>
        <p style={{ color: "#9ca3af", fontSize: "14px" }}>Describe what you are looking for and I will find it for you</p>
      </div>

      <div style={{ flex: 1, overflowY: "auto", maxWidth: "900px", width: "100%", margin: "0 auto", padding: "20px 24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {messages.map((msg, i) => (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "70%",
                  padding: "12px 16px",
                  borderRadius: "18px",
                  fontSize: "14px",
                  background: msg.role === "user" ? "#2563eb" : "#1f2937",
                  color: msg.role === "user" ? "white" : "#e5e7eb",
                }}>
                  {msg.content}
                </div>
              </div>

              {msg.listings && msg.listings.length > 0 && (
                <div style={{ marginTop: "16px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
                  {msg.listings.map((listing) => (
                    <div key={listing.id} style={{ background: "#111827", border: "1px solid #374151", borderRadius: "16px", overflow: "hidden" }}>
                      <div style={{ background: "#374151", height: "120px", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280", fontSize: "13px" }}>
                        Photos coming soon
                      </div>
                      <div style={{ padding: "16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                          <span style={{ fontWeight: "bold", fontSize: "14px" }}>{listing.title}</span>
                          <span style={{ color: "#60a5fa", fontWeight: "bold", fontSize: "13px" }}>Ksh {listing.price?.toLocaleString()}</span>
                        </div>
                        <p style={{ color: "#9ca3af", fontSize: "12px", marginBottom: "12px" }}>{listing.description}</p>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => router.push(`/listing/${listing.id}`)}
                            style={{ flex: 1, background: "#2563eb", color: "white", border: "none", padding: "8px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => window.open(`https://wa.me/254${listing.landlord_phone?.substring(1)}`, "_blank")}
                            style={{ flex: 1, background: "#16a34a", color: "white", border: "none", padding: "8px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
                          >
                            WhatsApp
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div style={{ background: "#1f2937", padding: "12px 16px", borderRadius: "18px", fontSize: "14px", color: "#9ca3af" }}>
                Searching listings...
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <div style={{ flexShrink: 0, borderTop: "1px solid #1f2937", padding: "16px 24px", background: "#030712" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", gap: "12px" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="e.g. Find me a furnished bedsitter in Ruiru under 8k"
            style={{ flex: 1, background: "#1f2937", border: "1px solid #374151", borderRadius: "12px", padding: "12px 16px", color: "white", fontSize: "14px", outline: "none" }}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            style={{ background: loading ? "#1e3a5f" : "#2563eb", color: "white", border: "none", padding: "12px 24px", borderRadius: "12px", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer", fontSize: "14px" }}
          >
            Send
          </button>
        </div>
      </div>

    </div>
  );
}