/**
 * AssetLayer Component - Renders real-time assets (scouts, drones) on globe
 */

import { useEffect, useRef } from "react";
import { Viewer, Cartesian3, Color, Entity, VerticalOrigin, HorizontalOrigin } from "cesium";

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

interface AssetLayerProps {
  viewer: Viewer | null;
  telemetryData: TelemetryUpdate[];
}

export default function AssetLayer({ viewer, telemetryData }: AssetLayerProps) {
  const entitiesRef = useRef<Map<string, Entity>>(new Map());

  useEffect(() => {
    // Comprehensive viewer validation
    if (!viewer) return;
    
    try {
      // Check if viewer is fully initialized
      if (!viewer.entities) return;
      if (telemetryData.length === 0) return;

      telemetryData.forEach((data) => {
        let entity = entitiesRef.current.get(data.entityId);
        
        const position = Cartesian3.fromDegrees(
          data.lon,
          data.lat,
          data.altitude || 0
        );
        
        if (!entity) {
          // Create new entity
          try {
            entity = viewer.entities.add({
              id: data.entityId,
              name: data.name,
              position: position,
              billboard: {
                image: createAssetIcon(data.type),
                width: 32,
                height: 32,
                color: data.type === "scout" ? Color.CYAN : Color.ORANGE,
                verticalOrigin: VerticalOrigin.BOTTOM,
                horizontalOrigin: HorizontalOrigin.CENTER,
                scaleByDistance: undefined,
                heightReference: undefined,
              },
              label: {
                text: data.name,
                font: "12px 'Inter', sans-serif",
                fillColor: Color.WHITE,
                outlineColor: Color.BLACK,
                outlineWidth: 2,
                style: 0,
                verticalOrigin: VerticalOrigin.TOP,
                pixelOffset: new Cartesian3(0, 10, 0),
                showBackground: false,
                scale: 0.8,
              },
            });
            
            entitiesRef.current.set(data.entityId, entity);
          } catch (error) {
            console.error(`[AssetLayer] Failed to create entity ${data.entityId}:`, error);
          }
        } else {
          // Update existing entity position
          try {
            entity.position = position as any;
          } catch (error) {
            console.error(`[AssetLayer] Failed to update entity ${data.entityId}:`, error);
          }
        }
      });
    } catch (error) {
      console.error("[AssetLayer] Error processing telemetry:", error);
    }
    
    // Cleanup
    return () => {
      if (viewer && viewer.entities) {
        entitiesRef.current.forEach((entity) => {
          try {
            viewer.entities.remove(entity);
          } catch (error) {
            // Entity may already be removed
          }
        });
        entitiesRef.current.clear();
      }
    };
  }, [viewer, telemetryData]);

  return null;
}

/**
 * Create a simple SVG icon for assets (holographic style)
 */
function createAssetIcon(type: "scout" | "drone"): string {
  const color = type === "scout" ? "#22D3EE" : "#F97316";
  
  if (type === "scout") {
    // Scout: Bracket icon [ ]
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="8" width="16" height="16" fill="none" stroke="${color}" stroke-width="2" rx="2"/>
        <circle cx="16" cy="16" r="3" fill="${color}"/>
      </svg>
    `)}`;
  } else {
    // Drone: Chevron ^
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 8 L24 20 L16 16 L8 20 Z" fill="${color}" stroke="${color}" stroke-width="1"/>
        <circle cx="16" cy="16" r="2" fill="white"/>
      </svg>
    `)}`;
  }
}
