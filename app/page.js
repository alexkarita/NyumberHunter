"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./lib/supabase";
import dynamic from "next/dynamic";
import ListingCard from "./components/ListingCard";
import Button from "./components/Button";
const Map = dynamic(() => import("./components/Map"), { ssr: false });

export default function Home() {
  const [area, setArea] = useState("All");
  const [maxPrice, setMaxPrice] = useState(15000);
  const [bedrooms, setBedrooms] = useState("All");
  const [wishlist, setWishlist] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [recsLoading, setRecsLoading] = useState(false);
  const [recsMessage, setRecsMessage] = useState("");
  const [selectedListing, setSelectedListing] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const agentFiredRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching listings:", error);
      } else {
        setListings(data);
      }
      setLoading(false);
    }
    fetchListings();
  }, []);

  useEffect(() => {
    async function getUser() {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data: prefs } = await supabase
          .from("preferences")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        if (prefs) {
          setPreferences(prefs);

          const lastRun = localStorage.getItem("agentLastRun");
          const now = Date.now();
          const oneDay = 24 * 60 * 60 * 1000;
          const alreadyRan = lastRun && (now - parseInt(lastRun) < oneDay);
          if (prefs.whatsapp_number && !agentFiredRef.current && !alreadyRan) {
            agentFiredRef.current = true;
            localStorage.setItem("agentLastRun", now.toString());
            fetch("/api/agent", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: session.user.id,
                userPhone: prefs.whatsapp_number,
              }),
            })
              .then((res) => res.json())
              .then((data) => console.log("Agent result:", data))
              .catch((err) => console.error("Agent error:", err));
          }
        }
      }
    }
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchRecommendations() {
      if (!preferences || listings.length === 0) return;
      await new Promise((resolve) => setTimeout(resolve, 10000));
      setRecsLoading(true);

      try {
        const response = await fetch("/api/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ preferences, listings }),
        });
        const data = await response.json();
        if (data.listings) {
          const seen = new Set();
          const matched = data.listings.map((rec) => {
            if (seen.has(rec.id)) return null;
            seen.add(rec.id);
            const full = listings.find((l) => l.id === rec.id);
            return full ? { ...full, rank: rec.rank, reason: rec.reason } : null;
          }).filter(Boolean);
          setRecommendations(matched);
          setRecsMessage(data.message);
        }
      } catch (error) {
        console.error("Recommendations error:", error);
      }

      setRecsLoading(false);
    }

    fetchRecommendations();
  }, [preferences, listings]);

  const filteredListings = listings.filter((listing) => {
    const areaMatch = area === "All" || listing.area === area;
    const priceMatch = listing.price <= maxPrice;
    const bedroomMatch = bedrooms === "All" || listing.bedrooms.toString() === bedrooms;
    return areaMatch && priceMatch && bedroomMatch;
  });

  async function toggleWishlist(listingId) {
    if (!user) {
      router.push("/login");
      return;
    }
    const isWishlisted = wishlist.includes(listingId);
    if (isWishlisted) {
      await supabase.from("favourites").delete().eq("user_id", user.id).eq("listing_id", listingId);
      setWishlist((prev) => prev.filter((id) => id !== listingId));
    } else {
      await supabase.from("favourites").insert({ user_id: user.id, listing_id: listingId });
      setWishlist((prev) => [...prev, listingId]);
    }
  }

  return (
    <main style={{ background: "var(--color-canvas)", minHeight: "100vh", color: "var(--color-text)" }}>

      {/* NAVBAR */}
      <nav style={{ background: "var(--color-brand)", borderBottom: "1px solid #3d4e41" }} className="px-4 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="logo text-xl font-bold" style={{ color: "var(--color-canvas)" }}>
            NyumbaHunter
          </h1>

          <div className="hidden md:flex gap-6 items-center">
            <button style={{ color: "var(--color-brand-lt)" }} className="hover:text-white text-sm">Listings</button>
            <button onClick={() => router.push("/chat")} style={{ color: "var(--color-brand-lt)" }} className="hover:text-white text-sm">AI Chat</button>
            <button onClick={() => router.push("/preferences")} style={{ color: "var(--color-brand-lt)" }} className="hover:text-white text-sm">Preferences</button>
            <button onClick={() => router.push("/wishlist")} style={{ color: "var(--color-brand-lt)" }} className="hover:text-white text-sm">
              Wishlist
              {wishlist.length > 0 && (
                <span className="ml-1 text-white text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--color-accent)" }}>{wishlist.length}</span>
              )}
            </button>
            {user ? (
              <Button variant="ghost" onClick={async () => {
                await supabase.auth.signOut();
                setUser(null);
                localStorage.removeItem("agentLastRun");
                router.push("/login");
              }}>
                Log Out
              </Button>
            ) : (
              <Button variant="primary" onClick={() => router.push("/login")}>
                Sign In
              </Button>
            )}
          </div>

          <div className="flex md:hidden items-center gap-3">
            {user ? (
              <Button variant="ghost" onClick={async () => {
                await supabase.auth.signOut();
                setUser(null);
                localStorage.removeItem("agentLastRun");
                router.push("/login");
              }}>
                Log Out
              </Button>
            ) : (
              <Button variant="primary" onClick={() => router.push("/login")}>
                Sign In
              </Button>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ color: "var(--color-brand-lt)" }} className="p-2 text-xl">
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden mt-3 pt-3 flex flex-col gap-2 px-4" style={{ borderTop: "1px solid #3d4e41" }}>
            <button onClick={() => { router.push("/"); setMenuOpen(false); }} style={{ color: "var(--color-brand-lt)" }} className="text-sm text-left py-2">🏠 Listings</button>
            <button onClick={() => { router.push("/chat"); setMenuOpen(false); }} style={{ color: "var(--color-brand-lt)" }} className="text-sm text-left py-2">🤖 AI Chat</button>
            <button onClick={() => { router.push("/preferences"); setMenuOpen(false); }} style={{ color: "var(--color-brand-lt)" }} className="text-sm text-left py-2">⚙️ Preferences</button>
            <button onClick={() => { router.push("/wishlist"); setMenuOpen(false); }} style={{ color: "var(--color-brand-lt)" }} className="text-sm text-left py-2">
              ♥ Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
            </button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: "var(--color-text)" }}>
          Find Your Home in <span style={{ color: "var(--color-accent)" }}>Nairobi</span>
        </h2>
        <p className="text-base md:text-xl mb-8" style={{ color: "var(--color-text-muted)" }}>
          AI-powered house hunting. Under Ksh 15,000. No agent fees.
        </p>

        <div className="rounded-2xl p-6 max-w-3xl mx-auto" style={{ background: "white", border: "1px solid var(--color-brand-lt)", boxShadow: "var(--shadow-card)" }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="rounded-lg px-4 py-3 w-full text-sm"
              style={{ background: "var(--color-canvas)", border: "1px solid var(--color-brand-lt)", color: "var(--color-text)" }}
            >
              <option value="All">All Areas</option>
              <option value="ruaka">Ruaka</option>
              <option value="ruiru">Ruiru</option>
              <option value="thika-road">Thika Road</option>
            </select>

            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="rounded-lg px-4 py-3 w-full text-sm"
              style={{ background: "var(--color-canvas)", border: "1px solid var(--color-brand-lt)", color: "var(--color-text)" }}
            >
              <option value={8000}>Ksh 8,000</option>
              <option value={10000}>Ksh 10,000</option>
              <option value={12000}>Ksh 12,000</option>
              <option value={15000}>Ksh 15,000</option>
            </select>

            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="rounded-lg px-4 py-3 w-full text-sm"
              style={{ background: "var(--color-canvas)", border: "1px solid var(--color-brand-lt)", color: "var(--color-text)" }}
            >
              <option value="All">Bedrooms</option>
              <option value="0">Bedsitter</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
            </select>
          </div>
          <Button variant="primary" className="w-full mt-4 text-base">
            Search Houses
          </Button>
        </div>
      </section>

      {/* RECOMMENDATIONS */}
      {user && (recsLoading || recommendations.length > 0) && (
        <section className="max-w-6xl mx-auto px-4 pb-12">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-xl md:text-2xl font-bold">✨ Recommended for you</h3>
            {recsLoading && <span className="text-sm" style={{ color: "var(--color-text-faint)" }}>Finding best matches...</span>}
          </div>

          {recsMessage && !recsLoading && (
            <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>{recsMessage}</p>
          )}

          {recsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="rounded-3xl overflow-hidden animate-pulse" style={{ background: "white", boxShadow: "var(--shadow-card)" }}>
                  <div className="h-52" style={{ background: "var(--color-brand-lt)" }} />
                  <div className="p-4 space-y-3">
                    <div className="h-4 rounded w-3/4" style={{ background: "var(--color-brand-lt)" }} />
                    <div className="h-3 rounded w-1/2" style={{ background: "var(--color-brand-lt)" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((listing) => (
                <div key={listing.id}>
                  <ListingCard
                    listing={listing}
                    isWishlisted={wishlist.includes(listing.id)}
                    onToggleWishlist={toggleWishlist}
                    onViewDetails={(id) => router.push(`/listing/${id}`)}
                  />
                  <p className="text-xs mt-2 rounded-lg px-3 py-2" style={{ color: "var(--color-ai-text)", background: "var(--color-ai-bg)", border: "1px solid var(--color-ai-border)" }}>
                    ✦ {listing.reason}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* LISTINGS */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-center gap-4 mb-6">
          <h3 className="text-xl md:text-2xl font-bold" style={{ color: "var(--color-text)" }}>
            Available Now{" "}
            <span className="text-base font-normal ml-2" style={{ color: "var(--color-text-muted)" }}>
              {loading ? "..." : `${filteredListings.length} listings`}
            </span>
          </h3>
          <div className="flex gap-2 ml-auto">
            <Button variant={!showMap ? "brand" : "ghost"} onClick={() => setShowMap(false)}>
              Grid
            </Button>
            <Button variant={showMap ? "brand" : "ghost"} onClick={() => setShowMap(true)}>
              Map
            </Button>
          </div>
        </div>

        {showMap ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Map listings={filteredListings} onListingClick={(listing) => setSelectedListing(listing)} />
            </div>
            <div>
              {selectedListing ? (
                <div className="rounded-3xl overflow-hidden" style={{ background: "white", boxShadow: "var(--shadow-card)" }}>
                  <ListingCard
                    listing={selectedListing}
                    isWishlisted={wishlist.includes(selectedListing.id)}
                    onToggleWishlist={toggleWishlist}
                    onViewDetails={(id) => router.push(`/listing/${id}`)}
                  />
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => setSelectedListing(null)}
                      className="w-full mt-2 text-sm"
                      style={{ color: "var(--color-text-faint)" }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl p-6 text-center" style={{ background: "white", boxShadow: "var(--shadow-card)" }}>
                  <p className="text-4xl mb-3">📍</p>
                  <p style={{ color: "var(--color-text-muted)" }}>Click any pin on the map to see listing details</p>
                </div>
              )}
            </div>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="rounded-3xl overflow-hidden animate-pulse" style={{ background: "white", boxShadow: "var(--shadow-card)" }}>
                <div className="h-52" style={{ background: "var(--color-brand-lt)" }} />
                <div className="p-4 space-y-3">
                  <div className="h-4 rounded w-3/4" style={{ background: "var(--color-brand-lt)" }} />
                  <div className="h-3 rounded w-1/2" style={{ background: "var(--color-brand-lt)" }} />
                  <div className="h-8 rounded w-full mt-4" style={{ background: "var(--color-brand-lt)" }} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-20" style={{ color: "var(--color-text-muted)" }}>
            <p className="text-5xl mb-4">🏚️</p>
            <p className="text-xl">No listings found. Try different filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                isWishlisted={wishlist.includes(listing.id)}
                onToggleWishlist={toggleWishlist}
                onViewDetails={(id) => router.push(`/listing/${id}`)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}