/**
 * AssetBillboards Component - Holographic asset markers with laser anchors
 * Camera-facing billboards with vertical laser lines to ground
 */

import { useEffect, useRef } from "react";
import * as Cesium from "cesium";

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

interface AssetBillboardsProps {
  viewer: Cesium.Viewer | null;
  telemetryData: TelemetryUpdate[];
}

export default function AssetBillboards({ viewer, telemetryData }: AssetBillboardsProps) {
  const entitiesRef = useRef<Map<string, { billboard: Cesium.Entity; laser: Cesium.Entity }>>(new Map());

  useEffect(() => {
    if (!viewer || !viewer.entities || telemetryData.length === 0) return;

    telemetryData.forEach((data) => {
      const existing = entitiesRef.current.get(data.entityId);
      
      const altitude = data.altitude || 0;
      const position = Cesium.Cartesian3.fromDegrees(data.lon, data.lat, altitude + 100);
      const groundPosition = Cesium.Cartesian3.fromDegrees(data.lon, data.lat, 0);

      if (existing) {
        // Update position
        existing.billboard.position = new Cesium.ConstantPositionProperty(position);
        existing.laser.polyline!.positions = new Cesium.ConstantProperty([position, groundPosition]);
      } else {
        // Create billboard icon
        const color = data.type === "scout" ? "#22D3EE" : "#F97316";
        const canvas = createIconCanvas(data.type, color, data.name);

        const billboard = viewer.entities.add({
          position: position,
          billboard: {
            image: canvas,
            scale: 1.0,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            disableDepthTestDistance: Number.POSITIVE_INFINITY, // Always visible
          },
          label: {
            text: data.name,
            font: '12px "JetBrains Mono", monospace',
            fillColor: Cesium.Color.fromCssColorString(color),
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.TOP,
            pixelOffset: new Cesium.Cartesian2(0, 10),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
          description: `${data.name}<br/>Type: ${data.type}<br/>Battery: ${data.battery.toFixed(1)}%<br/>Temp: ${data.temperature.toFixed(1)}°C<br/>Speed: ${data.speed.toFixed(1)} m/s`,
        });

        // Create vertical laser line to ground
        const laser = viewer.entities.add({
          polyline: {
            positions: [position, groundPosition],
            width: 2,
            material: new Cesium.PolylineGlowMaterialProperty({
              glowPower: 0.2,
              taperPower: 0.5,
              color: Cesium.Color.fromCssColorString(color).withAlpha(0.6),
            }),
          },
        });

        entitiesRef.current.set(data.entityId, { billboard, laser });
      }
    });

    // Cleanup
    return () => {
      if (viewer && viewer.entities) {
        entitiesRef.current.forEach(({ billboard, laser }) => {
          viewer.entities.remove(billboard);
          viewer.entities.remove(laser);
        });
      }
      entitiesRef.current.clear();
    };
  }, [viewer, telemetryData]);

  return null;
}

function createIconCanvas(type: "scout" | "drone", color: string, name: string): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  // Draw icon
  ctx.fillStyle = color;
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;

  if (type === "scout") {
    // Square for scout
    ctx.fillRect(20, 20, 24, 24);
    ctx.strokeRect(20, 20, 24, 24);
    ctx.beginPath();
    ctx.arc(32, 32, 6, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Triangle for drone
    ctx.beginPath();
    ctx.moveTo(32, 16);
    ctx.lineTo(48, 48);
    ctx.lineTo(16, 48);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  return canvas;
}
