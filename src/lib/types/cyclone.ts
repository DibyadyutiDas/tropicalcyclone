export type CycloneCategory =
  | 'Depression'
  | 'Deep Depression'
  | 'Cyclonic Storm'
  | 'Severe Cyclonic Storm'
  | 'Very Severe Cyclone'
  | 'Very Severe Cyclonic Storm'
  | 'Extremely Severe Cyclonic Storm'
  | 'Super Cyclonic Storm';

export type StormStage = 'Developing' | 'Organizing' | 'Mature' | 'Weakening';

export type AlertSeverity = 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN';

export interface ObservationPoint {
  id: string;
  timestamp: string;
  timeOffsetHours: number; // e.g. -24, -18, -12, -6, 0 (NOW), +6, +12, +24, +36
  lat: number;
  lng: number;
  windSpeedKnots: number;
  windSpeedKmh: number;
  pressureHpa: number;
  category: CycloneCategory;
  stage: StormStage;
  isForecast: boolean;
  uncertaintyRadiusKm?: number;
  movementSpeedKmh: number;
  movementHeadingDeg: number;
  movementHeadingText: string;
  satelliteImageRef?: string;
}

export interface SigLIPPatternScores {
  developing: number; // 0.0 - 1.0
  organizing: number;
  mature: number;
  weakening: number;
  dominantPattern: StormStage;
  confidence: number;
  eyeWallDefinition: number; // 0.0 - 1.0
  convectiveSymmetry: number; // 0.0 - 1.0
}

export interface TrendAnalysis {
  windDelta6h: number; // e.g. +15 knots
  pressureDelta6h: number; // e.g. -12 hPa
  organizationDelta6h: number; // +0.18
  trendStatus: 'Rapid Intensification' | 'Strengthening' | 'Steady' | 'Weakening' | 'Dissipating';
  trendDescription: string;
  dvorakTNumber: string; // e.g. "T4.5"
  ciNumber: string; // Current Intensity e.g. "4.5"
  estimatedEyeDiameterKm?: number;
}

export interface ModelPredictionInterval {
  timeOffset: string;
  hoursFromNow: number;
  windKnots: number;
  pressureHpa: number;
  category: CycloneCategory;
  expectedPattern: StormStage;
  lat: number;
  lng: number;
  uncertaintyRadiusKm: number;
}

export interface ModelPrediction {
  sourceModel: string;
  trainedDataset: string;
  predictedLandfallTime: string;
  predictedLandfallLocation: string;
  predictedLandfallDistanceKm: number;
  predictedLandfallIntensity: CycloneCategory;
  landfallProbabilityPct: number;
  expectedSurgeHeightMeters: number;
  forecastIntervals: ModelPredictionInterval[];
}

export interface SatelliteIntelligenceLayer {
  id: string;
  name: string;
  type: 'thermal_ir' | 'water_vapor' | 'visible_rgb' | 'gradcam_attention';
  sensor: string;
  satelliteName: string;
  timestamp: string;
  resolution: string;
  description: string;
  colormap: string;
}

export interface IMDBulletin {
  id: string;
  bulletinNo: string;
  issuedAt: string;
  headline: string;
  synopsis: string;
  windWarning: string;
  seaCondition: string;
  fishermenWarning: string;
  urgency: 'CRITICAL' | 'HIGH' | 'MODERATE';
}

export interface CoastalRiskAlert {
  id: string;
  region: string;
  state: string;
  surgeHeightMeters: number;
  windGustThreat: string;
  warningLevel: AlertSeverity;
  evacuationStatus: string;
  affectedPopulationEstimate: string;
  keyActionItem: string;
}

export interface XAIExplanation {
  primaryFeatures: {
    name: string;
    importance: number; // 0 - 100
    impact: 'Positive (Intensifying)' | 'Negative (Shearing)' | 'Neutral';
    description: string;
  }[];
  convectiveCoreEnergyScore: number;
  verticalWindShearKts: number;
  oceanHeatContentKj: number;
  seaSurfaceTempC: number;
  gradCamAttentionSummary: string;
}

export interface Storm {
  id: string;
  name: string;
  code: string;
  basin: string;
  status: 'LIVE' | 'MONITORED' | 'SIMULATION_REPLAY';
  activeSince: string;
  currentPoint: ObservationPoint;
  timeline: ObservationPoint[]; // past observations + now + forecast points
  patternScores: SigLIPPatternScores;
  trend: TrendAnalysis;
  prediction: ModelPrediction;
  xai: XAIExplanation;
  satelliteLayers: SatelliteIntelligenceLayer[];
  imdBulletins: IMDBulletin[];
  coastalAlerts: CoastalRiskAlert[];
}

export interface AgentToolCallLog {
  id: string;
  toolName: string;
  args: Record<string, unknown>;
  resultSnippet: string;
  executionTimeMs: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  toolCalls?: AgentToolCallLog[];
  structuredData?: {
    type: 'landfall_card' | 'telemetry_card' | 'alert_card' | 'trend_card' | 'xai_card';
    data: Record<string, unknown>;
  };
}
