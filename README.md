# AI-GEO PRIME

**Next-generation Disaster Response Operating System**

A real-time command center for disaster response operations featuring live telemetry tracking, NASA FIRMS fire data integration, AI-powered command interface, and SpaceX-grade 3D visualization.

![AI-GEO Prime](https://img.shields.io/badge/Status-Production%20Ready-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue)

---

## 🚀 Features

### Real-time Telemetry System
- **WebSocket Updates**: 500ms broadcast interval with 50ms latency simulation
- **4 Active Assets**: 2 scout robots + 2 surveillance drones
- **Live Metrics**: Battery, temperature, speed, altitude, GPS coordinates
- **Dynamic Risk Assessment**: Automatic LOW/MEDIUM/HIGH calculation

### Fire Data Integration
- **150 NASA FIRMS Hotspots**: Camp Fire scenario (Paradise, California)
- **Real-time Visualization**: Interactive map with fire markers
- **Temperature Simulation**: Increases as assets approach fire zones

### AI Command Interface
- **GPT-4o Integration**: Natural language tactical queries
- **Incident Commander**: Context-aware disaster response assistant
- **Real-time Responses**: Instant command processing

### Glassmorphism HUD
- **Tesla-Grade Styling**: Dark void aesthetic (#020617) with neon orange accents
- **Mission Timer**: Live operation duration tracking
- **Status Bar**: Active units, risk level, live indicator
- **Telemetry Panels**: Real-time asset data display

### 3D Visualization (GPU Required)
- **CesiumJS Integration**: SpaceX-grade 3D globe
- **Voxelized Fire**: 3D fire cubes with bloom effects
- **Holographic Assets**: Billboards with laser ground anchors
- **Cinematic Camera**: Quintic easing with inertia
- **Twilight Lighting**: Perpetual low sun angle for dramatic effect

---

## 🛠️ Tech Stack

**Frontend**
- React 19 + TypeScript
- Tailwind CSS 4
- Leaflet (2D mapping)
- CesiumJS (3D visualization)
- Socket.IO Client
- tRPC React Query

**Backend**
- Node.js + Express 4
- tRPC 11 (type-safe API)
- Socket.IO Server
- MySQL/TiDB + Drizzle ORM
- OpenAI GPT-4o

**Infrastructure**
- Vite 7 (build tool)
- Vitest (testing)
- pnpm (package manager)

---

## 📦 Installation

### Prerequisites
- Node.js 22+ (with pnpm)
- MySQL/TiDB database
- OpenAI API key

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/thefieldprojects/ai-geo-prime.git
cd ai-geo-prime
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/ai_geo_prime

# OpenAI API (for AI command interface)
BUILT_IN_FORGE_API_KEY=your_openai_api_key
BUILT_IN_FORGE_API_URL=https://api.openai.com/v1

# JWT Secret (generate a random string)
JWT_SECRET=your_jwt_secret_here

# OAuth (if using Manus auth, otherwise can be dummy values)
OAUTH_SERVER_URL=http://localhost:3000
VITE_OAUTH_PORTAL_URL=http://localhost:3000
VITE_APP_ID=ai-geo-prime
OWNER_OPEN_ID=admin
OWNER_NAME=Admin

# App Configuration
VITE_APP_TITLE=AI-GEO Prime
VITE_APP_LOGO=/logo.png
```

4. **Set up database**
```bash
pnpm db:push
```

5. **Run development server**
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

---

## 🎮 Usage

### Viewing the Map
- **2D Mode**: Automatically loads on systems without WebGL
- **3D Mode**: Requires GPU with WebGL support (Chrome, Firefox, Safari)
- **Zoom/Pan**: Use mouse wheel and drag to navigate
- **Asset Tracking**: Click markers to view detailed telemetry

### AI Command Interface
Enter natural language queries in the left panel:
- "Show me the hottest fire zone"
- "Which asset is closest to Paradise?"
- "What's the current risk level?"
- "Recommend evacuation routes"

### Telemetry Monitoring
Right panel displays real-time data:
- **Battery**: Percentage remaining
- **Temperature**: °C (increases near fire)
- **Speed**: m/s for movement tracking
- **Altitude**: meters (drones only)
- **GPS**: Latitude/Longitude coordinates

---

## 🧪 Testing

Run the test suite:
```bash
pnpm test
```

Current coverage:
- ✅ Fire data endpoint
- ✅ Auth logout flow
- ✅ WebSocket telemetry broadcast
- ✅ Temperature simulation logic

---

## 🏗️ Project Structure

```
ai-geo-prime/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── cesium/       # 3D CesiumJS components
│   │   │   ├── hud/          # HUD interface components
│   │   │   └── MapView.tsx   # 2D Leaflet map
│   │   ├── pages/
│   │   │   └── Home.tsx      # Main command center page
│   │   ├── lib/
│   │   │   ├── trpc.ts       # tRPC client
│   │   │   └── webgl.ts      # WebGL detection
│   │   └── index.css         # Global styles
│   └── public/               # Static assets
├── server/                    # Backend Express application
│   ├── _core/                # Framework core (auth, context, etc.)
│   ├── routers.ts            # tRPC API routes
│   ├── db.ts                 # Database queries
│   ├── simulationEngine.ts   # Asset movement simulation
│   ├── mockFireData.ts       # NASA FIRMS data
│   └── mockAssetPaths.ts     # Robot path generation
├── drizzle/                   # Database schema
│   └── schema.ts
└── shared/                    # Shared types and constants
```

---

## 🚀 Deployment

### Production Build
```bash
pnpm build
pnpm start
```

### Environment Variables (Production)
Ensure all environment variables are set in your production environment, especially:
- `DATABASE_URL` - Production database connection
- `BUILT_IN_FORGE_API_KEY` - OpenAI API key
- `JWT_SECRET` - Secure random string

---

## 🎨 Design System

### Color Palette
- **Background**: `#020617` (Void)
- **Accent**: `#F97316` (Neon Orange)
- **Text**: `#FFFFFF` (White) with opacity variants
- **Fire**: `#EF4444` (Red)
- **Scout**: `#06B6D4` (Cyan)
- **Drone**: `#F97316` (Orange)

### Typography
- **UI Font**: Inter (sans-serif)
- **Telemetry**: JetBrains Mono (monospace)

### Visual Style
- Glassmorphism panels with backdrop blur
- Dark void aesthetic
- Neon accent highlights
- Minimal borders, soft shadows
- High contrast for readability

---

## 🔧 Configuration

### Cesium Ion Token
To enable 3D visualization features, add your Cesium Ion token:

1. Create account at [https://ion.cesium.com](https://ion.cesium.com)
2. Generate token with `assets:read` and `geocode` scopes
3. Update `CESIUM_TOKEN` in `client/src/pages/Home.tsx`

### Mock Data Customization
Edit simulation parameters in:
- `server/mockFireData.ts` - Fire hotspot locations
- `server/mockAssetPaths.ts` - Robot movement paths
- `server/simulationEngine.ts` - Telemetry update intervals

---

## 📝 License

MIT License - see LICENSE file for details

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

## 🙏 Acknowledgments

- **NASA FIRMS**: Fire data source
- **CesiumJS**: 3D geospatial visualization
- **Leaflet**: 2D mapping library
- **OpenAI**: GPT-4o AI integration
- **Manus**: Development platform

---

**Built with ❤️ for disaster response teams worldwide**
