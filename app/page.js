"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./lib/supabase";

export default function Home() {
  const [area, setArea] = useState("All");
  const [maxPrice, setMaxPrice] = useState(15000);
  const [bedrooms, setBedrooms] = useState("All");
  const [wishlist, setWishlist] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
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
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data: prefs } = await supabase
          .from("preferences")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        if (prefs) {
          if (prefs.max_budget) setMaxPrice(prefs.max_budget);
          if (prefs.min_bedrooms !== null) setBedrooms(prefs.min_bedrooms.toString());
          if (prefs.preferred_areas && prefs.preferred_areas.length > 0) {
            setArea(prefs.preferred_areas[0]);
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
      await supabase
        .from("favourites")
        .delete()
        .eq("user_id", user.id)
        .eq("listing_id", listingId);
      setWishlist((prev) => prev.filter((id) => id !== listingId));
    } else {
      await supabase
        .from("favourites")
        .insert({ user_id: user.id, listing_id: listingId });
      setWishlist((prev) => [...prev, listingId]);
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">

      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-400">NyumbaHunter</h1>
          <div className="flex gap-4 items-center">
            <button className="text-gray-400 hover:text-white">Listings</button>
            <button
             onClick={() => router.push("/preferences")}
             className="text-gray-400 hover:text-white">
             Preferences
            </button>
            <button
              onClick={() => router.push("/wishlist")}
              className="text-gray-400 hover:text-white">
              Wishlist
              {wishlist.length > 0 && (
                <span className="ml-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {wishlist.length}
                </span>
              )}
            </button>
            {user ? (
              <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    setUser(null);
                  }}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  Log Out
                </button>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="text-5xl font-bold mb-4">
          Find Your House in <span className="text-blue-400">Ruaka & Ruiru</span>
        </h2>
        <p className="text-gray-400 text-xl mb-8">
          AI-powered house hunting. Under Ksh 15,000. No agent fees.
        </p>

        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white w-full"
            >
              <option value="All">All Areas</option>
              <option value="ruaka">Ruaka</option>
              <option value="ruiru">Ruiru</option>
              <option value="thika-road">Thika Road</option>
            </select>

            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white w-full"
            >
              <option value={8000}>Ksh 8,000</option>
              <option value={10000}>Ksh 10,000</option>
              <option value={12000}>Ksh 12,000</option>
              <option value={15000}>Ksh 15,000</option>
            </select>

            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white w-full"
            >
              <option value="All">Bedrooms</option>
              <option value="0">Bedsitter</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
            </select>
          </div>
          <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-lg transition">
            Search Houses
          </button>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h3 className="text-2xl font-bold mb-6">
          Available Now{" "}
          <span className="text-blue-400 text-lg font-normal ml-2">
            {loading ? "..." : `${filteredListings.length} listings`}
          </span>
        </h3>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden animate-pulse">
                <div className="bg-gray-800 h-48" />
                <div className="p-5 space-y-3">
                  <div className="bg-gray-800 h-4 rounded w-3/4" />
                  <div className="bg-gray-800 h-3 rounded w-1/2" />
                  <div className="bg-gray-800 h-8 rounded w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-5xl mb-4">🏚️</p>
            <p className="text-xl">No listings found. Try different filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden hover:border-blue-500 transition cursor-pointer"
              >
                <div className="bg-gray-700 h-48 flex items-center justify-center text-gray-500 text-sm">
                  Photos coming soon
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg">{listing.title}</h4>
                    <span className="text-blue-400 font-bold">
                      Ksh {listing.price.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{listing.description}</p>

                  <div className="flex gap-2 flex-wrap mb-4">
                    <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded">
                      {listing.bedrooms === 0 ? "Bedsitter" : `${listing.bedrooms} Bed`}
                    </span>
                    <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded">
                      {listing.furnished ? "Furnished" : "Unfurnished"}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      listing.water_reliability === "Reliable"
                        ? "bg-green-900 text-green-400"
                        : "bg-yellow-900 text-yellow-400"
                    }`}>
                      Water: {listing.water_reliability}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/listing/${listing.id}`)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg transition"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => toggleWishlist(listing.id)}
                      className={`px-3 py-2 border rounded-lg transition ${
                        wishlist.includes(listing.id)
                          ? "border-red-400 text-red-400"
                          : "border-gray-600 text-gray-400 hover:border-red-400 hover:text-red-400"
                      }`}
                    >
                      {wishlist.includes(listing.id) ? "♥" : "♡"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </main>
  );
}