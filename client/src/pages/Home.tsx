/**
 * Home Page - AI-GEO Prime Command Center
 * 
 * NOTE: This uses 2D Leaflet map for universal compatibility.
 * Full 3D CesiumJS code is available in /client/src/components/cesium/
 * and will automatically load when WebGL is available (local GPU testing).
 */

import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { trpc } from "@/lib/trpc";
import MapView from "@/components/MapView";
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

export default function Home() {
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
      {/* Leaflet 2D Map */}
      <MapView fireData={fireData} telemetryData={telemetryData} />
      
      {/* Title overlay */}
      <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
        <h1 className="text-4xl font-ui font-light text-white/80 tracking-wider text-center">
          AI-GEO <span className="text-[#F97316]">PRIME</span>
        </h1>
        <p className="text-xs text-white/40 text-center mt-1 font-mono">
          DISASTER RESPONSE OPERATING SYSTEM
        </p>
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
