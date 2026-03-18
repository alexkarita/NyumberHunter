"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import ListingImage from "../components/ListingImage";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setUser(session.user);

      const { data: favs } = await supabase
        .from("favourites")
        .select("listing_id")
        .eq("user_id", session.user.id);

      if (favs && favs.length > 0) {
        const ids = favs.map((f) => f.listing_id);
        setWishlist(ids);

        const { data: listingData } = await supabase
          .from("listings")
          .select("*")
          .in("id", ids);

        if (listingData) setListings(listingData);
      }

      setLoading(false);
    }
    init();
  }, []);

  async function removeFromWishlist(listingId) {
    await supabase
      .from("favourites")
      .delete()
      .eq("user_id", user.id)
      .eq("listing_id", listingId);

    setWishlist((prev) => prev.filter((id) => id !== listingId));
    setListings((prev) => prev.filter((l) => l.id !== listingId));
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <nav className="bg-gray-900 border-b border-gray-800 px-4 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1
            onClick={() => router.push("/")}
            className="text-xl font-bold text-blue-400 cursor-pointer"
          >
            NyumbaHunter
          </h1>
          <button
            onClick={() => router.push("/")}
            className="text-gray-400 hover:text-white text-sm"
          >
            Back to listings
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold mb-8">♥ My Wishlist</h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden animate-pulse">
                <div className="bg-gray-800 h-48" />
                <div className="p-5 space-y-3">
                  <div className="bg-gray-800 h-4 rounded w-3/4" />
                  <div className="bg-gray-800 h-3 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-5xl mb-4">💔</p>
            <p className="text-xl mb-4">Your wishlist is empty</p>
            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold"
            >
              Browse Listings
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden hover:border-blue-500 transition"
              >
                <ListingImage title={listing.title} id={listing.id} />
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg">{listing.title}</h4>
                    <span className="text-blue-400 font-bold text-sm">
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
                      onClick={() => removeFromWishlist(listing.id)}
                      className="px-3 py-2 border border-red-400 text-red-400 rounded-lg transition hover:bg-red-900/20"
                    >
                      ♥
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}