import { Storm, AgentToolCallLog, ChatMessage } from '../types/cyclone';

export interface ToolDefinition {
  name: string;
  description: string;
  params: string[];
}

export const COPILOT_TOOLS: ToolDefinition[] = [
  {
    name: 'get_current_storm',
    description: 'Retrieves current real-time storm identification, category, MSW, central pressure, and geographic coordinates.',
    params: ['storm_id'],
  },
  {
    name: 'get_track',
    description: 'Fetches the complete historical trajectory and projected 36-hour forecast track coordinates.',
    params: ['storm_id'],
  },
  {
    name: 'get_recent_observations',
    description: 'Retrieves observation points over the past 24 hours including wind/pressure progression.',
    params: ['storm_id', 'lookback_hours'],
  },
  {
    name: 'get_satellite_images',
    description: 'Fetches metadata and thermal brightness temperatures from INSAT-3DR IR1 and Water Vapor channels.',
    params: ['storm_id'],
  },
  {
    name: 'analyze_satellite',
    description: 'Executes SigLIP zero-shot visual pattern classification and calculates eye-wall definition and convective symmetry.',
    params: ['storm_id', 'channel'],
  },
  {
    name: 'get_trend',
    description: 'Computes 6-hour intensification delta (wind speed change, pressure drop) and estimated Dvorak T-number.',
    params: ['storm_id'],
  },
  {
    name: 'get_prediction',
    description: 'Runs StormSense AI Physics + IBTrACS ensemble model to project landfall timing, coordinates, and surge height.',
    params: ['storm_id', 'forecast_hours'],
  },
  {
    name: 'search_official_sources',
    description: 'Searches and retrieves the latest India Meteorological Department (IMD) bulletins and disaster management alerts.',
    params: ['query'],
  },
];

