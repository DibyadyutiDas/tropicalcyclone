import { Storm, ObservationPoint, CycloneCategory, StormStage, TrendAnalysis, ModelPrediction } from '../types/cyclone';
import { MOCK_STORMS } from './mockStorms';
import { allStorms } from '../stormsense/data';
import type { Storm as SSStorm, TrackPoint as SSTrackPoint, Observation as SSObservation } from '../types';

// Map StormSense category string to Windy CycloneCategory
export function toWindyCategory(raw?: string, windKnots: number = 0): CycloneCategory {
  if (!raw) {
    if (windKnots >= 120) return 'Super Cyclonic Storm';
    if (windKnots >= 90) return 'Extremely Severe Cyclonic Storm';
    if (windKnots >= 64) return 'Very Severe Cyclonic Storm';
    if (windKnots >= 48) return 'Severe Cyclonic Storm';
    if (windKnots >= 34) return 'Cyclonic Storm';
    if (windKnots >= 28) return 'Deep Depression';
    return 'Depression';
  }

  const s = raw.toUpperCase().replace(/\s+/g, '_');
  if (s.includes('SUPER')) return 'Super Cyclonic Storm';
  if (s.includes('EXTREMELY')) return 'Extremely Severe Cyclonic Storm';
  if (s.includes('VERY_SEVERE') || s.includes('VSCS')) return 'Very Severe Cyclonic Storm';
  if (s.includes('SEVERE') || s.includes('SCS')) return 'Severe Cyclonic Storm';
  if (s.includes('CYCLONIC') || s.includes('CYCLONE') || s.includes('CS')) return 'Cyclonic Storm';
  if (s.includes('DEEP') || s.includes('DD')) return 'Deep Depression';
  return 'Depression';
}

function parseHeadingToDegrees(direction?: string): number {
  if (!direction) return 35;
  const d = direction.toLowerCase().replace(/[^a-z]/g, '');
  if (d.includes('nne')) return 22;
  if (d.includes('ene')) return 67;
  if (d.includes('ese')) return 112;
  if (d.includes('sse')) return 157;
  if (d.includes('ssw')) return 202;
  if (d.includes('wsw')) return 247;
  if (d.includes('wnw')) return 292;
  if (d.includes('nnw')) return 337;
  if (d.includes('ne')) return 45;
  if (d.includes('se')) return 135;
  if (d.includes('sw')) return 225;
  if (d.includes('nw')) return 315;
  if (d.includes('north')) return 0;
  if (d.includes('east')) return 90;
  if (d.includes('south')) return 180;
  if (d.includes('west')) return 270;
  return 30;
}

function formatHeadingText(deg: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const idx = Math.round(deg / 22.5) % 16;
  const dir = dirs[idx] || 'N';
  return `${dir} (${String(Math.round(deg)).padStart(3, '0')}°)`;
}

function determineStage(windKnots: number, isForecast: boolean): StormStage {
  if (isForecast && windKnots < 40) return 'Weakening';
  if (windKnots >= 64) return 'Mature';
  if (windKnots >= 34) return 'Organizing';
  return 'Developing';
}

