# AI-GEO Prime - Project TODO

## Core Infrastructure
- [x] Install CesiumJS, Resium, Socket.IO dependencies
- [x] Configure dark mode Tailwind CSS with glassmorphism utilities
- [x] Set up WebSocket server with Express integration
- [ ] Create database schema for assets and hazards

## Data Layer
- [x] Source NASA FIRMS fire data (Camp Fire scenario)
- [x] Generate mock robot movement paths near Paradise, California
- [x] Create simulation engine for asset position updates
- [x] Implement temperature fluctuation logic based on fire proximity

## 3D Globe Visualization
- [x] Initialize CesiumJS viewer with dark night skybox
- [x] Configure atmospheric effects and requestRenderMode
- [x] Render NASA FIRMS fire data as red voxels/entities
- [x] Load 3D GLTF models for scout robots and drones
- [x] Implement real-time asset position updates via WebSocket

## WebSocket Real-time System
- [x] Create WebSocket server endpoint at /telemetry
- [x] Implement 500ms broadcast interval with 50ms latency simulation
- [x] Send position, temperature, battery, and speed telemetry
- [x] Handle client connections and disconnections

## Glassmorphism HUD Interface
- [x] Design top bar with mission timer, active units, risk level
- [x] Create bottom time slider for past/present/prediction
- [x] Build right panel for live feed and asset telemetry
- [x] Build left panel for AI command chat interface
- [x] Apply glassmorphism styling (backdrop-blur, transparency)

## AI Command Integration
- [x] Create tRPC endpoint for AI command processing
- [x] Integrate OpenAI GPT-4o with incident commander prompt
- [x] Parse AI responses for camera flyTo coordinates
- [x] Display AI responses in chat interface

## Testing & Polish
- [x] Test WebSocket connection stability
- [x] Verify temperature increases near fire zones
- [x] Test AI command chat functionality
- [x] Ensure 3D globe performance with requestRenderMode
- [x] Create comprehensive vitest tests
- [ ] Create project checkpoint

## Map Visualization (New Request)
- [x] Fix Leaflet map initialization issues
- [x] Integrate map into center of interface
- [x] Display fire hotspots as red markers on map
- [x] Display scout robots and drones with custom icons
- [x] Update asset positions in real-time on map
- [x] Add map controls (zoom, pan)
- [x] Test map rendering and performance

## 3D CesiumJS Visualization (SpaceX-Grade)
- [x] Implement void skybox (#020617 background, no blue atmosphere)
- [x] Configure heavy volumetric fog to hide horizon
- [x] Set perpetual twilight lighting with low sun angle
- [x] Apply desaturated satellite imagery with dark tint
- [x] Enable terrain exaggeration (1.5x) for dramatic relief
- [x] Create voxelized 3D fire cubes with orange glow
- [x] Add bloom post-processing for fire emission
- [x] Implement holographic asset billboards facing camera
- [x] Add vertical laser lines from assets to ground
- [ ] Create fading gradient trails for asset movement
- [x] Configure cinematic camera with quintic easing
- [x] Enable inertia spin for physical weight feel
- [x] Set default 45-degree bird's eye view angle

## Bug Fixes
- [x] Fix viewer.entities undefined error in AssetBillboards and FireVoxels
- [x] Ensure viewer is fully initialized before passing to child components
- [x] Implement Leaflet fallback when CesiumJS/WebGL unavailable