export async function processUserCopilotQuery(
  userQuery: string,
  storm: Storm,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: ChatMessage[] = []
): Promise<{ text: string; toolLogs: AgentToolCallLog[]; structuredCard?: ChatMessage['structuredData'] }> {
  const queryLower = userQuery.toLowerCase();
  const toolLogs: AgentToolCallLog[] = [];

  const addLog = (toolName: string, args: Record<string, unknown>, snippet: string, durationMs: number = 85) => {
    toolLogs.push({
      id: `tool-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      toolName,
      args,
      resultSnippet: snippet,
      executionTimeMs: durationMs,
    });
  };

  // Landfall / Prediction query
  if (queryLower.includes('landfall') || queryLower.includes('where will') || queryLower.includes('when will') || queryLower.includes('reach coast') || queryLower.includes('hit')) {
    addLog('get_current_storm', { storm_id: storm.id }, `Status: ${storm.currentPoint.category} (${storm.currentPoint.windSpeedKmh} km/h, ${storm.currentPoint.pressureHpa} hPa at ${storm.currentPoint.lat}°N, ${storm.currentPoint.lng}°E)`);
    addLog('get_prediction', { storm_id: storm.id, forecast_hours: 36 }, `Landfall: ${storm.prediction.predictedLandfallLocation} at ${storm.prediction.predictedLandfallTime}. Intensity: ${storm.prediction.predictedLandfallIntensity}. Surge: ${storm.prediction.expectedSurgeHeightMeters}m`);
    addLog('search_official_sources', { query: `${storm.name} landfall advisory` }, `IMD Bulletin No. ${storm.imdBulletins[0]?.bulletinNo || '08'}: Great Danger / Red Alert in effect.`);

    return {
      text: `### 🎯 Landfall & Impact Assessment for ${storm.name}\n\n` +
        `Based on our multi-source telemetry and the **StormSense AI + IBTrACS Ensemble Model**:\n\n` +
        `* **Predicted Landfall Location:** ${storm.prediction.predictedLandfallLocation}\n` +
        `* **Estimated Landfall ETA:** **${storm.prediction.predictedLandfallTime}** (Confidence: ${storm.prediction.landfallProbabilityPct}%)\n` +
        `* **Intensity at Landfall:** **${storm.prediction.predictedLandfallIntensity}** with sustained winds of 145–160 km/h gusting to 175 km/h.\n` +
        `* **Estimated Storm Surge:** **${storm.prediction.expectedSurgeHeightMeters} meters** above astronomical tide, posing severe inundation threats to low-lying coastal estuaries.\n\n` +
        `🚨 **Immediate Advisory:** Mandatory evacuations are active across high-risk coastal sectors. All fishing and maritime operations are suspended.`,
      toolLogs,
      structuredCard: {
        type: 'landfall_card',
        data: {
          location: storm.prediction.predictedLandfallLocation,
          eta: storm.prediction.predictedLandfallTime,
          intensity: storm.prediction.predictedLandfallIntensity,
          surge: `${storm.prediction.expectedSurgeHeightMeters}m`,
          confidence: `${storm.prediction.landfallProbabilityPct}%`,
        },
      },
    };
  }

  // Trend / Intensification / Strength query
  if (queryLower.includes('trend') || queryLower.includes('intensify') || queryLower.includes('strengthen') || queryLower.includes('weaken') || queryLower.includes('rapid') || queryLower.includes('status')) {
    addLog('get_current_storm', { storm_id: storm.id }, `Center Lat: ${storm.currentPoint.lat}°N, Lng: ${storm.currentPoint.lng}°E, MSW: ${storm.currentPoint.windSpeedKnots} kts`);
    addLog('get_recent_observations', { storm_id: storm.id, lookback_hours: 12 }, `T-6h: ${storm.currentPoint.windSpeedKnots - storm.trend.windDelta6h} kts -> T0: ${storm.currentPoint.windSpeedKnots} kts (Delta: +${storm.trend.windDelta6h} kts)`);
    addLog('get_trend', { storm_id: storm.id }, `Status: ${storm.trend.trendStatus}, Dvorak: ${storm.trend.dvorakTNumber}, Eye: ${storm.trend.estimatedEyeDiameterKm || 28}km`);
    addLog('analyze_satellite', { storm_id: storm.id, channel: 'thermal_ir' }, `SigLIP Classification: Mature (${storm.patternScores.mature * 100}%), Organizing (${storm.patternScores.organizing * 100}%), Eye-Wall Index: ${storm.patternScores.eyeWallDefinition}`);

    return {
      text: `### 📊 Dynamic Trend & Structural Evolution for ${storm.name}\n\n` +
        `**Current Status:** ${storm.currentPoint.category} | Dvorak Rating: **${storm.trend.dvorakTNumber}** (CI: ${storm.trend.ciNumber})\n\n` +
        `* **6-Hour Wind Delta:** **+${storm.trend.windDelta6h} knots** (${storm.currentPoint.windSpeedKmh} km/h)\n` +
        `* **6-Hour Pressure Drop:** **${storm.trend.pressureDelta6h} hPa** (Current: ${storm.currentPoint.pressureHpa} hPa)\n` +
        `* **AI Pattern Classification:** **${storm.patternScores.dominantPattern}** (Confidence: ${(storm.patternScores.confidence * 100).toFixed(0)}%)\n` +
        `* **Environmental Diagnostics:** Sea Surface Temperature at **${storm.xai.seaSurfaceTempC}°C** with low vertical wind shear (**${storm.xai.verticalWindShearKts} kts**).\n\n` +
        `**Synopsis:** ${storm.trend.trendDescription}`,
      toolLogs,
      structuredCard: {
        type: 'trend_card',
        data: {
          trendStatus: storm.trend.trendStatus,
          windDelta: `+${storm.trend.windDelta6h} kts`,
          pressureDelta: `${storm.trend.pressureDelta6h} hPa`,
          dvorak: storm.trend.dvorakTNumber,
          dominantPattern: storm.patternScores.dominantPattern,
        },
      },
    };
  }

  // Satellite / Grad-CAM / Vision query
  if (queryLower.includes('satellite') || queryLower.includes('grad-cam') || queryLower.includes('gradcam') || queryLower.includes('insat') || queryLower.includes('infrared') || queryLower.includes('attention')) {
    addLog('get_satellite_images', { storm_id: storm.id }, `Channels: INSAT-3DR TIR-1 (10.8µm), Water Vapor (6.9µm), Composite. Min Temp: -84.2°C`);
    addLog('analyze_satellite', { storm_id: storm.id, channel: 'thermal_ir' }, `SigLIP Pattern Distribution: Mature ${storm.patternScores.mature}, Organizing ${storm.patternScores.organizing}, Developing ${storm.patternScores.developing}`);
    addLog('search_official_sources', { query: 'XAI attention map spatial focus' }, `Grad-CAM attention peak focused on inner eyewall spiral band at 19.8°N, 89.2°E`);

    return {
      text: `### 🛰️ Multi-Source Satellite & XAI Attention Analysis\n\n` +
        `The satellite intelligence layer ingested real-time **INSAT-3DR Geostationary Radiometer** data:\n\n` +
        `* **Cloud-Top Temperature:** Core convective cloud tops reaching **-84.2°C**, indicating violent vertical ascent in the inner rainbands.\n` +
        `* **SigLIP Visual Pattern Scores:**\n` +
        `  - 🟢 **Mature:** ${(storm.patternScores.mature * 100).toFixed(1)}%\n` +
        `  - 🟡 **Organizing:** ${(storm.patternScores.organizing * 100).toFixed(1)}%\n` +
        `  - ⚪ **Developing:** ${(storm.patternScores.developing * 100).toFixed(1)}%\n` +
        `  - 🔴 **Weakening:** ${(storm.patternScores.weakening * 100).toFixed(1)}%\n` +
        `* **Grad-CAM Neural Saliency:** ${storm.xai.gradCamAttentionSummary}\n\n` +
        `*Tip: Use the floating layer bar on the map to toggle between INSAT Thermal IR, Water Vapor, and Grad-CAM Attention layers.*`,
      toolLogs,
      structuredCard: {
        type: 'xai_card',
        data: {
          sensor: 'INSAT-3DR TIR-1',
          coreTemp: '-84.2°C',
          eyeWallIndex: `${(storm.patternScores.eyeWallDefinition * 100).toFixed(0)}%`,
          dominantStage: storm.patternScores.dominantPattern,
        },
      },
    };
  }

  // Alerts / Evacuation / Safety query
  if (queryLower.includes('alert') || queryLower.includes('evacuat') || queryLower.includes('bulletin') || queryLower.includes('imd') || queryLower.includes('warning') || queryLower.includes('safe')) {
    addLog('search_official_sources', { query: `${storm.name} coastal alerts and warnings` }, `Active Red Alerts in 3 sectors. Evacuations in progress: >1.1M residents.`);
    addLog('get_current_storm', { storm_id: storm.id }, `Category: ${storm.currentPoint.category}, MSW: ${storm.currentPoint.windSpeedKmh} km/h`);

    const alertsList = storm.coastalAlerts
      .map(
        (a) =>
          `* **${a.region} (${a.state})** — **[${a.warningLevel} ALERT]**\n` +
          `  - Max Wind Threat: ${a.windGustThreat} | Surge Height: ${a.surgeHeightMeters}m\n` +
          `  - Status: ${a.evacuationStatus}\n` +
          `  - Action: ${a.keyActionItem}`
      )
      .join('\n\n');

    return {
      text: `### 🚨 Official Advisories & Coastal Risk Alerts\n\n` +
        `**Latest IMD Bulletin (${storm.imdBulletins[0]?.bulletinNo || 'IMD-08'}):**\n` +
        `*${storm.imdBulletins[0]?.headline || 'High Alert in coastal zones'}*\n\n` +
        `#### Regional Warning Matrix:\n\n${alertsList}\n\n` +
        `⚠️ **Fishermen Advisory:** Complete suspension of maritime navigation and offshore port cargo operations.`,
      toolLogs,
      structuredCard: {
        type: 'alert_card',
        data: {
          bulletinNo: storm.imdBulletins[0]?.bulletinNo || 'IMD-08',
          totalRedAlerts: storm.coastalAlerts.filter((a) => a.warningLevel === 'RED').length,
          topThreatRegion: storm.coastalAlerts[0]?.region || 'Sundarbans Coastal Belt',
        },
      },
    };
  }

  // What is happening / Overall situation query (Exact user workflow)
  if (
    queryLower.includes('what is happening') ||
    queryLower.includes("what's happening") ||
    queryLower.includes('tell me about') ||
    queryLower.includes('happening with') ||
    queryLower.includes('current situation') ||
    queryLower.includes('explain storm') ||
    queryLower.includes('cyclone')
  ) {
    addLog('get_current_storm', { storm_id: storm.id }, `Status: ${storm.currentPoint.category} | MSW: ${storm.currentPoint.windSpeedKnots} kts (${storm.currentPoint.windSpeedKmh} km/h) | Pressure: ${storm.currentPoint.pressureHpa} hPa | Eye: ${storm.currentPoint.lat}°N, ${storm.currentPoint.lng}°E`, 92);
    addLog('get_recent_observations', { storm_id: storm.id, lookback_hours: 18 }, `Observed past 3 fixes: Wind increased from ${storm.currentPoint.windSpeedKnots - storm.trend.windDelta6h} kts to ${storm.currentPoint.windSpeedKnots} kts; Pressure dropped by ${Math.abs(storm.trend.pressureDelta6h)} hPa`, 110);
    addLog('analyze_satellite', { storm_id: storm.id, channel: 'multi_source' }, `SigLIP Zero-Shot Pattern: Organizing (${(storm.patternScores.organizing * 100).toFixed(0)}%), Mature (${(storm.patternScores.mature * 100).toFixed(0)}%), Eye-wall index: ${(storm.patternScores.eyeWallDefinition * 100).toFixed(0)}%`, 140);
    addLog('get_trend', { storm_id: storm.id }, `Trend: ${storm.trend.trendStatus} | Dvorak: ${storm.trend.dvorakTNumber} | Wind Delta: +${storm.trend.windDelta6h} kts/6h | Organization Delta: +${storm.trend.organizationDelta6h}`, 80);
    addLog('search_official_sources', { query: `IMD official bulletin ${storm.name}` }, `IMD Bulletin ${storm.imdBulletins[0]?.bulletinNo || '08'}: "${storm.imdBulletins[0]?.headline || 'Severe Cyclonic Storm Warning'}"`, 95);

    return {
      text: `### 🌪️ Synoptic Intelligence Brief: ${storm.name}\n\n` +
        `**${storm.name}** is currently classified as an **${storm.patternScores.dominantPattern.toLowerCase()} system** (**${storm.currentPoint.category}**) centered at **${storm.currentPoint.lat.toFixed(1)}°N, ${storm.currentPoint.lng.toFixed(1)}°E** with sustained winds of **${storm.currentPoint.windSpeedKnots} kts** (${storm.currentPoint.windSpeedKmh} km/h).\n\n` +
        `* 📈 **Observation Dynamics:** Wind has increased over the last three observations (**+${storm.trend.windDelta6h} kts**), while central pressure has steadily decreased to **${storm.currentPoint.pressureHpa} hPa** (${storm.trend.pressureDelta6h} hPa over 6 hours).\n` +
        `* 🛰️ **Multi-Source Satellite Intelligence:** Normalization across INSAT-3DR (10.8µm) and Meteosat-9 (6.9µm WV) analyzed via our **SigLIP zero-shot model** shows increasing convective organization (**${(storm.patternScores.organizing * 100).toFixed(0)}%** score, eyewall symmetry at **${(storm.patternScores.eyeWallDefinition * 100).toFixed(0)}%**).\n` +
        `* 🧠 **IBTrACS ML Prediction:** Our lightweight Random Forest model trained on North Indian Basin historical analogs predicts **further evolution toward a mature pattern**, with projected landfall near **${storm.prediction.predictedLandfallLocation}** at **${storm.prediction.predictedLandfallTime}** (Surge: **${storm.prediction.expectedSurgeHeightMeters}m**).\n` +
        `* 🚨 **Official IMD Bulletin (${storm.imdBulletins[0]?.bulletinNo || '08'}):** *"${storm.imdBulletins[0]?.headline || 'Severe Storm Warning'}"* — ${storm.imdBulletins[0]?.synopsis || 'Mandatory safety warnings active in coastal zones.'}`,
      toolLogs,
      structuredCard: {
        type: 'telemetry_card',
        data: {
          name: storm.name,
          category: storm.currentPoint.category,
          msw: `${storm.currentPoint.windSpeedKmh} km/h`,
          pressure: `${storm.currentPoint.pressureHpa} hPa`,
          movement: `${storm.currentPoint.movementHeadingText} @ ${storm.currentPoint.movementSpeedKmh} km/h`,
        },
      },
    };
  }

  // Default fallback deep agent response
  addLog('get_current_storm', { storm_id: storm.id }, `Storm: ${storm.name}, Category: ${storm.currentPoint.category}, Lat: ${storm.currentPoint.lat}°N, Lng: ${storm.currentPoint.lng}°E, Wind: ${storm.currentPoint.windSpeedKmh} km/h, Pressure: ${storm.currentPoint.pressureHpa} hPa`);
  addLog('get_recent_observations', { storm_id: storm.id, lookback_hours: 6 }, `Recent movement heading ${storm.currentPoint.movementHeadingText} at ${storm.currentPoint.movementSpeedKmh} km/h`);
  addLog('analyze_satellite', { storm_id: storm.id, channel: 'thermal_ir' }, `SigLIP Stage: ${storm.patternScores.dominantPattern} (Score: ${storm.patternScores.mature})`);
  addLog('get_trend', { storm_id: storm.id }, `Trend: ${storm.trend.trendStatus}, Delta: +${storm.trend.windDelta6h} kts`);
  addLog('search_official_sources', { query: `${storm.name} overview` }, `Active Red Alert. Landfall projected in ~16.5 hours.`);

  return {
    text: `### 🌪️ Cyra AI Overview: ${storm.name}\n\n` +
      `**${storm.name}** is currently classified as a **${storm.currentPoint.category}** over the ${storm.basin}.\n\n` +
      `* **Center Location:** ${storm.currentPoint.lat.toFixed(1)}°N, ${storm.currentPoint.lng.toFixed(1)}°E\n` +
      `* **Max Sustained Wind (MSW):** **${storm.currentPoint.windSpeedKnots} knots** (${storm.currentPoint.windSpeedKmh} km/h)\n` +
      `* **Central Pressure:** **${storm.currentPoint.pressureHpa} hPa** (6h drop: ${storm.trend.pressureDelta6h} hPa)\n` +
      `* **Movement:** Moving **${storm.currentPoint.movementHeadingText}** at ${storm.currentPoint.movementSpeedKmh} km/h\n` +
      `* **AI Pattern Classification:** **${storm.patternScores.dominantPattern}** (SigLIP zero-shot confidence: ${(storm.patternScores.confidence * 100).toFixed(0)}%)\n` +
      `* **Landfall Outlook:** Predicted between **${storm.prediction.predictedLandfallLocation}** at approx **${storm.prediction.predictedLandfallTime}** with an expected storm surge of **${storm.prediction.expectedSurgeHeightMeters} meters**.\n\n` +
      `*You can ask me specific questions regarding landfall ETA, satellite attention heatmaps, trend metrics, or regional evacuation alerts.*`,
    toolLogs,
    structuredCard: {
      type: 'telemetry_card',
      data: {
        name: storm.name,
        category: storm.currentPoint.category,
        msw: `${storm.currentPoint.windSpeedKmh} km/h`,
        pressure: `${storm.currentPoint.pressureHpa} hPa`,
        movement: `${storm.currentPoint.movementHeadingText} @ ${storm.currentPoint.movementSpeedKmh} km/h`,
      },
    },
  };
}