export function convertStormSenseSeedToWindyStorm(seed: {
  storm: SSStorm;
  track: SSTrackPoint[];
  observations?: SSObservation[];
  forecast_track?: SSTrackPoint[];
  bounds?: [number, number, number, number];
}): Storm {
  const { storm, track = [], observations = [], forecast_track = [] } = seed;
  const totalPoints = [...track];

  // If track is empty, use observations
  if (totalPoints.length === 0 && observations.length > 0) {
    for (const ob of observations) {
      totalPoints.push({
        timestamp: ob.timestamp,
        lat: ob.lat,
        lon: ob.lon,
        wind_kt: ob.wind_kt ?? ob.windSpeed ?? 0,
        pressure_hpa: ob.pressure_hpa ?? ob.pressure ?? 1000,
        movement_direction: ob.movement_direction || 'north',
        movement_speed: ob.movement_speed ?? 10,
        category: ob.nature,
      });
    }
  }

  // Combine track and forecast track
  const allRawPoints = [
    ...totalPoints.map((p) => ({ ...p, forecast: false })),
    ...forecast_track.map((p) => ({ ...p, forecast: true })),
  ];

  // Sort chronologically
  allRawPoints.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Find latest historical / now point index
  const nowIndex = allRawPoints.filter((p) => !p.forecast).length - 1;
  const referenceTime =
    nowIndex >= 0 && allRawPoints[nowIndex]
      ? new Date(allRawPoints[nowIndex].timestamp).getTime()
      : new Date().getTime();

  const timeline: ObservationPoint[] = allRawPoints.map((pt, i) => {
    const ptTime = new Date(pt.timestamp).getTime();
    const diffHours = Math.round((ptTime - referenceTime) / (1000 * 60 * 60));
    const wind = pt.wind_kt ?? pt.windSpeed ?? storm.wind_kt ?? 45;
    const headingDeg = parseHeadingToDegrees(pt.movement_direction || storm.movement_direction);
    const cat = toWindyCategory(pt.category || storm.category, wind);
    const isForecast = pt.forecast || diffHours > 0;

    return {
      id: `pt-${storm.id}-${i}`,
      timestamp: pt.timestamp.replace('T', ' ').replace(':00Z', ' UTC').replace('Z', ' UTC'),
      timeOffsetHours: diffHours,
      lat: pt.lat,
      lng: pt.lon,
      windSpeedKnots: Math.round(wind),
      windSpeedKmh: Math.round(wind * 1.852),
      pressureHpa: pt.pressure_hpa ?? pt.pressure ?? storm.pressure_hpa ?? 990,
      category: cat,
      stage: determineStage(wind, isForecast),
      isForecast: isForecast,
      uncertaintyRadiusKm: isForecast ? Math.max(38, 30 + Math.abs(diffHours) * 3.8) : undefined,
      movementSpeedKmh: Math.round((pt.movement_speed ?? storm.movement_speed ?? 8) * 1.852),
      movementHeadingDeg: headingDeg,
      movementHeadingText: formatHeadingText(headingDeg),
    };
  });

  // Ensure current point exists
  const currentPoint: ObservationPoint =
    timeline.find((p) => p.timeOffsetHours === 0) ||
    timeline[nowIndex] ||
    timeline[0] || {
      id: `pt-${storm.id}-now`,
      timestamp: storm.timestamp || new Date().toISOString(),
      timeOffsetHours: 0,
      lat: storm.lat,
      lng: storm.lon,
      windSpeedKnots: Math.round(storm.wind_kt ?? 45),
      windSpeedKmh: Math.round((storm.wind_kt ?? 45) * 1.852),
      pressureHpa: storm.pressure_hpa ?? 990,
      category: toWindyCategory(storm.category, storm.wind_kt),
      stage: 'Mature',
      isForecast: false,
      movementSpeedKmh: Math.round((storm.movement_speed ?? 8) * 1.852),
      movementHeadingDeg: parseHeadingToDegrees(storm.movement_direction),
      movementHeadingText: formatHeadingText(parseHeadingToDegrees(storm.movement_direction)),
    };

  // Trend
  const prevPoint = timeline[Math.max(0, nowIndex - 1)];
  const windDelta = prevPoint ? currentPoint.windSpeedKnots - prevPoint.windSpeedKnots : 5;
  const pressureDelta = prevPoint ? currentPoint.pressureHpa - prevPoint.pressureHpa : -4;

  const trendStatus =
    windDelta >= 15
      ? 'Rapid Intensification'
      : windDelta > 0
      ? 'Strengthening'
      : windDelta === 0
      ? 'Steady'
      : 'Weakening';

  const trend: TrendAnalysis = {
    windDelta6h: windDelta,
    pressureDelta6h: pressureDelta,
    organizationDelta6h: windDelta > 0 ? 0.12 : -0.05,
    trendStatus,
    trendDescription:
      windDelta >= 15
        ? 'Rapid Intensification phase detected via core convective deepening.'
        : windDelta > 0
        ? 'Sustained intensification supported by high SST and low vertical shear.'
        : 'System tracking with steady central pressure and symmetric outflow.',
    dvorakTNumber: currentPoint.windSpeedKnots >= 100 ? 'T6.0' : currentPoint.windSpeedKnots >= 65 ? 'T4.5' : 'T3.0',
    ciNumber: currentPoint.windSpeedKnots >= 100 ? '6.0' : currentPoint.windSpeedKnots >= 65 ? '4.5' : '3.0',
    estimatedEyeDiameterKm: currentPoint.windSpeedKnots >= 65 ? 24 : undefined,
  };

  // Landfall estimation
  const landfallPoint = timeline.find((p) => p.isForecast && p.timeOffsetHours > 0);
  const landfall = landfallPoint
    ? {
        estimatedTime: landfallPoint.timestamp,
        location: `${storm.subbasin || storm.basin || 'Coastal'} Sector (${landfallPoint.lat.toFixed(1)}°N, ${landfallPoint.lng.toFixed(1)}°E)`,
        distanceKm: Math.round(Math.max(60, 180 - landfallPoint.timeOffsetHours * 4)),
      }
    : undefined;

  // Model Prediction
  const modelPrediction: ModelPrediction = {
    sourceModel: 'IMD-GFS & SigLIP-AI Ensemble',
    trainedDataset: 'IBTrACS v04r00 (North Indian Ocean 1982-2024)',
    predictedLandfallTime: landfallPoint ? landfallPoint.timestamp : 'Within 36 hours',
    predictedLandfallLocation: landfall ? landfall.location : 'Eastern Coastline',
    predictedLandfallDistanceKm: landfall ? landfall.distanceKm : 140,
    predictedLandfallIntensity: currentPoint.category,
    landfallProbabilityPct: 88,
    expectedSurgeHeightMeters: currentPoint.windSpeedKnots >= 100 ? 4.5 : 2.2,
    forecastIntervals: timeline
      .filter((p) => p.isForecast)
      .map((p) => ({
        timeOffset: `+${p.timeOffsetHours}h`,
        hoursFromNow: p.timeOffsetHours,
        windKnots: p.windSpeedKnots,
        pressureHpa: p.pressureHpa,
        category: p.category,
        expectedPattern: p.stage,
        lat: p.lat,
        lng: p.lng,
        uncertaintyRadiusKm: p.uncertaintyRadiusKm || 45,
      })),
  };

  return {
    id: storm.id,
    name: storm.name.toUpperCase(),
    code: storm.sid || storm.id.toUpperCase(),
    basin: storm.subbasin ? `${storm.basin || 'North Indian Ocean'} (${storm.subbasin})` : storm.basin || 'North Indian Ocean',
    status: storm.status === 'live' || storm.status === 'Active' ? 'LIVE' : 'MONITORED',
    activeSince: storm.startTime ? storm.startTime.replace('T', ' ').replace('Z', ' UTC') : timeline[0]?.timestamp || '2024',
    currentPoint,
    timeline,
    trend,
    prediction: modelPrediction,
    patternScores: {
      developing: currentPoint.windSpeedKnots < 40 ? 0.72 : 0.08,
      organizing: currentPoint.windSpeedKnots >= 40 && currentPoint.windSpeedKnots < 64 ? 0.78 : 0.12,
      mature: currentPoint.windSpeedKnots >= 64 ? 0.88 : 0.05,
      weakening: 0.04,
      dominantPattern: currentPoint.stage,
      confidence: 0.91,
      eyeWallDefinition: currentPoint.windSpeedKnots >= 64 ? 0.82 : 0.25,
      convectiveSymmetry: currentPoint.windSpeedKnots >= 64 ? 0.85 : 0.45,
    },
    xai: {
      primaryFeatures: [
        { name: 'Core Convective Cloud Top Temp', importance: 88, impact: 'Positive (Intensifying)', description: 'T-number expansion with deep cold tops <-78°C' },
        { name: 'Vertical Wind Shear', importance: 82, impact: 'Positive (Intensifying)', description: 'Favorable low shear zone (8-12 kts)' },
        { name: 'Tropical Cyclone Heat Potential', importance: 74, impact: 'Positive (Intensifying)', description: 'High oceanic thermal energy > 95 kJ/cm²' },
      ],
      convectiveCoreEnergyScore: 88,
      verticalWindShearKts: 10,
      oceanHeatContentKj: 102,
      seaSurfaceTempC: 30.8,
      gradCamAttentionSummary: 'Attention map highlights concentrated symmetric eyewall convection.',
    },
    satelliteLayers: [
      {
        id: `sat-ir-${storm.id}`,
        name: 'INSAT-3DR Thermal IR-1',
        type: 'thermal_ir',
        sensor: 'Imager Channel 10.8µm',
        satelliteName: 'INSAT-3DR (GEO 74.0°E)',
        timestamp: currentPoint.timestamp,
        resolution: '4.0 km Rapid-Scan',
        description: 'Deep convective cloud top brightness temperature analysis.',
        colormap: 'Enhanced BD-Curve (IMD Standard)',
      },
    ],
    imdBulletins: [
      {
        id: `bul-${storm.id}-01`,
        bulletinNo: 'BOB/01/2026/08',
        issuedAt: currentPoint.timestamp,
        headline: `${storm.name.toUpperCase()} TRACKED ACROSS NORTH INDIAN OCEAN`,
        synopsis: `The cyclonic system was centered at ${currentPoint.lat}°N, ${currentPoint.lng}°E moving ${currentPoint.movementHeadingText} with maximum sustained surface wind speed of ${currentPoint.windSpeedKnots} knots.`,
        windWarning: `Squally wind speed reaching ${currentPoint.windSpeedKnots}-${currentPoint.windSpeedKnots + 15} kmph gusting to ${currentPoint.windSpeedKnots + 25} kmph prevailing over central and adjoining sea areas.`,
        seaCondition: currentPoint.windSpeedKnots >= 64 ? 'Phenomenal / High' : 'Very Rough',
        fishermenWarning: 'Total suspension of fishing operations in the core storm area.',
        urgency: currentPoint.windSpeedKnots >= 64 ? 'CRITICAL' : 'HIGH',
      },
    ],
    coastalAlerts: [
      {
        id: `alert-${storm.id}`,
        region: storm.subbasin || 'Coastal Belt',
        state: storm.subbasin?.includes('Arabian') ? 'Gujarat & Maharashtra' : 'Odisha & West Bengal',
        surgeHeightMeters: currentPoint.windSpeedKnots >= 100 ? 4.5 : 2.0,
        windGustThreat: `${currentPoint.windSpeedKnots + 20} kts Gale Force`,
        warningLevel: currentPoint.windSpeedKnots >= 64 ? 'RED' : 'ORANGE',
        evacuationStatus: currentPoint.windSpeedKnots >= 64 ? 'Phase-1 Evacuation Active' : 'Advisory Issued',
        affectedPopulationEstimate: '1.8M Coastal Residents',
        keyActionItem: 'Move to cyclone shelters; suspend offshore maritime operations.',
      },
    ],
  };
}

