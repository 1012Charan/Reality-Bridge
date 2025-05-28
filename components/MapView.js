"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import ManualMap from "./ManualMap";
import Logo from "./Logo";

export default function MapView() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [pins, setPins] = useState([]);
  const [newPin, setNewPin] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", category: "landmark" });
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  useEffect(() => {
    setIsClient(true);
    fetchPins();
  }, []);

  // Cleanup effect for debounce timeout
  useEffect(() => {
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [debounceTimeout]);

  async function fetchPins() {
    try {
      const response = await fetch("/api/pins");
      const data = await response.json();
      setPins(data);
    } catch (error) {
      console.error("Error fetching pins:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleMapClick(e) {
    if (user) {
      setNewPin({ lat: e.latlng.lat, lng: e.latlng.lng });
    } else {
      router.push("/login");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Only trigger suggestion when title changes and there's a newPin
    if (name === 'title' && value && newPin) {
      // Clear any existing timeout
      if (debounceTimeout) clearTimeout(debounceTimeout);
      
      // Set new timeout
      const timeoutId = setTimeout(() => {
        getSuggestion(value);
      }, 1000); // Wait for 1 second of no typing
      
      setDebounceTimeout(timeoutId);
    }
  }

  async function getSuggestion(title) {
    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          lat: newPin.lat,
          lng: newPin.lng,
        }),
      });

      if (response.ok) {
        const { suggestion } = await response.json();
        setForm(prev => ({ ...prev, description: suggestion }));
      }
    } catch (error) {
      console.error('Error getting AI suggestion:', error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch("/api/pins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          lat: newPin.lat,
          lng: newPin.lng,
          userId: user.uid,
        }),
      });

      if (response.ok) {
        const newPinData = await response.json();
        setPins([...pins, newPinData]);
        setForm({ title: "", description: "", category: "landmark" });
        setNewPin(null);
      }
    } catch (error) {
      console.error("Error creating pin:", error);
    }
  }

  async function handleDelete(id) {
    try {
      const response = await fetch("/api/pins", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          userId: user.uid,
        }),
      });

      if (response.ok) {
        setPins(pins.filter((p) => p._id !== id));
      }
    } catch (error) {
      console.error("Error deleting pin:", error);
    }
  }

  async function handleLogout() {
    try {
      await logout();
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  const filteredPins = selectedCategory === "all" 
    ? pins 
    : pins.filter(pin => pin.category === selectedCategory);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your reality bridge...</p>
        </div>
      </div>
    );
  }

  if (!isClient) return null;

  const categories = [
    { id: "all", name: "All Pins", emoji: "🌍" },
    { id: "landmark", name: "Landmarks", emoji: "🏛️" },
    { id: "event", name: "Events", emoji: "📅" },
    { id: "story", name: "Stories", emoji: "📖" },
    { id: "alert", name: "Alerts", emoji: "⚠️" },
    { id: "other", name: "Other", emoji: "🔍" },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-zinc-900 to-stone-900">
      {/* Sidebar */}
      <div className="w-full md:w-1/3 bg-zinc-900/90 backdrop-blur-sm p-6 overflow-auto shadow-xl border-r border-amber-900/20">
        {/* Header with Profile */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <Logo />
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-amber-100">{user.email}</p>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-amber-600 to-yellow-600 flex items-center justify-center text-white font-bold shadow-md">
                  {user.email[0].toUpperCase()}
                </div>
              </div>
            ) : (
              <a
                href="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 shadow-md transition-all"
              >
                Sign in
              </a>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Category</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all shadow-sm ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-amber-700 to-yellow-600 text-amber-50 shadow-md'
                    : 'bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/40 border border-amber-700/20'
                }`}
              >
                {category.emoji} {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Pins Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-amber-100 mb-4">
            {selectedCategory === "all" ? "All Pins" : `${categories.find(c => c.id === selectedCategory)?.name}`}
          </h3>
          {filteredPins.map((pin) => (
            <div
              key={pin._id}
              className="bg-zinc-800/50 rounded-lg shadow-sm p-4 hover:shadow-md transition-all border border-amber-800/20 hover:border-amber-700/30"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {categories.find(c => c.id === pin.category)?.emoji || "📍"}
                    </span>
                    <h3 className="font-semibold text-amber-100">{pin.title}</h3>
                  </div>
                  <p className="text-sm text-amber-200/80 mt-1">{pin.description}</p>
                  <div className="flex items-center mt-2 text-xs text-amber-300/60">
                    <span className="flex items-center">
                      <span className="w-4 h-4 mr-1 text-amber-500">📍</span>
                      {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}
                    </span>
                  </div>
                </div>
                {user && pin.userId === user.uid && (
                  <button
                    onClick={() => handleDelete(pin._id)}
                    className="text-xs px-2 py-1 text-red-400 hover:bg-red-950/20 rounded transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
          {filteredPins.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-amber-900/30 to-yellow-900/30 flex items-center justify-center">
                <span className="text-2xl">🗺️</span>
              </div>
              <p className="text-amber-100">No pins in this category yet.</p>
              <p className="text-sm text-amber-300/70">Click on the map to create one!</p>
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="flex-grow">
        <ManualMap
          pins={filteredPins}
          newPin={newPin}
          user={user}
          onMapClick={handleMapClick}
          form={form}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
} 