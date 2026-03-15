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
      if (!session) { router.push("/login"); return; }

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
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  }

  async function handleSave() {
    setSaving(true);
    setSuccess(false);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push("/login"); return; }

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
      console.error("Error saving:", error);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading your preferences...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">

      {/* NAV */}
      <nav className="bg-gray-900/80 backdrop-blur border-b border-gray-800 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1
            onClick={() => router.push("/")}
            className="text-xl font-bold text-blue-400 cursor-pointer tracking-tight"
          >
            NyumbaHunter
          </h1>
          <button
            onClick={() => router.push("/")}
            className="text-gray-400 hover:text-white text-sm flex items-center gap-2 transition"
          >
            ← Back to listings
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-2 tracking-tight">My Preferences</h2>
          <p className="text-gray-400">Customize your house hunting experience</p>
        </div>

        {/* SUCCESS BANNER */}
        {success && (
          <div className="bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded-xl mb-8 text-sm flex items-center gap-2">
            <span>✅</span> Preferences saved successfully!
          </div>
        )}

        {/* MAIN GRID — 2 columns on desktop, 1 on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* WHATSAPP */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 bg-green-900/50 rounded-lg flex items-center justify-center text-base">📱</div>
              <h3 className="text-base font-semibold">WhatsApp Number</h3>
            </div>
            <p className="text-gray-500 text-sm mb-4 ml-11">Landlords will contact you on this number</p>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="e.g. 0712345678"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition text-sm"
            />
          </div>

          {/* WATER TOGGLE */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 bg-blue-900/50 rounded-lg flex items-center justify-center text-base">💧</div>
              <h3 className="text-base font-semibold">Reliable Water</h3>
            </div>
            <p className="text-gray-500 text-sm mb-5 ml-11">Only show listings with reliable water supply</p>
            <div
              onClick={() => setMustHaveWater(!mustHaveWater)}
              className="flex items-center gap-4 cursor-pointer group"
            >
              <div className={`w-14 h-7 rounded-full transition-colors relative flex-shrink-0 ${mustHaveWater ? "bg-blue-600" : "bg-gray-700"}`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-1 shadow transition-all duration-200 ${mustHaveWater ? "left-8" : "left-1"}`} />
              </div>
              <span className={`text-sm font-medium transition-colors ${mustHaveWater ? "text-blue-400" : "text-gray-400"}`}>
                {mustHaveWater ? "Yes — reliable water only" : "No — show all listings"}
              </span>
            </div>
          </div>

          {/* PREFERRED AREAS */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 bg-purple-900/50 rounded-lg flex items-center justify-center text-base">📍</div>
              <h3 className="text-base font-semibold">Preferred Areas</h3>
            </div>
            <p className="text-gray-500 text-sm mb-4 ml-11">Select all areas you are interested in</p>
            <div className="space-y-2">
              {areas.map((area) => {
                const isSelected = preferredAreas.includes(area);
                const label = area === "thika-road" ? "Thika Road" : area.charAt(0).toUpperCase() + area.slice(1);
                return (
                  <button
                    key={area}
                    onClick={() => toggleArea(area)}
                    className={`w-full px-4 py-3 rounded-xl border font-medium transition text-left text-sm flex items-center gap-3 ${
                      isSelected
                        ? "bg-blue-600/20 border-blue-500 text-blue-300"
                        : "bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600"
                    }`}
                  >
                    <span className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 text-xs transition-colors ${
                      isSelected ? "bg-blue-500 border-blue-500 text-white" : "border-gray-600"
                    }`}>
                      {isSelected ? "✓" : ""}
                    </span>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* MAX BUDGET */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 bg-yellow-900/50 rounded-lg flex items-center justify-center text-base">💰</div>
              <h3 className="text-base font-semibold">Max Budget</h3>
            </div>
            <p className="text-gray-500 text-sm mb-5 ml-11">Maximum rent you can afford per month</p>

            <div className="bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-4 text-center mb-5">
              <p className="text-blue-400 text-3xl font-bold tracking-tight">Ksh {maxBudget.toLocaleString()}</p>
              <p className="text-gray-500 text-xs mt-1">per month</p>
            </div>

            <input
              type="range"
              min={5000}
              max={20000}
              step={500}
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-gray-600 text-xs mt-2">
              <span>Ksh 5,000</span>
              <span>Ksh 20,000</span>
            </div>
          </div>

          {/* MIN BEDROOMS — full width */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:col-span-2">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 bg-orange-900/50 rounded-lg flex items-center justify-center text-base">🛏️</div>
              <h3 className="text-base font-semibold">Minimum Bedrooms</h3>
            </div>
            <p className="text-gray-500 text-sm mb-5 ml-11">Minimum number of bedrooms you need</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Bedsitter", value: 0, icon: "🪑" },
                { label: "1 Bedroom", value: 1, icon: "🛏️" },
                { label: "2 Bedrooms", value: 2, icon: "🏠" },
              ].map((option) => {
                const isSelected = minBedrooms === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => setMinBedrooms(option.value)}
                    className={`py-4 px-4 rounded-xl border font-medium transition text-center text-sm flex flex-col items-center gap-2 ${
                      isSelected
                        ? "bg-blue-600/20 border-blue-500 text-blue-300"
                        : "bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600"
                    }`}
                  >
                    <span className="text-xl">{option.icon}</span>
                    <span>{option.label}</span>
                    {isSelected && <span className="text-blue-400 text-xs font-bold">Selected ✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* SAVE BUTTON */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 disabled:text-blue-700 text-white font-semibold py-3.5 px-10 rounded-xl transition text-sm flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              "Save Preferences"
            )}
          </button>
        </div>

      </div>
    </main>
  );
}