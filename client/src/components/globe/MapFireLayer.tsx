/**
 * MapFireLayer Component - Renders fire hotspots on Leaflet map
 */

import { useEffect } from "react";
import L from "leaflet";

interface MapFireLayerProps {
  map: L.Map | null;
  fireData: any;
}

export default function MapFireLayer({ map, fireData }: MapFireLayerProps) {
  useEffect(() => {
    if (!map || !fireData || !fireData.features) return;

    const markers: L.CircleMarker[] = [];

    fireData.features.forEach((feature: any) => {
      const [lon, lat] = feature.geometry.coordinates;
      const { frp } = feature.properties;

      // Size and opacity based on fire intensity
      const intensity = Math.min(frp / 300, 1);
      const radius = 8 + intensity * 12;
      const opacity = 0.7 + intensity * 0.3;

      const marker = L.circleMarker([lat, lon], {
        radius: radius,
        fillColor: "#EF4444",
        color: "#F97316",
        weight: 2,
        opacity: opacity,
        fillOpacity: opacity,
      }).addTo(map);

      markers.push(marker);
    });

    console.log(`[MapFireLayer] Rendered ${fireData.features.length} fire hotspots`);

    // Cleanup
    return () => {
      markers.forEach((marker) => marker.remove());
    };
  }, [map, fireData]);

  return null;
}
