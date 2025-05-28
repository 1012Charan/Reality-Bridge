"use client";

export default function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative w-12 h-12">
        {/* Outer ring with gradient animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 rounded-full animate-spin-slow"></div>
        
        {/* Inner circle with map pin */}
        <div className="absolute inset-1 bg-zinc-900 rounded-full flex items-center justify-center overflow-hidden">
          <div className="relative w-6 h-6">
            {/* Map pin with gradient */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full shadow-lg transform -translate-y-1"></div>
              <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-gradient-to-br from-amber-400 to-yellow-500 transform rotate-45 translate-y-1/2 -translate-x-1/2"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col">
        <span className="text-xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
          RealityBridge
        </span>
        <span className="text-xs text-zinc-400">Map Your Memories, Share Your World</span>
      </div>
    </div>
  );
} 