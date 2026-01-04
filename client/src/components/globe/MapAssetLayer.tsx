/**
 * MapAssetLayer Component - Renders assets on Leaflet map
 */

import { useEffect, useRef } from "react";
import L from "leaflet";

interface TelemetryUpdate {
  entityId: string;
  name: string;
  type: "scout" | "drone";
  lat: number;
  lon: number;
  altitude?: number;
  temperature: number;
  battery: number;
  speed: number;
  timestamp: number;
}

interface MapAssetLayerProps {
  map: L.Map | null;
  telemetryData: TelemetryUpdate[];
}

export default function MapAssetLayer({ map, telemetryData }: MapAssetLayerProps) {
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  useEffect(() => {
    if (!map || telemetryData.length === 0) return;

    telemetryData.forEach((data) => {
      let marker = markersRef.current.get(data.entityId);

      if (!marker) {
        // Create custom icon
        const iconHtml = createAssetIcon(data.type, data.name);
        const icon = L.divIcon({
          html: iconHtml,
          className: "asset-marker",
          iconSize: [40, 50],
          iconAnchor: [20, 50],
        });

        marker = L.marker([data.lat, data.lon], { icon }).addTo(map);
        markersRef.current.set(data.entityId, marker);
      } else {
        // Update position
        marker.setLatLng([data.lat, data.lon]);
      }
    });

    // Cleanup
    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current.clear();
    };
  }, [map, telemetryData]);

  return null;
}

function createAssetIcon(type: "scout" | "drone", name: string): string {
  const color = type === "scout" ? "#22D3EE" : "#F97316";
  
  return `
    <div style="text-align: center;">
      <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        ${
          type === "scout"
            ? `<rect x="8" y="8" width="16" height="16" fill="none" stroke="${color}" stroke-width="2" rx="2"/><circle cx="16" cy="16" r="3" fill="${color}"/>`
            : `<path d="M16 8 L24 20 L16 16 L8 20 Z" fill="${color}" stroke="${color}" stroke-width="1"/><circle cx="16" cy="16" r="2" fill="white"/>`
        }
      </svg>
      <div style="color: white; font-size: 10px; font-family: 'Inter', sans-serif; text-shadow: 0 1px 3px black;">${name}</div>
    </div>
  `;
}
