'use client';
import { useEffect, useRef } from 'react';

export default function Map({ listings, onListingClick }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!mapRef.current) return;
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

      const map = L.map(mapRef.current).setView([-1.18, 36.87], 11);
      mapInstanceRef.current = map;

      // CartoDB Positron — greyscale tiles
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        { attribution: '© CartoDB', maxZoom: 19 }
      ).addTo(map);

      addMarkers(L, map, listings);
    };

    document.head.appendChild(script);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;
    const L = window.L;
    const map = mapInstanceRef.current;
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    addMarkers(L, map, listings);
  }, [listings]);

  function addMarkers(L, map, listings) {
    // Custom terracotta pin
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

    listings.forEach((listing) => {
      if (!listing.lat || !listing.lng) return;

      const marker = L.marker([listing.lat, listing.lng], { icon: terracottaPin }).addTo(map);
      markersRef.current.push(marker);

      marker.on('click', function () {
        onListingClick(listing);
      });

      marker.bindTooltip(`
        <strong style="color:#D97A6B">Ksh ${listing.price?.toLocaleString()}</strong><br>
        ${listing.title}
      `, { permanent: false });
    });
  }

  return (
    <div
      ref={mapRef}
      style={{ height: '500px', width: '100%', borderRadius: '16px', zIndex: 1 }}
    />
  );
}