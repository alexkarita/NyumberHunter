"use client";
import { useRouter } from "next/navigation";
import { use } from "react";

const ALL_LISTINGS = [
  {
    id: 1,
    title: "1 Bed — Ruaka",
    area: "Ruaka",
    subArea: "Near Junction Mall",
    price: 12000,
    bedrooms: 1,
    furnished: false,
    description: "Near Junction Mall. Water reliable. Tarmac road to the gate. Secure compound with a guard. Walking distance to Naivas and matatu stage.",
    landlord: "John Kamau",
    phone: "0712345678",
    water: "Reliable",
    flooding: "Low Risk",
    security: "Good",
    roads: "Tarmac",
    matatu: "237, 105",
    tags: ["1 Bed", "Unfurnished", "Water ✓"],
    waterColor: "green",
  },
  {
    id: 2,
    title: "Bedsitter — Ruiru",
    area: "Ruiru",
    subArea: "Ruiru Town Centre",
    price: 7500,
    bedrooms: 0,
    furnished: true,
    description: "Ruiru town centre. Close to stage. Secure compound. Includes bed, sofa and basic furniture. Easy access to Thika Road.",
    landlord: "Grace Njeri",
    phone: "0745678901",
    water: "Occasional Shortage",
    flooding: "Low Risk",
    security: "Good",
    roads: "Tarmac",
    matatu: "45, 100",
    tags: ["Bedsitter", "Furnished", "Water ~"],
    waterColor: "yellow",
  },
  {
    id: 3,
    title: "1 Bed — Thika Road",
    area: "Thika Road",
    subArea: "Kasarani",
    price: 14000,
    bedrooms: 1,
    furnished: false,
    description: "Kasarani area. Quiet estate. Good security with CCTV. Near Kasarani stadium and market. Good water supply.",
    landlord: "David Kariuki",
    phone: "0778901234",
    water: "Reliable",
    flooding: "Low Risk",
    security: "Very Good",
    roads: "Tarmac",
    matatu: "44, 60",
    tags: ["1 Bed", "Unfurnished", "Water ✓"],
    waterColor: "green",
  },
  {
    id: 4,
    title: "Bedsitter — Ruaka",
    area: "Ruaka",
    subArea: "Ruaka near Quickmart",
    price: 9000,
    bedrooms: 0,
    furnished: false,
    description: "Ruaka near Quickmart. Safe neighbourhood. Close to shops and stage. Water tank on site.",
    landlord: "Mary Wanjiku",
    phone: "0723456789",
    water: "Reliable",
    flooding: "Low Risk",
    security: "Good",
    roads: "Tarmac",
    matatu: "237",
    tags: ["Bedsitter", "Unfurnished", "Water ✓"],
    waterColor: "green",
  },
];

export default function ListingDetail({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const listing = ALL_LISTINGS.find((l) => l.id === Number(id));

  if (!listing) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🏚️</p>
          <p className="text-xl text-gray-400 mb-6">Listing not found</p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-white font-semibold transition"
          >
            Back to listings
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">

      {/* NAVBAR */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1
            onClick={() => router.push("/")}
            className="text-2xl font-bold text-blue-400 cursor-pointer hover:text-blue-300 transition"
          >
            NyumbaHunter
          </h1>
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition"
          >
            Back to listings
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* PHOTO */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl h-64 flex flex-col items-center justify-center text-gray-400 mb-8 border border-gray-700">
          <p className="text-5xl mb-3">🏠</p>
          <p className="text-sm">Photos coming soon</p>
        </div>

        {/* TITLE + PRICE */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">{listing.title}</h2>
            <p className="text-gray-400 text-sm">
              📍 {listing.subArea}, {listing.area}
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl px-6 py-4 text-center min-w-fit">
            <p className="text-3xl font-bold text-blue-400">
              Ksh {listing.price.toLocaleString()}
            </p>
            <p className="text-gray-400 text-xs mt-1">per month</p>
          </div>
        </div>

        {/* TAGS */}
        <div className="flex gap-2 flex-wrap mb-10">
          {listing.tags.map((tag) => (
            <span
              key={tag}
              className={`text-sm px-4 py-1.5 rounded-full font-medium ${
                tag.includes("Water")
                  ? listing.waterColor === "green"
                    ? "bg-green-900 text-green-400 border border-green-700"
                    : "bg-yellow-900 text-yellow-400 border border-yellow-700"
                  : "bg-gray-800 text-gray-300 border border-gray-700"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* DIVIDER */}
        <div className="border-t border-gray-800 mb-10" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* LEFT */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">About this property</h3>
            <p className="text-gray-300 leading-relaxed mb-10 text-sm">
              {listing.description}
            </p>

            <h3 className="text-xl font-bold mb-4 text-white">Contact Landlord</h3>
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
              <div className="mb-2">
                  <p className="text-white font-semibold">{listing.landlord}</p>
                  <p className="text-gray-400 text-sm">{listing.phone}</p>
              </div>
              <div className="border-t border-gray-800 mt-4 pt-4 flex flex-col gap-3">
                <button
                  onClick={() => window.open(`https://wa.me/254${listing.phone.substring(1)}`, "_blank")}
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-center font-semibold py-3 rounded-xl transition"
                >
                  WhatsApp Landlord
                </button>
                <button
                  onClick={() => window.open(`tel:${listing.phone}`)}
                  className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300 hover:text-white text-center font-semibold py-3 rounded-xl transition"
                >
                  Call Landlord
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Area Intelligence</h3>
            <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
              {[
                { label: "Water Supply", value: listing.water, color: listing.water === "Reliable" ? "text-green-400" : "text-yellow-400" },
                { label: "Flooding Risk", value: listing.flooding, color: "text-green-400" },
                { label: "Security", value: listing.security, color: "text-blue-400" },
                { label: "Road Quality", value: listing.roads, color: "text-gray-300" },
                { label: "Matatu Routes", value: listing.matatu, color: "text-gray-300" },
              ].map((item, i) => (
                <div
                  key={item.label}
                  className={`flex justify-between items-center px-6 py-4 ${
                    i !== 4 ? "border-b border-gray-800" : ""
                  }`}
                >
                  <span className="text-gray-400 text-sm">{item.label}</span>
                  <span className={`font-semibold text-sm ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>

            {/* EXTRA INFO BOX */}
            <div className="mt-4 bg-blue-950 border border-blue-800 rounded-2xl p-5">
              <p className="text-blue-300 text-sm font-semibold mb-1">Estimated Monthly Cost</p>
              <p className="text-white text-2xl font-bold">
                Ksh {(listing.price + 2000).toLocaleString()}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Rent + estimated utilities (water, electricity)
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}