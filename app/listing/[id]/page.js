"use client";

import { useEffect, useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

export default function ListingDetail({ params }) {
  const router = useRouter();
  const { id } = use(params);

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

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

  useEffect(() => {
    if (!listing || !listing.lat || !listing.lng) return;
    if (mapInstanceRef.current) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      const L = window.L;
      if (!mapRef.current || mapInstanceRef.current) return;

      const map = L.map(mapRef.current).setView([listing.lat, listing.lng], 15);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© CartoDB',
        maxZoom: 19
      }).addTo(map);

      const terracottaPin = L.divIcon({
        className: '',
        html: `<div style="
          width: 32px; height: 32px;
          background: #D97A6B;
          border-radius: 50% 50% 50% 4px;
          transform: rotate(45deg);
          box-shadow: 0 4px 14px rgba(217,122,107,0.45);
          display: flex; align-items: center; justify-content: center;
        ">
          <div style="
            width: 10px; height: 10px;
            background: white; border-radius: 50%;
            transform: rotate(-45deg);
          "></div>
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      L.marker([listing.lat, listing.lng], { icon: terracottaPin })
        .addTo(map)
        .bindPopup(`<b>${listing.title}</b><br>Ksh ${listing.price?.toLocaleString()}/month`)
        .openPopup();
    };

    document.head.appendChild(script);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [listing]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-canvas)" }}>
        <p style={{ color: "var(--color-text-muted)" }}>Loading listing...</p>
      </main>
    );
  }

  if (!listing) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-canvas)" }}>
        <div className="text-center">
          <p className="text-6xl mb-4">🏚️</p>
          <p className="text-xl mb-6" style={{ color: "var(--color-text-muted)" }}>Listing not found</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 rounded-full text-white font-semibold"
            style={{ background: "var(--color-accent)" }}
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
    if (reliability === "Reliable") return "#2E7D32";
    if (reliability === "Occasional Shortage") return "#F57F17";
    return "#C62828";
  }

  function getFloodColor(risk) {
    if (risk === "Low") return "#2E7D32";
    if (risk === "Medium") return "#F57F17";
    return "#C62828";
  }

  const getListingImage = () => {
    const bedsitterImages = [
      'https://s3.us-east-2.amazonaws.com/images.propertypro.africa/large/kimbo-nibs-elegant-bedsitter-ksh6500month-axQdpbpJ7IZ9OoLAzbaL.jpg',
      'https://s3.us-east-2.amazonaws.com/images.propertypro.africa/large/smart-spacious-bedsitter-for-rent-in-ruaka-JhaX9891LrOYZ4rziEig.jpg',
      'https://pictures-kenya.jijistatic.com/73868785_MzAwLTQwMC1kNTk2NDJhOGRmLTE.webp',
      'https://pictures-kenya.jijistatic.com/79307005_OTAwLTE2MDAtYjkyODA0YjA5Zg.webp',
      'https://pictures-kenya.jijistatic.com/80407630_MTIwMC0xNjAwLTIxNTc1ZmFhNzQ.webp',
      'https://pictures-kenya.jijistatic.com/73868786_MzAwLTIyNS04NzBiNTJmOTU1LTE.webp',
      'https://pictures-kenya.jijistatic.com/73868787_MzAwLTIyNS05OWQzYmMyNzYwLTE.webp',
      'https://pictures-kenya.jijistatic.com/79306999_NjI0LTE2MDAtMDQxYTAzYWZhMQ.webp',
      'https://pictures-kenya.jijistatic.com/80407636_MTIwMC0xNjAwLThkMDMwODc4MWU.webp',
      'https://pictures-kenya.jijistatic.com/80407642_MTIwMC0xNjAwLTk4MDg1N2M1M2I.webp',
      'https://listings.reemioltd.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-16-at-12.55.14-1-584x438.jpeg',
      'https://s3.us-east-2.amazonaws.com/images.propertypro.africa/large/bedsitter-ruiru-zerech-ne3xYgmfRh0hnLLk9UN0.jpg',
    ];
    const oneBedImages = [
      'https://images.locanto.info/6619698798/one-bedroom-apartment-for-rent-in-Ruiru-kamakis_1.jpg',
      'https://images.kenyapropertycentre.com/properties/images/26464/0651e777260931-affordable-1-bedroom-apartments-mini-flats-for-rent-ruiru-kiambu.jpg',
      'https://pictures-kenya.jijistatic.com/68887788_MTYwMC0yMTM0LTUyMWVkM2RkNWE.webp',
      'https://pictures-kenya.jijistatic.com/82769810_MTA4MC0xMzUwLTM2OWJlZTkyMWY.webp',
      'https://pictures-kenya.jijistatic.com/83234142_MTYwMC05MDAtOWI3YzM1YTc1NQ.webp',
      'https://pictures-kenya.jijistatic.com/68887793_MTYwMC0yMTM0LWY5NzEyMTlkNWI.webp',
      'https://pictures-kenya.jijistatic.com/82769811_MTA4MC0xMzUwLTE3ZGYwMGU5YmQ.webp',
      'https://pictures-kenya.jijistatic.com/81668600_MTU5OS0xNjAwLTM0ZmM5MDFmZjY.webp',
      'https://pictures-kenya.jijistatic.com/83234149_MTYwMC05MDAtZWUxYzRkMmEyNg.webp',
      'https://pictures-kenya.jijistatic.com/83234151_MTYwMC05MDAtYjk0NWE3MDM1Mg.webp',
      'https://pictures-kenya.jijistatic.com/69553129_MTUwMC0yMDAwLTc1YzdiOWJhMTI.webp',
      'https://s3.us-east-2.amazonaws.com/images.propertypro.africa/large/bedsitter-kayole-YKY12WbkXYdqXVHxmmf5.jpg',
      'https://www.eazzyrent.com/propertyimages/00022181501.jpg',
    ];
    const twoBedImages = [
      'https://images.kenyapropertycentre.com/properties/images/thumbs/47368/067fcd0133b9fd-modern-2-bedrooms-apartments-in-safari-park-for-rent-roysambu-nairobi.jpg',
      'https://images.privatepropertykenya.com/large/2-bedroom-for-rent-in-thika-road-oUAOHrr1A9et7dQpjZdu.jpg',
      'https://pictures-kenya.jijistatic.com/72147693_MTIwMC0xNjAwLTY0YzE2YjZkMzUtMQ.webp',
      'https://pictures-kenya.jijistatic.com/79818172_MTUwMC0yMDAwLTQyZDBhOWJlYjc.webp',
      'https://pictures-kenya.jijistatic.com/75462089_NzIwLTE2MDAtZmE0OWRlM2FiNw.webp',
      'https://images.privatepropertykenya.com/large/2-bedroom-apartment-in-thika-road-4ngaEBu9BvGR63F5XutG.jpeg',
      'https://images.privatepropertykenya.com/large/affordable-2-bedroom-ensuite-apartments-for-rent-at-kes-24500month-uN7hcSG0bU0w9tLB8DpW.jpeg',
      'https://s3.us-east-2.amazonaws.com/images.propertypro.africa/large/a-own-compound-2-bedrooms-to-let-at-ruiru-kimbo-W8BtV0Kk8jDTblXiouEM.jpg',
      'https://pictures-kenya.jijistatic.com/72147696_MTIwMC0xNjAwLTJiMmI2YWQ4NzAtMQ.webp',
      'https://pictures-kenya.jijistatic.com/72147697_MTIwMC0xNjAwLTdmNzZiZmQ0M2UtMQ.webp',
      'https://pictures-kenya.jijistatic.com/79818166_MTUwMC0yMDAwLWU1ZTQ0Y2ZmMmU.webp',
      'https://pictures-kenya.jijistatic.com/67259376_MTI4MC05NjAtMmZlYTY0M2U2MQ.webp',
      'https://pictures-kenya.jijistatic.com/67259393_MTYwMC0xMjAwLWE0YmE2YTBkZjk.webp',
      'https://pictures-kenya.jijistatic.com/81068200_MTYwMC0xNjAwLTAyM2U4NTg0Nzg.webp',
    ];

    const num = listing.id ? parseInt(listing.id.replace(/-/g, '').substring(0, 8), 16) : 0;
    const titleLower = listing.title?.toLowerCase() || '';
    if (titleLower.includes('bedsitter')) return bedsitterImages[num % bedsitterImages.length];
    if (titleLower.includes('2 bedroom')) return twoBedImages[num % twoBedImages.length];
    return oneBedImages[num % oneBedImages.length];
  };

  return (
    <main className="min-h-screen" style={{ background: "var(--color-canvas)", color: "var(--color-text)" }}>

      <nav className="px-4 py-4" style={{ background: "var(--color-brand)", borderBottom: "1px solid #3d4e41" }}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1
            onClick={() => router.push("/")}
            className="logo text-xl font-bold cursor-pointer"
            style={{ color: "var(--color-canvas)" }}
          >
            NyumbaHunter
          </h1>
          <button
            onClick={() => router.push("/")}
            className="text-sm"
            style={{ color: "var(--color-brand-lt)" }}
          >
            ← Back to listings
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* HERO IMAGE */}
        <div className="rounded-2xl overflow-hidden mb-8" style={{ height: '350px' }}>
          <img
            src={getListingImage()}
            alt={listing.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.outerHTML = '<div style="height:350px;display:flex;align-items:center;justify-content:center;background:#E8EDE9;color:#718096;font-size:14px;">🏠 Photos coming soon</div>';
            }}
          />
        </div>

        {/* TITLE + PRICE */}
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-1" style={{ color: "var(--color-text)" }}>{listing.title}</h2>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>📍 {listing.location}</p>
          </div>

          <div className="rounded-2xl px-6 py-4 text-center" style={{ background: "var(--color-accent-lt)", border: "1px solid var(--color-accent)" }}>
            <p className="price text-2xl font-bold" style={{ color: "var(--color-accent)" }}>
              Ksh {listing.price?.toLocaleString()}
            </p>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>per month</p>
          </div>
        </div>

        {/* BADGES */}
        <div className="flex gap-2 flex-wrap mb-10">
          <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: "var(--color-brand-lt)", color: "var(--color-brand)" }}>
            {listing.bedrooms === 0 ? "Bedsitter" : `${listing.bedrooms} Bedroom`}
          </span>
          <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: "var(--color-brand-lt)", color: "var(--color-brand)" }}>
            {listing.furnished ? "Furnished" : "Unfurnished"}
          </span>
          <span className="text-xs px-3 py-1 rounded-full font-medium" style={{
            background: listing.water_reliability === "Reliable" ? "#E6F4EA" : "#FFF8E1",
            color: listing.water_reliability === "Reliable" ? "#2E7D32" : "#F57F17"
          }}>
            💧 Water: {listing.water_reliability}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-10">

          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: "var(--color-text)" }}>About this property</h3>
            <p className="text-sm mb-8" style={{ color: "var(--color-text-muted)", lineHeight: "1.7" }}>{listing.description}</p>

            <h3 className="text-xl font-bold mb-4" style={{ color: "var(--color-text)" }}>Contact Landlord</h3>
            <div className="rounded-2xl p-6" style={{ background: "white", boxShadow: "var(--shadow-card)" }}>
              <p className="font-semibold text-lg mb-1" style={{ color: "var(--color-text)" }}>{listing.landlord_name}</p>
              <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>{listing.landlord_phone}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => window.open(`https://wa.me/254${listing.landlord_phone?.substring(1)}`, "_blank")}
                  className="flex-1 py-3 rounded-full font-semibold text-white text-sm transition hover:opacity-90"
                  style={{ background: "#25D366" }}
                >
                  WhatsApp
                </button>
                <button
                  onClick={() => window.open(`tel:${listing.landlord_phone}`)}
                  className="flex-1 py-3 rounded-full text-sm font-semibold transition hover:opacity-90"
                  style={{ background: "var(--color-brand-lt)", color: "var(--color-brand)" }}
                >
                  Call
                </button>
              </div>
            </div>

            {listing.lat && listing.lng && (
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4" style={{ color: "var(--color-text)" }}>📍 Location & Directions</h3>
                <div
                  ref={mapRef}
                  style={{ height: '300px', width: '100%', borderRadius: '16px', zIndex: 1 }}
                  className="mb-4"
                />
                <button
                  onClick={() => window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${listing.lat},${listing.lng}`,
                    "_blank"
                  )}
                  className="w-full py-3 rounded-full font-semibold text-white text-sm transition hover:opacity-90"
                  style={{ background: "var(--color-accent)" }}
                >
                  🗺️ Get Directions on Google Maps
                </button>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: "var(--color-text)" }}>Area Intelligence</h3>

            <div className="rounded-2xl overflow-hidden mb-6" style={{ background: "white", boxShadow: "var(--shadow-card)" }}>
              <div className="flex justify-between items-center px-6 py-4" style={{ borderBottom: "1px solid var(--color-brand-lt)" }}>
                <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>Water Supply</span>
                <span className="font-semibold text-sm" style={{ color: getWaterColor(listing.water_reliability) }}>
                  {listing.water_reliability}
                </span>
              </div>
              <div className="flex justify-between items-center px-6 py-4" style={{ borderBottom: "1px solid var(--color-brand-lt)" }}>
                <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>Flooding Risk</span>
                <span className="font-semibold text-sm" style={{ color: getFloodColor(listing.flooding_risk) }}>
                  {listing.flooding_risk}
                </span>
              </div>
              <div className="flex justify-between items-center px-6 py-4" style={{ borderBottom: "1px solid var(--color-brand-lt)" }}>
                <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>Security Rating</span>
                <span className="font-semibold text-sm" style={{ color: "#F57F17" }}>
                  {getSecurityStars(listing.security_rating)} ({listing.security_rating}/10)
                </span>
              </div>
              <div className="flex justify-between items-center px-6 py-4">
                <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>Road Quality</span>
                <span className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>
                  {listing.road_quality}
                </span>
              </div>
            </div>

            <div className="rounded-2xl p-6" style={{ background: "white", boxShadow: "var(--shadow-card)" }}>
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Estimated Monthly Cost</p>
              <p className="price text-3xl font-bold mt-1" style={{ color: "var(--color-text)" }}>
                Ksh {(listing.price + 2000).toLocaleString()}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--color-text-faint)" }}>
                Rent + estimated utilities (water, electricity)
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}