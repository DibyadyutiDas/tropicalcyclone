# 🌀 StormSense - Tropical Cyclone Intelligence Platform & Cyra AI

An advanced, real-time meteorological intelligence and tropical cyclone monitoring platform built with Next.js (App Router), TypeScript, and WebGL/Canvas map rendering engines. Featuring the **Cyra AI** meteorological copilot.

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Project Structure](#-project-structure)
- [Application Routes (Pages)](#-application-routes-pages)
- [API Endpoints Reference](#-api-endpoints-reference)
  - [Live Monitoring Endpoints](#1-live-monitoring)
  - [Storm Catalog & Details Endpoints](#2-storm-catalog--details)
  - [Satellite Imagery & AI Analysis Endpoints](#3-satellite-imagery--ai-analysis)
  - [ML Prediction & Trend Endpoints](#4-ml-prediction--trend-analysis)
- [Data Providers & External Ingestion](#-data-providers--external-ingestion)
- [Environment Configuration](#-environment-configuration)
- [Getting Started](#-getting-started)
- [Scripts Reference](#-scripts-reference)

---

## 🚀 Key Features

- **Windy-Style Meteorological Engine**: Interactive canvas/WebGL map with fluid wind streamline animations, satellite cloud overlays, radar precipitation, temperature, and sea-surface pressure fields.
- **Global Multi-Basin Cyclone Tracking**: Comprehensive coverage for North Indian Ocean (Bay of Bengal, Arabian Sea), Western Pacific, North Atlantic, and Southern Oceans.
- **Real-Time Live Telemetry & Threat Assessment**: Dynamic ingestion of live active storms with auto-refresh intervals, forecast uncertainty cones, and landfall proximity alerts.
- **Computer Vision Satellite Analysis**: Deep-learning pattern classification for tropical cyclone stages (disturbance, organizing, eye formation, mature cyclone, weakening).
- **AI Meteorological Chat Assistant**: Interactive AI assistant offering storm guidance, safety advisories, meteorological definitions, and basin threat insights.

---

## 🛠️ Architecture & Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (v16+ App Router, React 19, Turbopack support)
- **Language**: TypeScript (Strict Mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4), Vanilla CSS
- **Map & Geospatial Engines**: Leaflet, React-Leaflet, MapLibre GL
- **Data Visualization**: Recharts, Framer Motion
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Icons & UI**: Lucide React, Canvas Confetti

---

## 📂 Project Structure

```text
tropicalcyclone/
├── public/                     # Static assets & satellite image previews
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # Backend API route handlers
│   │   │   ├── live/           # /api/live
│   │   │   ├── predictions/    # /api/predictions/[stormId] & /trend
│   │   │   ├── satellite/      # /api/satellite/[stormId] & /analysis
│   │   │   └── storms/         # /api/storms, /[id], /track, /observations, /satellite
│   │   ├── chat/               # /chat - AI assistant page
│   │   ├── live/               # /live - Real-time tracking page
│   │   ├── monitor/            # /monitor - Basin & satellite diagnostics page
│   │   ├── storms/             # /storms - Storm catalog & analysis page
│   │   ├── layout.tsx          # Root layout and metadata
│   │   └── page.tsx            # / - Windy map dashboard (Home)
│   ├── components/             # Reusable UI, map, and telemetry components
│   │   ├── chat/               # Chat panel & message bubbles
│   │   ├── dashboard/          # TopNav, ForecastPanel, LandfallBanner
│   │   ├── map/                # CycloneMap, WindyCanvas, MapLibre & Leaflet wrappers
│   │   ├── satellite/          # ImageGrid, AnalysisResult, SatelliteViewer
│   │   └── windy/              # WindyLayerBar, Timeline, SpotPicker, LeftHUD
│   ├── hooks/                  # Custom React hooks (canvas, polling, media queries)
│   ├── lib/                    # API clients, data adapters, formatters, and types
│   └── stores/                 # Zustand stores (cycloneStore, predictionStore, satelliteStore)
├── package.json
└── tsconfig.json
```

---

## 🌐 Application Routes (Pages)

| Route | File Path | Route Name | Description & Work |
|---|---|---|---|
| `/` | `src/app/page.tsx` | **Windy Map Dashboard** | **Main Interactive Geospatial Dashboard.** Renders full-screen interactive meteorological map with animated wind streamlines, satellite layer overlays, radar precipitation tiles, temperature/pressure fields. Features timeline scrubbers for historical playback and forecast projections, a left HUD showing real-time cyclone intensity and position, an interactive coordinate spot-picker, and mobile layer filter drawers. |
| `/storms` | `src/app/storms/page.tsx` | **Storm Archive & Detailed Analysis** | **Historical & Active Storm Explorer.** Allows searching and filtering cyclones by basin, category, or year. Visualizes the full historical track, eye coordinates, cone of uncertainty, pressure drop vs. wind speed charts, and chronological observation logs from weather buoys and reconnaissance. Supports deep-linking via `?storm=<id>`. |
| `/live` | `src/app/live/page.tsx` | **Live Cyclone Tracking** | **Real-Time Telemetry & Impact Center.** Connects to live NOAA & IMD cyclone feeds. Features user-selectable auto-refresh rates (60s, 120s, 300s, 600s), active storm track with forecast cone, landfall threat alerts, estimated time to landfall (ETL), and coastal impact risk matrices. |
| `/monitor` | `src/app/monitor/page.tsx` | **Basin & Diagnostics Monitor** | **Multi-Factor Cyclone Diagnostic Center.** Displays synchronized multi-spectral satellite feeds (Infrared, Visible, Water Vapor) alongside AI computer vision pattern detections (CDO, eye formation, banding), rapid intensification warnings, and multi-day forecast track projections. |
| `/chat` | `src/app/chat/page.tsx` | **AI Meteorological Assistant** | **Conversational Cyclone Intelligence Interface.** AI chatbot specialized in tropical meteorology. Provides storm track explanations, safety recommendations, evacuation prep guidance, terminology clarifications, and live status briefings. |

---

## 🔌 API Endpoints Reference

All API routes are served under `/api` and respond with `application/json`.

### 1. Live Monitoring

#### `GET /api/live`
- **File**: `src/app/api/live/route.ts`
- **Description**: Fetches current real-time monitoring data aggregated from live feeds (NOAA NHC/JTWC, IMD). If no active storm is currently recorded, it provides fallback baseline monitoring.
- **Query Parameters**:
  - `storm` *(optional, string)*: Specific storm identifier to query.
- **Headers**: `Cache-Control: no-store`
- **Response Structure**:
  ```json
  {
    "active": true,
    "cycloneName": "Biparjoy",
    "basin": "North Indian Ocean",
    "intensity": "VERY_SEVERE_CYCLONE",
    "windSpeed": 90,
    "pressure": 962,
    "movementDirection": "NNE",
    "movementSpeed": 7,
    "currentPosition": { "lat": 22.8, "lon": 67.2 },
    "trackHistory": [
      { "timestamp": "2026-09-07T00:00:00Z", "lat": 21.5, "lon": 66.8, "wind_kt": 85, "pressure_hpa": 968 }
    ],
    "forecastTrack": [
      { "timestamp": "2026-09-07T12:00:00Z", "lat": 23.4, "lon": 67.9, "wind_kt": 80, "category": "VERY_SEVERE_CYCLONE" }
    ],
    "uncertaintyCone": [
      { "timestamp": "2026-09-07T12:00:00Z", "lat": 23.4, "lon": 67.9, "radiusKm": 65 }
    ],
    "landfallAlert": {
      "threat": true,
      "estimatedHours": 18,
      "region": "Kutch Coast, Gujarat, India"
    },
    "lastCycloneUpdate": "2026-09-07T05:00:00Z"
  }
  ```

---

### 2. Storm Catalog & Details

#### `GET /api/storms`
- **File**: `src/app/api/storms/route.ts`
- **Description**: Lists all recorded tropical cyclones across basins (historical and active).
- **Response Structure**:
  ```json
  [
    {
      "id": "2023-biparjoy",
      "sid": "2023157N12067",
      "name": "Biparjoy",
      "year": 2023,
      "basin": "NI",
      "max_wind_kt": 90,
      "min_pressure_hpa": 960,
      "active": false,
      "start_time": "2023-06-06T00:00:00Z",
      "latest_time": "2023-06-19T18:00:00Z"
    }
  ]
  ```

#### `GET /api/storms/[id]`
- **File**: `src/app/api/storms/[id]/route.ts`
- **Description**: Retrieves comprehensive metadata for a specific storm by its ID or SID. Returns HTTP `404` if the storm is not found.
- **Path Parameters**:
  - `id` *(required, string)*: Storm ID (e.g., `2023-biparjoy`, `2020-amphan`).
- **Response Structure**:
  ```json
  {
    "id": "2023-biparjoy",
    "name": "Biparjoy",
    "basin": "North Indian Ocean",
    "category": "VERY_SEVERE_CYCLONE",
    "maxWind": 90,
    "minPressure": 960,
    "status": "historical",
    "startTime": "2023-06-06T00:00:00Z",
    "latestTime": "2023-06-19T18:00:00Z",
    "observationCount": 48
  }
  ```

#### `GET /api/storms/[id]/track`
- **File**: `src/app/api/storms/[id]/track/route.ts`
- **Description**: Returns the recorded geographical coordinates and progression of the cyclone eye over its lifecycle.
- **Path Parameters**:
  - `id` *(required, string)*: Storm ID.
- **Response Structure**:
  ```json
  [
    {
      "timestamp": "2023-06-06T06:00:00Z",
      "lat": 11.9,
      "lon": 66.2,
      "wind_kt": 30,
      "pressure_hpa": 1000,
      "movement_direction": "N",
      "movement_speed": 5,
      "category": "DEPRESSION"
    }
  ]
  ```

#### `GET /api/storms/[id]/observations`
- **File**: `src/app/api/storms/[id]/observations/route.ts`
- **Description**: Returns granular chronological meteorological readings (surface buoys, radar fixations, and meteorological agency reports).
- **Path Parameters**:
  - `id` *(required, string)*: Storm ID.
- **Response Structure**:
  ```json
  [
    {
      "timestamp": "2023-06-06T06:00:00Z",
      "lat": 11.9,
      "lon": 66.2,
      "wind_kt": 30,
      "pressure_hpa": 1000,
      "source": "IMD",
      "nature": "DEPRESSION"
    }
  ]
  ```

#### `GET /api/storms/[id]/satellite`
- **File**: `src/app/api/storms/[id]/satellite/route.ts`
- **Description**: Retrieves satellite capture frames and imagery links associated with a given storm from the storm catalog.
- **Path Parameters**:
  - `id` *(required, string)*: Storm ID.
- **Response Structure**:
  ```json
  [
    {
      "timestamp": "2023-06-10T12:00:00Z",
      "satellite": "INSAT-3D",
      "channel": "IR",
      "imageUrl": "https://mosdac.gov.in/sample.jpg"
    }
  ]
  ```

---

### 3. Satellite Imagery & AI Analysis

#### `GET /api/satellite/[stormId]`
- **File**: `src/app/api/satellite/[stormId]/route.ts`
- **Description**: Dedicated satellite service endpoint retrieving multi-frame imagery for deep analysis.
- **Path Parameters**:
  - `stormId` *(required, string)*: Storm identifier.
- **Response Structure**: Array of satellite capture records with channel types and timestamps.

#### `GET /api/satellite/[stormId]/analysis`
- **File**: `src/app/api/satellite/[stormId]/analysis/route.ts`
- **Description**: Executes or returns precomputed computer vision pattern detection on cyclone satellite images.
- **Path Parameters**:
  - `stormId` *(required, string)*: Storm identifier. Returns HTTP `404` if no imagery is available.
- **Response Structure**:
  ```json
  {
    "scores": {
      "disturbance": 0.08,
      "organizing": 0.17,
      "organized_storm": 0.29,
      "mature_cyclone": 0.31,
      "weakening": 0.09,
      "dissipating": 0.02,
      "clear": 0.04
    },
    "dominantPattern": "mature_cyclone",
    "confidence": 0.84,
    "timestamp": "2023-06-12T18:00:00Z"
  }
  ```

---

### 4. ML Prediction & Trend Analysis

#### `GET /api/predictions/[stormId]`
- **File**: `src/app/api/predictions/[stormId]/route.ts`
- **Description**: Retrieves machine-learning generated track and intensity forecasts for the requested cyclone.
- **Path Parameters**:
  - `stormId` *(required, string)*: Storm identifier. Returns HTTP `404` if not found.
- **Response Structure**:
  ```json
  {
    "stormId": "2023-biparjoy",
    "forecastPoints": [
      {
        "hoursAhead": 12,
        "predictedLat": 23.1,
        "predictedLon": 67.5,
        "predictedWindKt": 85,
        "predictedPressureHpa": 965
      }
    ],
    "generatedAt": "2026-09-07T05:00:00Z"
  }
  ```

#### `GET /api/predictions/[stormId]/trend`
- **File**: `src/app/api/predictions/[stormId]/trend/route.ts`
- **Description**: Evaluates intensification or dissipation velocity, including rapid intensification (RI) indicators.
- **Path Parameters**:
  - `stormId` *(required, string)*: Storm identifier. Returns HTTP `404` if not found.
- **Response Structure**:
  ```json
  {
    "stormId": "2023-biparjoy",
    "trend": "rapid_intensification",
    "confidence": 0.88,
    "changeWind24h": 25,
    "changePressure24h": -20,
    "factors": {
      "sstWarmEnough": true,
      "lowVerticalWindShear": true,
      "highUpperTroposphericOutflow": true
    }
  }
  ```

---

## 📡 Data Providers & External Ingestion

The platform is designed to ingest data from multiple authoritative meteorological agencies:

1. **NOAA NHC & JTWC**: Global tropical cyclone advisories, active tracks, and best-track archives.
2. **IMD (India Meteorological Department)**: High-resolution tracking and bulletins for the North Indian Ocean, Arabian Sea, and Bay of Bengal.
3. **MOSDAC (ISRO / Space Applications Centre)**: Indian Geostationary Satellite (INSAT-3D/3DR) infrared, visible, and water vapor channels.
4. **StormSense Backend Integration**: Adapter layer (`src/lib/data/stormSenseAdapter.ts` & `src/lib/stormsense/service.ts`) capable of synchronizing with local mock storage or an external FastAPI service.

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the project root to configure external APIs:

```env
# Basemap tile API key (CARTO / MapLibre)
NEXT_PUBLIC_CARTO_API_KEY=your_carto_api_key

# Primary cyclone data provider (e.g., noaa, imd)
STORMSENSE_PROVIDER=noaa

# External agency APIs
MOSDAC_API_URL=https://mosdac.gov.in/api
IMD_API_URL=https://mausam.imd.gov.in/api

# Optional: Custom StormSense backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 💻 Getting Started

### Prerequisites
- **Node.js**: v18.18+ or v20+ recommended
- **Package Manager**: npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/DibyadyutiDas/tropicalcyclone.git
   cd tropicalcyclone
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to view the Windy Map interface.

---

## 📜 Scripts Reference

| Command | Action |
|---|---|
| `npm run dev` | Runs the development server with Next.js Turbopack |
| `npm run build` | Compiles and builds the production bundle |
| `npm run start` | Runs the compiled Next.js production server |
| `npm run lint` | Runs ESLint to check for code quality and type safety |
