"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

export default function ListingDetail({ params }) {
  const router = useRouter();

  // ✅ Next.js 16 param fix
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

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Loading listing...
      </main>
    );
  }

  // ---------------- NOT FOUND ----------------
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

  // ---------------- UI ----------------
  return (
    <main className="min-h-screen bg-gray-950 text-white">

      {/* NAVBAR */}
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

        {/* PHOTO */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl h-40 flex items-center justify-center text-gray-500 mb-10">
          🏠 Photos coming soon
        </div>

        {/* TITLE + PRICE */}
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold">{listing.title}</h2>
            <p className="text-gray-400 text-sm mt-1">
              📍 {listing.sub_area}, {listing.area}
            </p>
          </div>

          <div className="bg-blue-900/30 border border-blue-700 rounded-xl px-6 py-4 text-center">
            <p className="text-blue-400 text-2xl font-bold">
              Ksh {listing.price.toLocaleString()}
            </p>
            <p className="text-gray-400 text-xs">per month</p>
          </div>
        </div>

        {/* TAGS */}
        <div className="flex gap-2 flex-wrap mb-10">
          <span className="bg-gray-800 px-3 py-1 rounded-full text-sm">
            {listing.bedrooms === 0
              ? "Bedsitter"
              : `${listing.bedrooms} Bedroom`}
          </span>

          <span className="bg-gray-800 px-3 py-1 rounded-full text-sm">
            {listing.furnished ? "Furnished" : "Unfurnished"}
          </span>

          <span
            className={`px-3 py-1 rounded-full text-sm ${
              listing.water_reliability === "Reliable"
                ? "bg-green-900 text-green-400"
                : "bg-yellow-900 text-yellow-400"
            }`}
          >
            Water ~
          </span>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-10">

          {/* LEFT SIDE */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              About this property
            </h3>

            <p className="text-gray-300 text-sm mb-8">
              {listing.description}
            </p>

            {/* CONTACT CARD */}
            <h3 className="text-xl font-bold mb-4">
              Contact Landlord
            </h3>

            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
              <p className="font-semibold">
                {listing.landlord_name}
              </p>
              <p className="text-gray-400 text-sm mb-6">
                {listing.phone}
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() =>
                    window.open(
                      `https://wa.me/254${listing.phone.substring(1)}`,
                      "_blank"
                    )
                  }
                  className="flex-1 bg-green-600 hover:bg-green-700 py-3 rounded-xl font-semibold"
                >
                  WhatsApp Landlord
                </button>

                <button
                  onClick={() =>
                    window.open(`tel:${listing.phone}`)
                  }
                  className="flex-1 bg-gray-800 border border-gray-600 py-3 rounded-xl"
                >
                  Call Landlord
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              Area Intelligence
            </h3>

            <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">

              {[
                ["Water Supply", listing.water_reliability],
                ["Flooding Risk", listing.flooding_risk],
                ["Security", listing.security],
                ["Road Quality", listing.road_quality],
                ["Matatu Routes", listing.matatu_routes],
              ].map(([label, value], i) => (
                <div
                  key={label}
                  className={`flex justify-between px-6 py-4 ${
                    i !== 4 ? "border-b border-gray-800" : ""
                  }`}
                >
                  <span className="text-gray-400 text-sm">
                    {label}
                  </span>
                  <span className="font-semibold text-sm">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* ESTIMATE BOX */}
            <div className="mt-6 bg-gray-900 border border-gray-700 rounded-2xl p-6">
              <p className="text-gray-400 text-sm">
                Estimated Monthly Cost
              </p>

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