/**
 * Home Page - AI-GEO Prime Command Center
 * Real-time telemetry dashboard with WebSocket updates
 */

import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { trpc } from "@/lib/trpc";
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
      {/* Background - Dark void with subtle grid */}
      <div className="absolute inset-0 bg-[#020617]">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `
            linear-gradient(rgba(249, 115, 22, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(249, 115, 22, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Center display area - Mission info */}
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="text-center">
          <h1 className="text-6xl font-ui font-light text-white mb-4 tracking-wider">
            AI-GEO <span className="text-[#F97316]">PRIME</span>
          </h1>
          <p className="text-[#94A3B8] font-ui text-sm uppercase tracking-[0.3em]">
            Disaster Response Operating System
          </p>
          
          {/* Fire data summary */}
          {fireData && fireData.features && (
            <div className="mt-12 glass-panel inline-block px-8 py-4">
              <div className="text-[#94A3B8] font-ui text-[10px] uppercase tracking-[0.2em] mb-2">
                Active Fire Hotspots
              </div>
              <div className="text-[#EF4444] font-data text-4xl font-light">
                {fireData.features.length}
              </div>
              <div className="text-[#94A3B8] font-ui text-xs mt-2">
                Camp Fire - Paradise, CA
              </div>
            </div>
          )}
        </div>
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
