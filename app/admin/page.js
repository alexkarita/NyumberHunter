"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Admin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    bedrooms: "0",
    bathrooms: "1",
    furnished: false,
    description: "",
    water_reliability: "Reliable",
    flooding_risk: "Low",
    security_rating: "5",
    road_quality: "Tarmac",
    area: "ruiru",
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit() {
    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabase
        .from("listings")
        .insert({
          title: form.title,
          location: form.location,
          price: Number(form.price),
          bedrooms: Number(form.bedrooms),
          bathrooms: Number(form.bathrooms),
          furnished: form.furnished,
          description: form.description,
          landlord_name: "Contact via App",
          landlord_phone: "0000000000",
          water_reliability: form.water_reliability,
          flooding_risk: form.flooding_risk,
          security_rating: Number(form.security_rating),
          road_quality: form.road_quality,
          area: form.area,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);

      setMessage("✅ Listing added! Sending WhatsApp alerts...");

      const notifyRes = await fetch("/api/notify-matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing: data }),
      });

      const notifyData = await notifyRes.json();

      if (notifyData.success) {
        setMessage(`✅ Listing added! WhatsApp alerts sent to ${notifyData.matched} matching users!`);
      } else {
        setMessage("✅ Listing added but alerts failed: " + notifyData.error);
      }

      setForm({
        title: "",
        location: "",
        price: "",
        bedrooms: "0",
        bathrooms: "1",
        furnished: false,
        description: "",
        water_reliability: "Reliable",
        flooding_risk: "Low",
        security_rating: "5",
        road_quality: "Tarmac",
        area: "ruiru",
      });

    } catch (error) {
      setMessage("❌ Error: " + error.message);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1
            onClick={() => router.push("/")}
            className="text-2xl font-bold text-blue-400 cursor-pointer"
          >
            NyumbaHunter
          </h1>
          <span className="text-gray-400 text-sm">Admin Panel</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-2">Add New Listing</h2>
        <p className="text-gray-400 text-sm mb-8">
          Adding a listing will automatically send WhatsApp alerts to matching users.
        </p>

        {message && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-semibold ${
            message.startsWith("✅")
              ? "bg-green-900/30 border border-green-700 text-green-400"
              : "bg-red-900/30 border border-red-700 text-red-400"
          }`}>
            {message}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-300">Property Details</h3>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Bedsitter — Ruiru"
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Kimbo, Ruiru"
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Area</label>
              <select
                name="area"
                value={form.area}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white"
              >
                <option value="ruaka">Ruaka</option>
                <option value="ruiru">Ruiru</option>
                <option value="thika-road">Thika Road</option>
              </select>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Price (Ksh/month)</label>
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. 6500"
                type="number"
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Bedrooms</label>
              <select
                name="bedrooms"
                value={form.bedrooms}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white"
              >
                <option value="0">Bedsitter</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="furnished"
                checked={form.furnished}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <label className="text-gray-300 text-sm">Furnished</label>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the property..."
                rows={4}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-300">Area Intelligence</h3>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Water Reliability</label>
              <select
                name="water_reliability"
                value={form.water_reliability}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white"
              >
                <option value="Reliable">Reliable</option>
                <option value="Occasional Shortage">Occasional Shortage</option>
                <option value="Unreliable">Unreliable</option>
              </select>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Flooding Risk</label>
              <select
                name="flooding_risk"
                value={form.flooding_risk}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Security Rating (1-10)</label>
              <input
                name="security_rating"
                value={form.security_rating}
                onChange={handleChange}
                type="number"
                min="1"
                max="10"
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Road Quality</label>
              <select
                name="road_quality"
                value={form.road_quality}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white"
              >
                <option value="Tarmac">Tarmac</option>
                <option value="Murram">Murram</option>
                <option value="Rough">Rough</option>
              </select>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg mt-4 transition ${
                loading
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? "Adding listing & sending alerts..." : "Add Listing + Send WhatsApp Alerts"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}