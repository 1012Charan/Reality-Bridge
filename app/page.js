"use client";
import dynamic from "next/dynamic";

// Dynamically import MapView with no SSR to avoid leaflet issues
const MapView = dynamic(() => import("../components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <p className="text-lg">Loading map...</p>
    </div>
  ),
});

export default function Home() {
  return <MapView />;
} 