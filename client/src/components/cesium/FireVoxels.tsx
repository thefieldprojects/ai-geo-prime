/**
 * FireVoxels Component - Voxelized 3D fire cubes with glow
 * Renders NASA FIRMS data as glowing orange 3D cubes
 */

import { useEffect, useRef } from "react";
import * as Cesium from "cesium";

interface FireVoxelsProps {
  viewer: Cesium.Viewer | null;
  fireData: any;
}

export default function FireVoxels({ viewer, fireData }: FireVoxelsProps) {
  const entitiesRef = useRef<Cesium.Entity[]>([]);

  useEffect(() => {
    if (!viewer || !viewer.entities || !fireData?.features) return;

    // Clear existing fire entities
    entitiesRef.current.forEach((entity) => {
      viewer.entities.remove(entity);
    });
    entitiesRef.current = [];

    // Create voxelized fire cubes
    fireData.features.forEach((feature: any) => {
      const [lon, lat] = feature.geometry.coordinates;
      const { frp, brightness } = feature.properties;

      // Size based on fire radiative power
      const intensity = Math.min(frp / 300, 1);
      const size = 100 + intensity * 200; // 100-300 meters

      // Height above terrain
      const height = 50 + intensity * 100;

      // Create 3D box (voxel)
      const entity = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(lon, lat, height),
        box: {
          dimensions: new Cesium.Cartesian3(size, size, size * 0.5),
          material: Cesium.Color.fromCssColorString('#FF4500').withAlpha(0.8),
          outline: true,
          outlineColor: Cesium.Color.fromCssColorString('#F97316'),
          outlineWidth: 2.0,
        },
        description: `Fire Hotspot<br/>FRP: ${frp.toFixed(1)} MW<br/>Brightness: ${brightness.toFixed(1)}K`,
      });

      entitiesRef.current.push(entity);
    });

    console.log(`[FireVoxels] Rendered ${fireData.features.length} voxelized fire cubes`);

    // Cleanup
    return () => {
      if (viewer && viewer.entities) {
        entitiesRef.current.forEach((entity) => {
          viewer.entities.remove(entity);
        });
      }
      entitiesRef.current = [];
    };
  }, [viewer, fireData]);

  return null;
}
