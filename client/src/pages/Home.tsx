/**
 * Home Page - AI-GEO Prime Command Center
 * SpaceX-grade 3D visualization with CesiumJS
 */

import { useState, useEffect } from "react";
import * as Cesium from "cesium";
import { io, Socket } from "socket.io-client";
import { trpc } from "@/lib/trpc";
import CesiumGlobe from "@/components/cesium/CesiumGlobe";
import FireVoxels from "@/components/cesium/FireVoxels";
import AssetBillboards from "@/components/cesium/AssetBillboards";
import StatusBar from "@/components/hud/StatusBar";
import TelemetryPanel from "@/components/hud/TelemetryPanel";
import AICommandPanel from "@/components/hud/AICommandPanel";

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

const CESIUM_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZGQ2NDZkNi0zZGU1LTRkYTgtYWI2Zi0zZmJmNDRiZTUzY2YiLCJpZCI6Mzc0ODM2LCJpYXQiOjE3Njc1MzQ4MTd9.wkfKuIFwoWM3RZTRKPTz4w2fyDQETd7djzQyCRREVMg";

export default function Home() {
  const [viewer, setViewer] = useState<Cesium.Viewer | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [telemetryData, setTelemetryData] = useState<TelemetryUpdate[]>([]);
  
  // Fetch fire data
  const { data: fireData } = trpc.fire.getData.useQuery();
  
  // AI command mutation
  const aiCommandMutation = trpc.ai.command.useMutation();

  // Initialize WebSocket connection
  useEffect(() => {
    const socketConnection = io({
      path: "/socket.io",
    });

    socketConnection.on("connect", () => {
      console.log("[WebSocket] Connected");
    });

    socketConnection.on("telemetry", (data: TelemetryUpdate[]) => {
      setTelemetryData(data);
    });

    socketConnection.on("disconnect", () => {
      console.log("[WebSocket] Disconnected");
    });

    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const handleAICommand = async (message: string): Promise<string> => {
    try {
      const result = await aiCommandMutation.mutateAsync({ message });
      return typeof result.response === 'string' ? result.response : 'Invalid response format';
    } catch (error) {
      console.error("[AI Command] Error:", error);
      return "Command processing failed. Please try again.";
    }
  };

  // Calculate risk level based on telemetry
  const getRiskLevel = (): "low" | "medium" | "high" => {
    if (telemetryData.length === 0) return "low";
    
    const avgTemp = telemetryData.reduce((sum, d) => sum + d.temperature, 0) / telemetryData.length;
    const minBattery = Math.min(...telemetryData.map(d => d.battery));
    
    if (avgTemp > 60 || minBattery < 20) return "high";
    if (avgTemp > 40 || minBattery < 50) return "medium";
    return "low";
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#020617] font-ui">
      {/* CesiumJS 3D Globe */}
      <CesiumGlobe
        cesiumToken={CESIUM_TOKEN}
        onViewerReady={(v) => setViewer(v)}
      />
      
      {/* Fire Voxels Layer */}
      <FireVoxels viewer={viewer} fireData={fireData} />
      
      {/* Asset Billboards Layer */}
      <AssetBillboards viewer={viewer} telemetryData={telemetryData} />
      
      {/* Title overlay */}
      <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
        <h1 className="text-4xl font-ui font-light text-white/80 tracking-wider text-center">
          AI-GEO <span className="text-[#F97316]">PRIME</span>
        </h1>
      </div>
      
      {/* HUD Overlays */}
      <StatusBar
        activeUnits={telemetryData.length}
        riskLevel={getRiskLevel()}
      />
      
      <TelemetryPanel telemetryData={telemetryData} />
      
      <AICommandPanel onSendCommand={handleAICommand} />
    </div>
  );
}
