/**
 * Mock asset movement paths for scout robots and drones
 * Paths are designed to intersect with fire perimeter for realistic simulation
 */

export interface PathPoint {
  lat: number;
  lon: number;
  altitude?: number; // meters above ground (for drones)
}

export interface Asset {
  id: string;
  name: string;
  type: "scout" | "drone";
  path: PathPoint[];
  speed: number; // meters per second
  batteryCapacity: number; // percentage
}

// Fire center: Paradise, California
const FIRE_CENTER = {
  lat: 39.7596,
  lon: -121.6219,
};

/**
 * Generate a path that approaches the fire perimeter
 */
function generateScoutPath(): PathPoint[] {
  const path: PathPoint[] = [];
  const numPoints = 100;
  
  // Start point: 5km west of fire center
  const startLat = FIRE_CENTER.lat;
  const startLon = FIRE_CENTER.lon - 0.045;
  
  // Path moves east toward fire, then circles around perimeter
  for (let i = 0; i < numPoints; i++) {
    const progress = i / numPoints;
    
    if (progress < 0.3) {
      // Approach phase: moving toward fire
      path.push({
        lat: startLat + (Math.random() - 0.5) * 0.002,
        lon: startLon + progress * 0.15,
      });
    } else {
      // Perimeter patrol: circle around fire edge
      const angle = (progress - 0.3) * Math.PI * 2 * 1.5;
      const radius = 0.025; // ~2.5km from center
      path.push({
        lat: FIRE_CENTER.lat + Math.cos(angle) * radius + (Math.random() - 0.5) * 0.001,
        lon: FIRE_CENTER.lon + Math.sin(angle) * radius + (Math.random() - 0.5) * 0.001,
      });
    }
  }
  
  return path;
}

/**
 * Generate a drone path that flies over the fire
 */
function generateDronePath(): PathPoint[] {
  const path: PathPoint[] = [];
  const numPoints = 80;
  
  // Start point: 3km north of fire center
  const startLat = FIRE_CENTER.lat + 0.027;
  const startLon = FIRE_CENTER.lon;
  
  // Drone flies in a grid pattern over the fire for aerial surveillance
  for (let i = 0; i < numPoints; i++) {
    const progress = i / numPoints;
    const row = Math.floor(progress * 4);
    const col = (progress * 4) % 1;
    
    const latOffset = -0.027 + (row * 0.018);
    const lonOffset = (row % 2 === 0 ? col : 1 - col) * 0.04 - 0.02;
    
    path.push({
      lat: startLat + latOffset + (Math.random() - 0.5) * 0.0005,
      lon: startLon + lonOffset + (Math.random() - 0.5) * 0.0005,
      altitude: 150 + Math.random() * 50, // 150-200m altitude
    });
  }
  
  return path;
}

export const MOCK_ASSETS: Asset[] = [
  {
    id: "scout-alpha-01",
    name: "Scout Alpha-01",
    type: "scout",
    path: generateScoutPath(),
    speed: 2.5, // 2.5 m/s (~9 km/h)
    batteryCapacity: 100,
  },
  {
    id: "drone-eagle-02",
    name: "Drone Eagle-02",
    type: "drone",
    path: generateDronePath(),
    speed: 15, // 15 m/s (~54 km/h)
    batteryCapacity: 100,
  },
];

/**
 * Calculate distance between two lat/lon points (Haversine formula)
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

/**
 * Calculate temperature based on distance to fire center
 * Temperature increases as asset approaches fire
 */
export function calculateTemperature(lat: number, lon: number): number {
  const distance = calculateDistance(lat, lon, FIRE_CENTER.lat, FIRE_CENTER.lon);
  const baseTemp = 20; // 20°C ambient
  const maxFireTemp = 80; // 80°C near fire
  
  // Temperature increases exponentially as distance decreases
  const tempIncrease = maxFireTemp * Math.exp(-distance / 2500);
  
  return baseTemp + tempIncrease + (Math.random() - 0.5) * 5;
}
