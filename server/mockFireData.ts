/**
 * Mock NASA FIRMS fire data for Camp Fire (Paradise, California - November 2018)
 * This represents active fire hotspots detected during the Camp Fire disaster
 */

export interface FireHotspot {
  id: string;
  latitude: number;
  longitude: number;
  brightness: number; // Kelvin
  scan: number; // km
  track: number; // km
  acq_date: string;
  acq_time: string;
  satellite: string;
  confidence: number; // 0-100
  version: string;
  bright_t31: number;
  frp: number; // Fire Radiative Power (MW)
  daynight: string;
  type: number; // 0 = presumed vegetation fire, 1-3 = other
}

// Camp Fire center coordinates: Paradise, California
const FIRE_CENTER = {
  lat: 39.7596,
  lon: -121.6219,
};

/**
 * Generate realistic fire hotspots in a perimeter pattern
 * Simulates the Camp Fire spread pattern
 */
function generateFireHotspots(): FireHotspot[] {
  const hotspots: FireHotspot[] = [];
  const numHotspots = 150;
  
  // Create fire perimeter with multiple rings
  for (let i = 0; i < numHotspots; i++) {
    const angle = (i / numHotspots) * Math.PI * 2;
    const radiusVariation = 0.02 + Math.random() * 0.08; // 2-10km radius variation
    const angleVariation = (Math.random() - 0.5) * 0.3;
    
    const lat = FIRE_CENTER.lat + Math.cos(angle + angleVariation) * radiusVariation;
    const lon = FIRE_CENTER.lon + Math.sin(angle + angleVariation) * radiusVariation;
    
    // Higher brightness and FRP near fire front
    const distanceFromCenter = Math.sqrt(
      Math.pow(lat - FIRE_CENTER.lat, 2) + Math.pow(lon - FIRE_CENTER.lon, 2)
    );
    const intensity = 1 - Math.min(distanceFromCenter / 0.1, 1);
    
    hotspots.push({
      id: `MODIS_${i}`,
      latitude: lat,
      longitude: lon,
      brightness: 320 + intensity * 80 + Math.random() * 20, // 320-420K
      scan: 1.0 + Math.random() * 0.5,
      track: 1.0 + Math.random() * 0.5,
      acq_date: "2018-11-08",
      acq_time: "1830",
      satellite: Math.random() > 0.5 ? "Terra" : "Aqua",
      confidence: 80 + Math.floor(Math.random() * 20), // 80-100%
      version: "6.1",
      bright_t31: 290 + intensity * 30 + Math.random() * 10,
      frp: 50 + intensity * 200 + Math.random() * 50, // 50-300 MW
      daynight: "N",
      type: 0,
    });
  }
  
  return hotspots;
}

export const CAMP_FIRE_DATA = generateFireHotspots();

/**
 * Convert fire hotspots to GeoJSON format for easy mapping
 */
export function getFireGeoJSON() {
  return {
    type: "FeatureCollection",
    features: CAMP_FIRE_DATA.map((hotspot) => ({
      type: "Feature",
      id: hotspot.id,
      properties: {
        brightness: hotspot.brightness,
        confidence: hotspot.confidence,
        frp: hotspot.frp,
        satellite: hotspot.satellite,
        acq_date: hotspot.acq_date,
        acq_time: hotspot.acq_time,
      },
      geometry: {
        type: "Point",
        coordinates: [hotspot.longitude, hotspot.latitude],
      },
    })),
  };
}
