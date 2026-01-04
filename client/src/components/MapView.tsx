/**
 * MapView Component - Working Leaflet map integration
 */

import { useEffect, useRef } from "react";
import L from "leaflet";

interface MapViewProps {
  fireData: any;
  telemetryData: any[];
}

export default function MapView({ fireData, telemetryData }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fireMarkersRef = useRef<L.CircleMarker[]>([]);
  const assetMarkersRef = useRef<Map<string, L.Marker>>(new Map());

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Create map instance
    const map = L.map(containerRef.current, {
      center: [39.7596, -121.6219],
      zoom: 12,
      zoomControl: true,
      attributionControl: false,
    });

    // Add dark tile layer
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Render fire hotspots
  useEffect(() => {
    if (!mapRef.current || !fireData?.features) return;

    // Clear existing markers
    fireMarkersRef.current.forEach(m => m.remove());
    fireMarkersRef.current = [];

    // Add fire markers
    fireData.features.forEach((feature: any) => {
      const [lon, lat] = feature.geometry.coordinates;
      const { frp } = feature.properties;

      const intensity = Math.min(frp / 300, 1);
      const radius = 6 + intensity * 8;

      const marker = L.circleMarker([lat, lon], {
        radius,
        fillColor: "#EF4444",
        color: "#F97316",
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.6,
      }).addTo(mapRef.current!);

      fireMarkersRef.current.push(marker);
    });
  }, [fireData]);

  // Render and update assets
  useEffect(() => {
    if (!mapRef.current || telemetryData.length === 0) return;

    telemetryData.forEach((data) => {
      let marker = assetMarkersRef.current.get(data.entityId);

      if (!marker) {
        // Create icon
        const color = data.type === "scout" ? "#22D3EE" : "#F97316";
        const iconHtml = `
          <div style="text-align: center; transform: translate(-50%, -100%);">
            <div style="width: 24px; height: 24px; background: ${color}; border: 2px solid white; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.5);"></div>
            <div style="color: white; font-size: 9px; margin-top: 2px; text-shadow: 0 1px 2px black; white-space: nowrap;">${data.name}</div>
          </div>
        `;

        const icon = L.divIcon({
          html: iconHtml,
          className: "",
          iconSize: [24, 24],
        });

        marker = L.marker([data.lat, data.lon], { icon }).addTo(mapRef.current!);
        assetMarkersRef.current.set(data.entityId, marker);
      } else {
        // Update position
        marker.setLatLng([data.lat, data.lon]);
      }
    });
  }, [telemetryData]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-0"
      style={{ background: "#020617" }}
    />
  );
}
