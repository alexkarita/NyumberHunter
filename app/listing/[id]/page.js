"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

export default function ListingDetail({ params }) {
  const router = useRouter();
  const { id } = use(params);

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListing() {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        setListing(null);
      } else {
        setListing(data);
      }

      setLoading(false);
    }

    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Loading listing...
      </main>
    );
  }

  if (!listing) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🏚️</p>
          <p className="text-xl text-gray-400 mb-6">Listing not found</p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 px-6 py-3 rounded-xl"
          >
            Back to listings
          </button>
        </div>
      </main>
    );
  }

  function getSecurityStars(rating) {
    const full = Math.round(rating / 2);
    return "★".repeat(full) + "☆".repeat(5 - full);
  }

  function getWaterColor(reliability) {
    if (reliability === "Reliable") return "text-green-400";
    if (reliability === "Occasional Shortage") return "text-yellow-400";
    return "text-red-400";
  }

  function getFloodColor(risk) {
    if (risk === "Low") return "text-green-400";
    if (risk === "Medium") return "text-yellow-400";
    return "text-red-400";
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">

      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between">
          <h1
            onClick={() => router.push("/")}
            className="text-2xl font-bold text-blue-400 cursor-pointer"
          >
            NyumbaHunter
          </h1>
          <button
            onClick={() => router.push("/")}
            className="text-gray-400 hover:text-white"
          >
            Back to listings
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="bg-gray-900 border border-gray-800 rounded-2xl h-48 flex items-center justify-center text-gray-500 mb-10 text-lg">
          Photos coming soon
        </div>

        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold">{listing.title}</h2>
            <p className="text-gray-400 text-sm mt-1">
              {listing.location}
            </p>
          </div>

          <div className="bg-blue-900/30 border border-blue-700 rounded-xl px-6 py-4 text-center">
            <p className="text-blue-400 text-2xl font-bold">
              Ksh {listing.price.toLocaleString()}
            </p>
            <p className="text-gray-400 text-xs">per month</p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mb-10">
          <span className="bg-gray-800 px-3 py-1 rounded-full text-sm">
            {listing.bedrooms === 0 ? "Bedsitter" : `${listing.bedrooms} Bedroom`}
          </span>
          <span className="bg-gray-800 px-3 py-1 rounded-full text-sm">
            {listing.furnished ? "Furnished" : "Unfurnished"}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm ${
            listing.water_reliability === "Reliable"
              ? "bg-green-900 text-green-400"
              : "bg-yellow-900 text-yellow-400"
          }`}>
            Water: {listing.water_reliability}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-10">

          <div>
            <h3 className="text-xl font-bold mb-4">About this property</h3>
            <p className="text-gray-300 text-sm mb-8">{listing.description}</p>

            <h3 className="text-xl font-bold mb-4">Contact Landlord</h3>
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
              <p className="font-semibold text-lg">{listing.landlord_name}</p>
              <p className="text-gray-400 text-sm mb-6">{listing.landlord_phone}</p>
              <div className="flex gap-4">
                <button
                  onClick={() =>
                    window.open(
                      `https://wa.me/254${listing.landlord_phone?.substring(1)}`,
                      "_blank"
                    )
                  }
                  className="flex-1 bg-green-600 hover:bg-green-700 py-3 rounded-xl font-semibold"
                >
                  WhatsApp
                </button>
                <button
                  onClick={() => window.open(`tel:${listing.landlord_phone}`)}
                  className="flex-1 bg-gray-800 border border-gray-600 py-3 rounded-xl"
                >
                  Call
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Area Intelligence</h3>

            <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden mb-6">

              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
                <span className="text-gray-400 text-sm">Water Supply</span>
                <span className={`font-semibold text-sm ${getWaterColor(listing.water_reliability)}`}>
                  {listing.water_reliability}
                </span>
              </div>

              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
                <span className="text-gray-400 text-sm">Flooding Risk</span>
                <span className={`font-semibold text-sm ${getFloodColor(listing.flooding_risk)}`}>
                  {listing.flooding_risk}
                </span>
              </div>

              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
                <span className="text-gray-400 text-sm">Security Rating</span>
                <span className="font-semibold text-sm text-yellow-400">
                  {getSecurityStars(listing.security_rating)} ({listing.security_rating}/10)
                </span>
              </div>

              <div className="flex justify-between items-center px-6 py-4">
                <span className="text-gray-400 text-sm">Road Quality</span>
                <span className="font-semibold text-sm">
                  {listing.road_quality}
                </span>
              </div>

            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
              <p className="text-gray-400 text-sm">Estimated Monthly Cost</p>
              <p className="text-3xl font-bold mt-1">
                Ksh {(listing.price + 2000).toLocaleString()}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Rent + estimated utilities (water, electricity)
              </p>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}