"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Wishlist() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);

      const { data, error } = await supabase
        .from("favourites")
        .select("listing_id, listings(*)")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching wishlist:", error);
      } else {
        setListings(data.map((f) => f.listings));
      }

      setLoading(false);
    }

    init();
  }, []);

  async function removeFromWishlist(listingId) {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase
      .from("favourites")
      .delete()
      .eq("user_id", user.id)
      .eq("listing_id", listingId);

    setListings((prev) => prev.filter((l) => l.id !== listingId));
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">

      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1
            onClick={() => router.push("/")}
            className="text-2xl font-bold text-blue-400 cursor-pointer"
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

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-2">My Wishlist</h2>
        <p className="text-gray-400 mb-8">Houses you have saved</p>

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
            <p className="text-5xl mb-4">🏚️</p>
            <p className="text-xl mb-6">No saved listings yet</p>
            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-white font-semibold transition"
            >
              Browse listings
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden hover:border-blue-500 transition"
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
                  <p className="text-gray-400 text-sm mb-4">{listing.description}</p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/listing/${listing.id}`)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg transition"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => removeFromWishlist(listing.id)}
                      className="px-3 py-2 border border-red-400 text-red-400 hover:bg-red-900 rounded-lg transition"
                    >
                      Remove
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