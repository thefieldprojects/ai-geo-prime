/**
 * TelemetryPanel Component - Right panel showing live asset telemetry
 */

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

interface TelemetryPanelProps {
  telemetryData: TelemetryUpdate[];
}

export default function TelemetryPanel({ telemetryData }: TelemetryPanelProps) {
  return (
    <div className="absolute top-24 right-6 z-10 w-[280px]">
      <div className="glass-panel p-4">
        {/* Header */}
        <div className="mb-4 pb-3 border-b border-white/10">
          <h2 className="text-[#94A3B8] font-ui text-[10px] uppercase tracking-[0.2em]">
            ASSET TELEMETRY
          </h2>
        </div>

        {/* Asset List */}
        <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {telemetryData.map((asset) => (
            <div
              key={asset.entityId}
              className="bg-[#0F172A]/50 rounded-lg p-3 border border-white/5"
            >
              {/* Asset Name */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-ui text-sm font-medium">
                  {asset.name}
                </span>
                <span
                  className={`text-xs font-ui uppercase px-2 py-0.5 rounded ${
                    asset.type === "scout"
                      ? "bg-[#22D3EE]/20 text-[#22D3EE]"
                      : "bg-[#F97316]/20 text-[#F97316]"
                  }`}
                >
                  {asset.type}
                </span>
              </div>

              {/* Telemetry Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Battery */}
                <div>
                  <div className="text-[#94A3B8] font-ui text-[9px] uppercase tracking-wider mb-1">
                    Battery
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-white font-data text-lg font-light">
                      {asset.battery.toFixed(1)}
                    </span>
                    <span className="text-[#94A3B8] font-data text-xs">%</span>
                  </div>
                  {/* Battery bar */}
                  <div className="mt-1 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        asset.battery > 50
                          ? "bg-[#22D3EE]"
                          : asset.battery > 20
                          ? "bg-[#F97316]"
                          : "bg-[#EF4444]"
                      }`}
                      style={{ width: `${asset.battery}%` }}
                    ></div>
                  </div>
                </div>

                {/* Temperature */}
                <div>
                  <div className="text-[#94A3B8] font-ui text-[9px] uppercase tracking-wider mb-1">
                    Temp
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`font-data text-lg font-light ${
                        asset.temperature > 60
                          ? "text-[#EF4444]"
                          : asset.temperature > 40
                          ? "text-[#F97316]"
                          : "text-white"
                      }`}
                    >
                      {asset.temperature.toFixed(1)}
                    </span>
                    <span className="text-[#94A3B8] font-data text-xs">°C</span>
                  </div>
                </div>

                {/* Speed */}
                <div>
                  <div className="text-[#94A3B8] font-ui text-[9px] uppercase tracking-wider mb-1">
                    Speed
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-white font-data text-lg font-light">
                      {asset.speed.toFixed(1)}
                    </span>
                    <span className="text-[#94A3B8] font-data text-xs">m/s</span>
                  </div>
                </div>

                {/* Altitude (for drones) */}
                {asset.altitude !== undefined && (
                  <div>
                    <div className="text-[#94A3B8] font-ui text-[9px] uppercase tracking-wider mb-1">
                      Altitude
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-white font-data text-lg font-light">
                        {asset.altitude.toFixed(0)}
                      </span>
                      <span className="text-[#94A3B8] font-data text-xs">m</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Coordinates */}
              <div className="mt-3 pt-3 border-t border-white/5">
                <div className="text-[#94A3B8] font-ui text-[9px] uppercase tracking-wider mb-1">
                  Position
                </div>
                <div className="font-data text-[10px] text-[#94A3B8]">
                  {asset.lat.toFixed(6)}°N, {Math.abs(asset.lon).toFixed(6)}°W
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
