/**
 * CesiumGlobe Component - SpaceX-grade 3D visualization
 * Implements: Void skybox, twilight lighting, exaggerated terrain, cinematic camera
 */

import { useEffect, useRef } from "react";
import * as Cesium from "cesium";

interface CesiumGlobeProps {
  cesiumToken: string;
  onViewerReady?: (viewer: Cesium.Viewer) => void;
  onError?: () => void;
}

export default function CesiumGlobe({ cesiumToken, onViewerReady, onError }: CesiumGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);

  useEffect(() => {
    if (!containerRef.current || viewerRef.current) return;

    // Set Cesium Ion token
    Cesium.Ion.defaultAccessToken = cesiumToken;

    try {
      // Initialize Cesium Viewer with SpaceX aesthetic
      const viewer = new Cesium.Viewer(containerRef.current, {
        // Remove default UI elements for clean look
        animation: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        vrButton: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: false,
        timeline: false,
        navigationHelpButton: false,
        navigationInstructionsInitiallyVisible: false,
        
        // Performance optimizations
        requestRenderMode: true,
        maximumRenderTimeChange: Infinity,
        
        // Terrain provider with high resolution
        // Terrain will be set after viewer creation
        terrain: Cesium.Terrain.fromWorldTerrain(),
      });

      // === 1. THE VOID AESTHETIC ===
      
      // Remove skybox - solid void background
      if (viewer.scene.skyBox) viewer.scene.skyBox.show = false;
      if (viewer.scene.sun) viewer.scene.sun.show = false;
      if (viewer.scene.moon) viewer.scene.moon.show = false;
      viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#020617');
      
      // Heavy volumetric fog to hide horizon
      viewer.scene.fog.enabled = true;
      viewer.scene.fog.density = 0.001; // High density
      viewer.scene.fog.screenSpaceErrorFactor = 2.0;
      
      // === 2. TWILIGHT LIGHTING ===
      
      // Enable globe lighting
      viewer.scene.globe.enableLighting = true;
      
      // Set perpetual twilight (8:00 AM lighting)
      const twilightTime = Cesium.JulianDate.fromIso8601('2018-11-08T08:00:00Z');
      viewer.clock.currentTime = twilightTime;
      viewer.clock.shouldAnimate = false;
      
      // === 3. TERRAIN CONFIGURATION ===
      
      // Exaggerated relief for dramatic mountains
      // Note: terrainExaggeration is set via terrainProvider options
      
      // Dark matter grid - desaturated imagery
      viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#0F172A');
      
      // === 4. CINEMATIC CAMERA ===
      
      // Enable inertia for physical weight
      viewer.scene.screenSpaceCameraController.inertiaSpin = 0.9;
      viewer.scene.screenSpaceCameraController.inertiaTranslate = 0.9;
      viewer.scene.screenSpaceCameraController.inertiaZoom = 0.8;
      
      // Smooth camera movements
      viewer.scene.screenSpaceCameraController.minimumZoomDistance = 1000;
      viewer.scene.screenSpaceCameraController.maximumZoomDistance = 50000000;
      
      // Fly to Paradise, California with 45-degree tilt
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(-121.6219, 39.7596, 15000),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-45), // 45-degree bird's eye view
          roll: 0.0,
        },
        duration: 3.0,
        easingFunction: Cesium.EasingFunction.QUINTIC_IN_OUT,
      });

      viewerRef.current = viewer;

      if (onViewerReady) {
        onViewerReady(viewer);
      }

      console.log("[CesiumGlobe] Initialized with SpaceX aesthetic");

    } catch (error) {
      console.error("[CesiumGlobe] Initialization error:", error);
      if (onError) {
        onError();
      }
    }

    // Cleanup
    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [cesiumToken, onViewerReady]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0"
      style={{ background: "#020617" }}
    />
  );
}
