"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Preferences() {
  const [whatsapp, setWhatsapp] = useState("");
  const [maxBudget, setMaxBudget] = useState(15000);
  const [minBedrooms, setMinBedrooms] = useState(0);
  const [mustHaveWater, setMustHaveWater] = useState(false);
  const [preferredAreas, setPreferredAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const areas = ["ruaka", "ruiru", "thika-road"];

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("preferences")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (data) {
        setWhatsapp(data.whatsapp_number || "");
        setMaxBudget(data.max_budget || 15000);
        setMinBedrooms(data.min_bedrooms || 0);
        setMustHaveWater(data.must_have_water || false);
        setPreferredAreas(data.preferred_areas || []);
      }

      setLoading(false);
    }

    init();
  }, []);

  function toggleArea(area) {
    setPreferredAreas((prev) =>
      prev.includes(area)
        ? prev.filter((a) => a !== area)
        : [...prev, area]
    );
  }

  async function handleSave() {
    setSaving(true);
    setSuccess(false);

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
      return;
    }

    const { data: existing } = await supabase
      .from("preferences")
      .select("id")
      .eq("user_id", session.user.id)
      .single();

    let error;

    if (existing) {
      const { error: updateError } = await supabase
        .from("preferences")
        .update({
          whatsapp_number: whatsapp,
          max_budget: maxBudget,
          min_bedrooms: minBedrooms,
          must_have_water: mustHaveWater,
          preferred_areas: preferredAreas,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", session.user.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("preferences")
        .insert({
          user_id: session.user.id,
          whatsapp_number: whatsapp,
          max_budget: maxBudget,
          min_bedrooms: minBedrooms,
          must_have_water: mustHaveWater,
          preferred_areas: preferredAreas,
        });
      error = insertError;
    }

    if (error) {
      console.error("Error saving preferences:", error);
      alert("Error: " + JSON.stringify(error));
    } else {
      setSuccess(true);
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </main>
    );
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
          <button
            onClick={() => router.push("/")}
            className="text-gray-400 hover:text-white text-sm"
          >
            Back to listings
          </button>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-2">My Preferences</h2>
        <p className="text-gray-400 mb-8">Tell us what you are looking for</p>

        {success && (
          <div className="bg-green-900 border border-green-700 text-green-300 px-4 py-3 rounded-xl mb-6 text-sm">
            Preferences saved successfully!
          </div>
        )}

        <div className="space-y-6">

          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4">Your WhatsApp Number</h3>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="e.g. 0712345678"
              className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <p className="text-gray-500 text-xs mt-2">
              Landlords will contact you on this number
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4">Preferred Areas</h3>
            <div className="flex gap-3 flex-wrap">
              {areas.map((area) => (
                <button
                  key={area}
                  onClick={() => toggleArea(area)}
                  className={`px-4 py-2 rounded-xl border font-medium capitalize transition ${
                    preferredAreas.includes(area)
                      ? "bg-blue-600 border-blue-500 text-white"
                      : "bg-gray-800 border-gray-600 text-gray-300 hover:border-blue-500"
                  }`}
                >
                  {area === "thika-road" ? "Thika Road" : area.charAt(0).toUpperCase() + area.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4">
              Max Budget
              <span className="text-blue-400 ml-2">
                Ksh {maxBudget.toLocaleString()}
              </span>
            </h3>
            <input
              type="range"
              min={5000}
              max={20000}
              step={500}
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-gray-500 text-xs mt-2">
              <span>Ksh 5,000</span>
              <span>Ksh 20,000</span>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4">Minimum Bedrooms</h3>
            <div className="flex gap-3">
              {[
                { label: "Bedsitter", value: 0 },
                { label: "1 Bed", value: 1 },
                { label: "2 Bed", value: 2 },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setMinBedrooms(option.value)}
                  className={`flex-1 py-3 rounded-xl border font-medium transition ${
                    minBedrooms === option.value
                      ? "bg-blue-600 border-blue-500 text-white"
                      : "bg-gray-800 border-gray-600 text-gray-300 hover:border-blue-500"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">Must Have Reliable Water</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Only show listings with reliable water supply
                </p>
              </div>
              <button
                onClick={() => setMustHaveWater(!mustHaveWater)}
                className={`w-14 h-7 rounded-full transition relative ${
                  mustHaveWater ? "bg-blue-600" : "bg-gray-600"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${
                    mustHaveWater ? "left-8" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 text-white font-bold py-4 rounded-xl transition text-lg"
          >
            {saving ? "Saving..." : "Save Preferences"}
          </button>

        </div>
      </div>
    </main>
  );
}