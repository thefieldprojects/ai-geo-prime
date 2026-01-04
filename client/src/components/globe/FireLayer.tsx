/**
 * FireLayer Component - Renders NASA FIRMS fire hotspots as red voxels
 */

import { useEffect } from "react";
import { Viewer, Cartesian3, Color, PointPrimitiveCollection } from "cesium";

interface FireLayerProps {
  viewer: Viewer | null;
  fireData: any; // GeoJSON from tRPC
}

export default function FireLayer({ viewer, fireData }: FireLayerProps) {
  useEffect(() => {
    // Comprehensive validation
    if (!viewer) return;
    if (!fireData || !fireData.features || fireData.features.length === 0) return;
    
    try {
      // Check if scene is ready
      if (!viewer.scene) return;
      
      const scene = viewer.scene;
      const pointCollection = new PointPrimitiveCollection();
      
      // Add fire hotspots as glowing red points
      fireData.features.forEach((feature: any) => {
        try {
          const [lon, lat] = feature.geometry.coordinates;
          const { brightness, frp } = feature.properties;
          
          // Size and color based on fire intensity
          const intensity = Math.min(frp / 300, 1); // Normalize FRP to 0-1
          const size = 8 + intensity * 12; // 8-20px
          const alpha = 0.7 + intensity * 0.3; // 0.7-1.0
          
          pointCollection.add({
            position: Cartesian3.fromDegrees(lon, lat, 500), // 500m above ground
            pixelSize: size,
            color: Color.fromCssColorString(`rgba(239, 68, 68, ${alpha})`), // Signal Red
            outlineColor: Color.fromCssColorString(`rgba(249, 115, 22, ${alpha * 0.5})`), // Signal Orange glow
            outlineWidth: 2,
            scaleByDistance: undefined, // Always same size
          });
        } catch (error) {
          console.error("[FireLayer] Failed to add hotspot:", error);
        }
      });
      
      scene.primitives.add(pointCollection);
      
      console.log(`[FireLayer] Rendered ${fireData.features.length} fire hotspots`);
      
      // Cleanup
      return () => {
        if (scene && scene.primitives && scene.primitives.contains(pointCollection)) {
          try {
            scene.primitives.remove(pointCollection);
          } catch (error) {
            console.error("[FireLayer] Cleanup error:", error);
          }
        }
      };
    } catch (error) {
      console.error("[FireLayer] Error rendering fire data:", error);
    }
  }, [viewer, fireData]);

  return null;
}
