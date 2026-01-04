/**
 * Simulation Engine for AI-GEO Prime
 * Broadcasts real-time asset telemetry updates via WebSocket
 */

import { Server as SocketIOServer } from "socket.io";
import { MOCK_ASSETS, calculateTemperature, calculateDistance } from "./mockAssetPaths";

export interface TelemetryUpdate {
  entityId: string;
  name: string;
  type: "scout" | "drone";
  lat: number;
  lon: number;
  altitude?: number;
  temperature: number; // Celsius
  battery: number; // percentage
  speed: number; // m/s
  timestamp: number;
}

interface AssetState {
  currentPathIndex: number;
  battery: number;
  lastUpdate: number;
}

export class SimulationEngine {
  private io: SocketIOServer;
  private assetStates: Map<string, AssetState> = new Map();
  private simulationInterval: NodeJS.Timeout | null = null;
  private readonly BROADCAST_INTERVAL = 500; // 500ms
  private readonly STARLINK_LATENCY = 50; // 50ms simulated latency

  constructor(io: SocketIOServer) {
    this.io = io;
    this.initializeAssetStates();
  }

  private initializeAssetStates() {
    MOCK_ASSETS.forEach((asset) => {
      this.assetStates.set(asset.id, {
        currentPathIndex: 0,
        battery: asset.batteryCapacity,
        lastUpdate: Date.now(),
      });
    });
  }

  /**
   * Start the simulation loop
   */
  start() {
    if (this.simulationInterval) {
      console.log("[SimulationEngine] Already running");
      return;
    }

    console.log("[SimulationEngine] Starting simulation loop");
    
    this.simulationInterval = setInterval(() => {
      this.updateAndBroadcast();
    }, this.BROADCAST_INTERVAL);
  }

  /**
   * Stop the simulation loop
   */
  stop() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
      console.log("[SimulationEngine] Stopped simulation loop");
    }
  }

  /**
   * Update asset positions and broadcast telemetry
   */
  private updateAndBroadcast() {
    const updates: TelemetryUpdate[] = [];
    const now = Date.now();

    MOCK_ASSETS.forEach((asset) => {
      const state = this.assetStates.get(asset.id);
      if (!state) return;

      // Get current position
      const currentPoint = asset.path[state.currentPathIndex];
      
      // Calculate temperature based on proximity to fire
      const temperature = calculateTemperature(currentPoint.lat, currentPoint.lon);
      
      // Battery drain: faster drain when near fire (high temperature)
      const batteryDrainRate = temperature > 40 ? 0.015 : 0.005; // % per update
      state.battery = Math.max(0, state.battery - batteryDrainRate);
      
      // Create telemetry update
      const update: TelemetryUpdate = {
        entityId: asset.id,
        name: asset.name,
        type: asset.type,
        lat: currentPoint.lat,
        lon: currentPoint.lon,
        altitude: currentPoint.altitude,
        temperature: Math.round(temperature * 10) / 10,
        battery: Math.round(state.battery * 10) / 10,
        speed: asset.speed + (Math.random() - 0.5) * 0.5, // Add slight variation
        timestamp: now,
      };
      
      updates.push(update);
      
      // Move to next point in path (loop infinitely)
      state.currentPathIndex = (state.currentPathIndex + 1) % asset.path.length;
      
      // Reset battery when it gets too low (simulates recharge)
      if (state.battery < 10) {
        state.battery = 100;
      }
      
      state.lastUpdate = now;
    });

    // Simulate Starlink latency before broadcasting
    setTimeout(() => {
      this.io.emit("telemetry", updates);
    }, this.STARLINK_LATENCY);
  }

  /**
   * Get current state of all assets
   */
  getCurrentState(): TelemetryUpdate[] {
    const updates: TelemetryUpdate[] = [];
    const now = Date.now();

    MOCK_ASSETS.forEach((asset) => {
      const state = this.assetStates.get(asset.id);
      if (!state) return;

      const currentPoint = asset.path[state.currentPathIndex];
      const temperature = calculateTemperature(currentPoint.lat, currentPoint.lon);

      updates.push({
        entityId: asset.id,
        name: asset.name,
        type: asset.type,
        lat: currentPoint.lat,
        lon: currentPoint.lon,
        altitude: currentPoint.altitude,
        temperature: Math.round(temperature * 10) / 10,
        battery: Math.round(state.battery * 10) / 10,
        speed: asset.speed,
        timestamp: now,
      });
    });

    return updates;
  }
}
