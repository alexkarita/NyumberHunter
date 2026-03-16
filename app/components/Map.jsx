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

      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current).setView([-1.18, 36.87], 11);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Add markers after map is ready
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

  // Update markers when listings change
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;
    const L = window.L;
    const map = mapInstanceRef.current;

    // Remove old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Add new markers
    addMarkers(L, map, listings);
  }, [listings]);

  function addMarkers(L, map, listings) {
    console.log('Adding markers for', listings.length, 'listings');
    listings.forEach((listing) => {
      console.log('Listing:', listing.title, listing.lat, listing.lng);
      if (!listing.lat || !listing.lng) return;

      const marker = L.marker([listing.lat, listing.lng]).addTo(map);
      markersRef.current.push(marker);

      marker.on('click', function () {
        onListingClick(listing);
      });

      marker.bindTooltip(listing.title, { permanent: false });
    });
  }

  return (
    <div
      ref={mapRef}
      style={{ height: '500px', width: '100%', borderRadius: '16px', zIndex: 1 }}
    />
  );
}