// Combine hardcoded MOCK_STORMS with all 15 North Indian Ocean storms
export function getAllWindyStorms(): Storm[] {
  const combinedMap = new Map<string, Storm>();

  // Add mock storms
  for (const ms of MOCK_STORMS) {
    combinedMap.set(ms.id, ms);
  }

  // Convert and add all StormSense storms (Amphan, Fani, Tauktae, Mocha, Biparjoy, Remal, Dana, etc.)
  for (const seed of allStorms) {
    const ws = convertStormSenseSeedToWindyStorm(seed);
    combinedMap.set(ws.id, ws);
  }

  return Array.from(combinedMap.values());
}

// Fetch live storms from /api/storms and convert any active NOAA storms
export async function fetchLiveWindyStorms(): Promise<Storm[]> {
  try {
    const res = await fetch('/api/storms');
    if (!res.ok) return getAllWindyStorms();
    const data: SSStorm[] = await res.json();
    if (!Array.isArray(data)) return getAllWindyStorms();

    const staticAll = getAllWindyStorms();
    const staticMap = new Map<string, Storm>(staticAll.map((s) => [s.id, s]));

    // Check for any storms from API that might be newly active (e.g. live NOAA storms)
    for (const ss of data) {
      if (!staticMap.has(ss.id)) {
        try {
          const trackRes = await fetch(`/api/storms/${ss.id}/track`);
          const trackData = trackRes.ok ? await trackRes.json() : [];
          const converted = convertStormSenseSeedToWindyStorm({
            storm: ss,
            track: trackData,
          });
          staticMap.set(converted.id, converted);
        } catch {
          const converted = convertStormSenseSeedToWindyStorm({
            storm: ss,
            track: [],
          });
          staticMap.set(converted.id, converted);
        }
      }
    }

    return Array.from(staticMap.values());
  } catch {
    return getAllWindyStorms();
  }
}
