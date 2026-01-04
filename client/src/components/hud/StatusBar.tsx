/**
 * StatusBar Component - Top HUD bar with mission timer, active units, risk level
 */

import { useEffect, useState } from "react";

interface StatusBarProps {
  activeUnits: number;
  riskLevel: "low" | "medium" | "high";
}

export default function StatusBar({ activeUnits, riskLevel }: StatusBarProps) {
  const [missionTime, setMissionTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMissionTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getRiskColor = () => {
    switch (riskLevel) {
      case "high":
        return "text-[#EF4444]"; // Signal Red
      case "medium":
        return "text-[#F97316]"; // Signal Orange
      case "low":
        return "text-[#22D3EE]"; // Signal Cyan
    }
  };

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
      <div className="glass-panel px-6 py-3 flex items-center gap-8">
        {/* Live Status */}
        <div className="flex items-center gap-2">
          <div className="status-dot-live w-2 h-2"></div>
          <span className="text-[#F97316] font-ui text-xs font-medium uppercase tracking-[0.2em]">
            LIVE
          </span>
        </div>

        {/* Mission Timer */}
        <div className="flex flex-col">
          <span className="text-[#94A3B8] font-ui text-[10px] uppercase tracking-[0.2em]">
            MISSION TIME
          </span>
          <span className="text-white font-data text-xl font-light">
            {formatTime(missionTime)}
          </span>
        </div>

        {/* Active Units */}
        <div className="flex flex-col">
          <span className="text-[#94A3B8] font-ui text-[10px] uppercase tracking-[0.2em]">
            ACTIVE UNITS
          </span>
          <span className="text-white font-data text-xl font-light">
            {activeUnits.toString().padStart(2, "0")}
          </span>
        </div>

        {/* Risk Level */}
        <div className="flex flex-col">
          <span className="text-[#94A3B8] font-ui text-[10px] uppercase tracking-[0.2em]">
            RISK LEVEL
          </span>
          <span className={`${getRiskColor()} font-ui text-sm font-medium uppercase`}>
            {riskLevel}
          </span>
        </div>
      </div>
    </div>
  );
}
