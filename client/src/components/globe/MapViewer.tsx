/**
 * MapViewer Component - 2D map with dark theme
 */

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapViewerProps {
  onMapReady?: (map: L.Map) => void;
}

export default function MapViewer({ onMapReady }: MapViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ensure we have a container and haven't already initialized
    if (!containerRef.current || mapRef.current) return;

    const container = containerRef.current;

    // Wait for next tick to ensure DOM is fully ready
    const initMap = () => {
      try {
        // Double-check container is still valid
        if (!container) {
          console.error("[MapViewer] Container not available");
          return;
        }

        // Initialize map
        const map = L.map(container, {
          center: [39.7596, -121.6219],
          zoom: 11,
          zoomControl: false,
          attributionControl: false,
        });

        // Add dark tile layer
        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
          maxZoom: 19,
          subdomains: "abcd",
        }).addTo(map);

        mapRef.current = map;
        setIsLoading(false);

        if (onMapReady) {
          onMapReady(map);
        }

        console.log("[MapViewer] Map initialized successfully");
      } catch (error) {
        console.error("[MapViewer] Failed to initialize map:", error);
        setIsLoading(false);
      }
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      setTimeout(initMap, 100);
    });

    // Cleanup
    return () => {
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch (error) {
          console.error("[MapViewer] Cleanup error:", error);
        }
        mapRef.current = null;
      }
    };
  }, [onMapReady]);

  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className="absolute inset-0 z-0"
        style={{ background: "#020617" }}
      />
      
      {/* Vignette overlay */}
      <div className="map-vignette" />
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#020617] z-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#F97316] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#94A3B8] font-ui text-sm">Initializing Map...</p>
          </div>
        </div>
      )}
    </div>
  );
}
