"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icon issue
if (typeof window !== "undefined") {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

export default function ManualMap({ pins, newPin, user, onMapClick, form, handleChange, handleSubmit }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current) {
      const map = L.map(mapRef.current, {
        center: [20, 77],
        zoom: 5,
        scrollWheelZoom: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      // Add click handler
      map.on('click', (e) => {
        if (onMapClick) {
          onMapClick(e);
          setIsFormVisible(true);
        }
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when pins change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add pins
    pins.forEach((pin) => {
      const markerHtml = `
        <div class="flex items-center justify-center w-8 h-8 rounded-full ${
          pin.category === 'landmark' ? 'bg-blue-500' :
          pin.category === 'event' ? 'bg-green-500' :
          pin.category === 'story' ? 'bg-yellow-500' :
          pin.category === 'alert' ? 'bg-red-500' :
          'bg-purple-500'
        } text-white text-lg shadow-lg">
          ${
            pin.category === 'landmark' ? '🏛️' :
            pin.category === 'event' ? '📅' :
            pin.category === 'story' ? '📖' :
            pin.category === 'alert' ? '⚠️' :
            '📍'
          }
        </div>
      `;

      const icon = L.divIcon({
        html: markerHtml,
        className: 'custom-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      const marker = L.marker([pin.lat, pin.lng], { icon })
        .addTo(mapInstanceRef.current)
        .bindPopup(`
          <div class="p-3">
            <h3 class="font-semibold text-lg mb-1">${pin.title}</h3>
            <p class="text-gray-600 text-sm">${pin.description}</p>
          </div>
        `);

      markersRef.current.push(marker);
    });
  }, [pins]);

  // Handle new pin
  useEffect(() => {
    if (!mapInstanceRef.current || !newPin) {
      setIsFormVisible(false);
      return;
    }

    // Add temporary marker for new pin
    const marker = L.marker([newPin.lat, newPin.lng]).addTo(mapInstanceRef.current);
    markersRef.current.push(marker);

    return () => {
      if (marker) {
        marker.remove();
      }
    };
  }, [newPin]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full" />
      
      {/* Floating Form */}
      {isFormVisible && newPin && user && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg z-[1000] w-80">
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
            setIsFormVisible(false);
          }} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter a title for your pin"
                required
                className="w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                required
              >
                <option value="landmark">🏛️ Landmark</option>
                <option value="event">📅 Event</option>
                <option value="story">📖 Story</option>
                <option value="alert">⚠️ Alert</option>
                <option value="other">🔍 Other</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Share your experience or information about this location..."
                required
                rows="3"
                className="w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setIsFormVisible(false)}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Pin
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 