/**
 * CesiumViewer Component - The 3D Globe with cinematic rendering
 */

import { useEffect, useRef, useState } from "react";
import { Viewer, Ion, Cartesian3, Color, ScreenSpaceEventHandler, ScreenSpaceEventType } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

interface CesiumViewerProps {
  cesiumToken: string;
  onViewerReady?: (viewer: Viewer) => void;
}

export default function CesiumViewer({ cesiumToken, onViewerReady }: CesiumViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current || viewerRef.current) return;

    // Set Cesium Ion token
    Ion.defaultAccessToken = cesiumToken;

    try {
      // Initialize Cesium Viewer with cinematic settings
      const viewer = new Viewer(containerRef.current, {
        // Remove UI clutter - pure map only
        animation: false,
        timeline: false,
        homeButton: false,
        geocoder: false,
        sceneModePicker: false,
        baseLayerPicker: false,
        navigationHelpButton: false,
        infoBox: false,
        selectionIndicator: false,
        fullscreenButton: false,
        vrButton: false,
        
        // Performance optimization
        requestRenderMode: true,
        maximumRenderTimeChange: Infinity,
        
        // Terrain
        terrain: undefined, // Use default terrain
      });

      // Apply cinematic rendering settings
      const scene = viewer.scene;
      
      // Night mode lighting for dramatic shadows
      scene.globe.enableLighting = true;
      
      // Atmospheric effects
      scene.fog.enabled = true;
      scene.fog.density = 0.0002;
      scene.fog.screenSpaceErrorFactor = 2.0;
      
      // Post-processing: Bloom for sci-fi glow
      if (scene.postProcessStages.bloom) {
        scene.postProcessStages.bloom.enabled = true;
        scene.postProcessStages.bloom.uniforms.contrast = 128;
        scene.postProcessStages.bloom.uniforms.brightness = -0.3;
        scene.postProcessStages.bloom.uniforms.glowOnly = false;
        scene.postProcessStages.bloom.uniforms.delta = 1.0;
        scene.postProcessStages.bloom.uniforms.sigma = 3.5;
        scene.postProcessStages.bloom.uniforms.stepSize = 5.0;
      }
      
      // Ambient occlusion for depth
      if (scene.postProcessStages.ambientOcclusion) {
        scene.postProcessStages.ambientOcclusion.enabled = true;
      }
      
      // Set camera to Paradise, California (Camp Fire location)
      viewer.camera.setView({
        destination: Cartesian3.fromDegrees(-121.6219, 39.7596, 50000),
        orientation: {
          heading: 0,
          pitch: -0.5, // Look down at an angle
          roll: 0,
        },
      });
      
      // Hide Cesium credit (optional - keep if required by license)
      const creditContainer = viewer.cesiumWidget.creditContainer as HTMLElement;
      if (creditContainer) {
        creditContainer.style.display = "none";
      }
      
      viewerRef.current = viewer;
      setIsLoading(false);
      
      if (onViewerReady) {
        onViewerReady(viewer);
      }
      
      console.log("[CesiumViewer] Initialized with cinematic settings");
    } catch (error) {
      console.error("[CesiumViewer] Failed to initialize:", error);
      setIsLoading(false);
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
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className="absolute inset-0"
        style={{ background: "#020617" }}
      />
      
      {/* Vignette overlay for focus */}
      <div className="map-vignette" />
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#020617] z-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#F97316] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#94A3B8] font-ui text-sm">Initializing Globe...</p>
          </div>
        </div>
      )}
    </div>
  );
}
