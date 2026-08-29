'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Storm, ObservationPoint } from '@/lib/types/cyclone';
import { WindyActiveLayers } from '@/components/windy/WindyLayerBar';
import { SpotPickerData } from '@/components/windy/WindySpotPicker';
import { WindParticleCanvas } from './WindParticleCanvas';
import {
  Compass,
  Minus,
  Plus,
} from 'lucide-react';

const DEFAULT_LAYERS: WindyActiveLayers = {
  windParticles: true,
  rainRadar: false,
  thermalIR: false,
  waterVapor: false,
  waves: false,
  pressure: true,
  gradCam: false,
  trackAndCone: true,
  satelliteBasemap: false,
};

interface CycloneMapProps {
  storm: Storm;
  activePoint: ObservationPoint;
  onSelectPoint?: (point: ObservationPoint) => void;
  layers?: WindyActiveLayers;
  onToggleLayer?: (key: keyof WindyActiveLayers) => void;
  onMapClickSpot?: (data: SpotPickerData | null) => void;
}

// Generate smooth polygon for Cone of Uncertainty
function generateUncertaintyConePolygon(points: ObservationPoint[]): GeoJSON.Feature<GeoJSON.Polygon> | null {
  const forecastPoints = points.filter((p) => p.timeOffsetHours >= 0);
  if (forecastPoints.length < 2) return null;

  const leftPoints: [number, number][] = [];
  const rightPoints: [number, number][] = [];

  for (let i = 0; i < forecastPoints.length; i++) {
    const pt = forecastPoints[i];
    const radiusKm = pt.uncertaintyRadiusKm || Math.max(25, pt.timeOffsetHours * 4.2);
    const radiusDeg = radiusKm / 111; // ~111km per deg

    // Heading perpendicular angle
    const headingRad = (pt.movementHeadingDeg * Math.PI) / 180;
    const perpLeft = headingRad - Math.PI / 2;
    const perpRight = headingRad + Math.PI / 2;

    leftPoints.push([
      pt.lng + Math.cos(perpLeft) * radiusDeg * 1.12,
      pt.lat + Math.sin(perpLeft) * radiusDeg,
    ]);
    rightPoints.push([
      pt.lng + Math.cos(perpRight) * radiusDeg * 1.12,
      pt.lat + Math.sin(perpRight) * radiusDeg,
    ]);
  }

  const coordinates = [
    ...leftPoints,
    ...rightPoints.reverse(),
    leftPoints[0],
  ];

  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [coordinates],
    },
    properties: {},
  };
}

// Compute distance and bearing
function calculateDistanceAndBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): { distanceKm: number; bearingDeg: number; compassText: string } {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;

  const y = Math.sin(dLon) * Math.cos((lat2 * Math.PI) / 180);
  const x =
    Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
    Math.sin((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.cos(dLon);
  let bearingDeg = (Math.atan2(y, x) * 180) / Math.PI;
  bearingDeg = (bearingDeg + 360) % 360;

  const compassPoints = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const compassText = compassPoints[Math.round(bearingDeg / 45) % 8];

  return { distanceKm, bearingDeg, compassText };
}

// Helper: Determine category number and SSHWS label
function getCategoryInfo(windKnots: number) {
  if (windKnots >= 137) return { num: '5', label: 'SSHWS category 5' };
  if (windKnots >= 113) return { num: '4', label: 'SSHWS category 4' };
  if (windKnots >= 96) return { num: '3', label: 'SSHWS category 3' };
  if (windKnots >= 83) return { num: '2', label: 'SSHWS category 2' };
  if (windKnots >= 64) return { num: '1', label: 'SSHWS category 1' };
  if (windKnots >= 34) return { num: 'TS', label: 'Tropical Storm' };
  return { num: 'TD', label: 'Tropical Depression' };
}

// Helper: Format callout timestamp exactly like Windy (e.g. "Today - 8 AM", "Tomorrow - 11 AM", "Monday 31 - 11 AM")
function formatWindyCalloutTime(timestamp: string, timeOffsetHours: number): string {
  const parts = timestamp.split(' ');
  const dateStr = parts[0] || '';
  const hourPart = parts[1] || '08:00';
  const hourNum = parseInt(hourPart.split(':')[0], 10) || 8;
  const ampm = hourNum >= 12 ? 'PM' : 'AM';
  const h12 = hourNum % 12 || 12;

  if (timeOffsetHours === 0) {
    return `Today - ${h12} ${ampm}`;
  }
  if (timeOffsetHours < 0 && timeOffsetHours >= -24) {
    return `Yesterday - ${h12} ${ampm}`;
  }
  if (timeOffsetHours > 0 && timeOffsetHours <= 24) {
    return `Tomorrow - ${h12} ${ampm}`;
  }

  // Parse specific day name and date
  try {
    const d = new Date(dateStr);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = isNaN(d.getDay()) ? 'Day' : dayNames[d.getDay()];
    const dayNum = isNaN(d.getDate()) ? '' : d.getDate();
    return `${dayName} ${dayNum} - ${h12} ${ampm}`;
  } catch {
    return `${dateStr} - ${h12} ${ampm}`;
  }
}

export const CycloneMap: React.FC<CycloneMapProps> = ({
  storm,
  activePoint,
  onSelectPoint,
  layers = DEFAULT_LAYERS,
  onMapClickSpot,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);
  const nodeMarkersRef = useRef<maplibregl.Marker[]>([]);
  const spotMarkerRef = useRef<maplibregl.Marker | null>(null);

  const cartoApiKey = process.env.NEXT_PUBLIC_CARTO_API_KEY || 'cb1_2i9p_1_b8f4d5c4262fb9905ff418c4';

  // CARTO Dark Matter basemap style (clean, no neon glows)
  const mapBaseStyle: maplibregl.StyleSpecification = {
    version: 8,
    sources: {
      'carto-dark': {
        type: 'raster',
        tiles: [
          `https://a.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}@2x.png?api_key=${cartoApiKey}`,
          `https://b.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}@2x.png?api_key=${cartoApiKey}`,
          `https://c.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}@2x.png?api_key=${cartoApiKey}`,
          `https://d.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}@2x.png?api_key=${cartoApiKey}`,
        ],
        tileSize: 256,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>',
      },
      'esri-satellite': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        ],
        tileSize: 256,
        attribution: '&copy; Esri World Imagery',
      },
    },
    layers: [
      {
        id: 'base-carto-layer',
        type: 'raster',
        source: 'carto-dark',
        minzoom: 0,
        maxzoom: 19,
        layout: {
          visibility: layers.satelliteBasemap ? 'none' : 'visible',
        },
      },
      {
        id: 'base-satellite-layer',
        type: 'raster',
        source: 'esri-satellite',
        minzoom: 0,
        maxzoom: 19,
        layout: {
          visibility: layers.satelliteBasemap ? 'visible' : 'none',
        },
      },
    ],
  };

  // 1. Initialize MapLibre
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: mapBaseStyle,
      center: [activePoint.lng, activePoint.lat],
      zoom: 4.3,
      pitch: 0,
      attributionControl: false,
    });

    map.addControl(
      new maplibregl.AttributionControl({
        customAttribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>',
        compact: true,
      }),
      'bottom-right'
    );

    // Interactive map click for spot weather inspector
    map.on('click', (e) => {
      const clickLng = e.lngLat.lng;
      const clickLat = e.lngLat.lat;

      const { distanceKm, bearingDeg, compassText } = calculateDistanceAndBearing(
        activePoint.lat,
        activePoint.lng,
        clickLat,
        clickLng
      );

      const rDeg = distanceKm / 111;
      let speedFactor = 0.15;
      if (rDeg < 0.4) {
        speedFactor = 0.2 + (rDeg / 0.4) * 0.8;
      } else if (rDeg < 2.5) {
        speedFactor = Math.pow(0.4 / rDeg, 0.5);
      } else {
        speedFactor = Math.max(0.1, 0.4 / rDeg);
      }

      const spotWindKnots = Math.round(activePoint.windSpeedKnots * speedFactor);
      const spotWindKmh = Math.round(spotWindKnots * 1.852);
      const pressureDrop = Math.max(0, (1010 - activePoint.pressureHpa) * speedFactor);
      const spotPressure = Math.round(1010 - pressureDrop);

      const spotData: SpotPickerData = {
        lat: clickLat,
        lng: clickLng,
        windSpeedKnots: spotWindKnots,
        windSpeedKmh: spotWindKmh,
        windHeadingDeg: (bearingDeg + 90) % 360,
        pressureHpa: spotPressure,
        distanceToEyeKm: distanceKm,
        bearingToEye: compassText,
      };

      if (onMapClickSpot) onMapClickSpot(spotData);

      if (spotMarkerRef.current) {
        spotMarkerRef.current.remove();
      }

      const spotEl = document.createElement('div');
      spotEl.className = 'w-4 h-4 rounded-full border-2 border-cyan-400 bg-cyan-500/80 shadow';

      spotMarkerRef.current = new maplibregl.Marker({ element: spotEl })
        .setLngLat([clickLng, clickLat])
        .addTo(map);
    });

    map.on('load', () => {
      mapRef.current = map;
      setMapInstance(map);
      setTimeout(() => map.resize(), 100);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Basemap layer visibility switch
  useEffect(() => {
    if (!mapRef.current || !mapInstance) return;
    const map = mapRef.current;

    if (map.getLayer('base-carto-layer')) {
      map.setLayoutProperty(
        'base-carto-layer',
        'visibility',
        layers.satelliteBasemap ? 'none' : 'visible'
      );
    }
    if (map.getLayer('base-satellite-layer')) {
      map.setLayoutProperty(
        'base-satellite-layer',
        'visibility',
        layers.satelliteBasemap ? 'visible' : 'none'
      );
    }
  }, [layers.satelliteBasemap, mapInstance]);

  // 3. Update Tracks & Cone GeoJSON Layers (Exact Windy Style: Solid Dark Past, Dashed White Forecast, Dashed White Cone)
  useEffect(() => {
    if (!mapRef.current || !mapInstance) return;
    const map = mapRef.current;

    // Past track LineString (solid dark/charcoal line)
    const pastPoints = storm.timeline.filter((p) => p.timeOffsetHours <= 0);
    const pastGeoJSON: GeoJSON.Feature<GeoJSON.LineString> = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: pastPoints.map((p) => [p.lng, p.lat]),
      },
      properties: {},
    };

    // Forecast track LineString (dashed white line)
    const forecastPoints = storm.timeline.filter((p) => p.timeOffsetHours >= 0);
    const forecastGeoJSON: GeoJSON.Feature<GeoJSON.LineString> = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: forecastPoints.map((p) => [p.lng, p.lat]),
      },
      properties: {},
    };

    // Cone of uncertainty Polygon (soft fill with dashed white border)
    const conePolygon = generateUncertaintyConePolygon(storm.timeline);

    // Past Track: Solid dark charcoal line
    if (map.getSource('past-track-src')) {
      (map.getSource('past-track-src') as maplibregl.GeoJSONSource).setData(pastGeoJSON);
    } else {
      map.addSource('past-track-src', {
        type: 'geojson',
        data: pastGeoJSON,
      });

      map.addLayer({
        id: 'past-track-line',
        type: 'line',
        source: 'past-track-src',
        paint: {
          'line-color': '#27272a',
          'line-width': 3.5,
          'line-opacity': 0.95,
        },
      });
    }

    // Forecast Track: Crisp white dashed line
    if (map.getSource('forecast-track-src')) {
      (map.getSource('forecast-track-src') as maplibregl.GeoJSONSource).setData(forecastGeoJSON);
    } else {
      map.addSource('forecast-track-src', {
        type: 'geojson',
        data: forecastGeoJSON,
      });

      map.addLayer({
        id: 'forecast-track-line',
        type: 'line',
        source: 'forecast-track-src',
        paint: {
          'line-color': '#ffffff',
          'line-width': 2.5,
          'line-dasharray': [3, 2],
          'line-opacity': 0.95,
        },
      });
    }

    // Cone of Uncertainty: Soft white fill & white dashed outline
    if (conePolygon) {
      if (map.getSource('cone-src')) {
        (map.getSource('cone-src') as maplibregl.GeoJSONSource).setData(conePolygon);
      } else {
        map.addSource('cone-src', {
          type: 'geojson',
          data: conePolygon,
        });

        map.addLayer({
          id: 'cone-fill',
          type: 'fill',
          source: 'cone-src',
          paint: {
            'fill-color': '#ffffff',
            'fill-opacity': 0.07,
          },
        });

        map.addLayer({
          id: 'cone-border',
          type: 'line',
          source: 'cone-src',
          paint: {
            'line-color': '#ffffff',
            'line-width': 1.5,
            'line-dasharray': [4, 3],
            'line-opacity': 0.85,
          },
        });
      }
    }

    // Toggle track & cone visibility
    const trackVis = layers.trackAndCone ? 'visible' : 'none';
    ['past-track-line', 'forecast-track-line', 'cone-fill', 'cone-border'].forEach((layerId) => {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', trackVis);
      }
    });
  }, [storm, layers.trackAndCone, mapInstance]);

  // 4. Update Node Markers & Callout Boxes (Exact Windy Style from Reference Image)
  useEffect(() => {
    if (!mapRef.current || !mapInstance) return;
    const map = mapRef.current;

    nodeMarkersRef.current.forEach((m) => m.remove());
    nodeMarkersRef.current = [];

    if (!layers.trackAndCone) return;

    storm.timeline.forEach((point, idx) => {
      const isNow = point.timeOffsetHours === 0;
      const isPast = point.timeOffsetHours < 0;
      const isForecast = point.timeOffsetHours > 0;
      const catInfo = getCategoryInfo(point.windSpeedKnots);
      const timeLabel = formatWindyCalloutTime(point.timestamp, point.timeOffsetHours);

      // Stagger callout positions to match the image layout
      const calloutAlign = idx % 2 === 0 ? 'left' : 'right';

      const el = document.createElement('div');
      el.className = 'relative flex items-center justify-center select-none cursor-pointer group';

      if (isNow) {
        // CURRENT / TODAY NODE:
        // Red cyclone swirl emblem with clean white callout box (Header in bold dark red)
        el.innerHTML = `
          <!-- Live Cyclone Swirl Icon -->
          <div class="relative w-8 h-8 rounded-full bg-red-600 border-2 border-red-700 shadow flex items-center justify-center shrink-0 z-20">
            <svg class="w-5 h-5 text-white animate-spin-slow" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <path d="M 16 5 C 23 5 27 10 27 16 C 27 20 24 23 20 25 C 16 27 13 25 12 22 C 11 19 13 16 16 15" />
              <path d="M 16 27 C 9 27 5 22 5 16 C 5 12 8 9 12 7 C 16 5 19 7 20 10 C 21 13 19 16 16 17" />
              <circle cx="16" cy="16" r="2" fill="white" />
            </svg>
          </div>

          <!-- Live Today Callout Card -->
          <div class="absolute left-10 top-1/2 -translate-y-1/2 bg-white/95 rounded-lg px-2.5 py-1.5 shadow-md border border-slate-200 text-left whitespace-nowrap pointer-events-auto z-30 transition-transform group-hover:scale-105">
            <div class="text-[11px] font-bold text-red-700 leading-tight">
              ${timeLabel}
            </div>
            <div class="text-[11px] font-semibold text-slate-800 leading-tight mt-0.5">
              ${point.windSpeedKnots}kt | ${point.pressureHpa}hPa
            </div>
          </div>
        `;
      } else if (isForecast) {
        // FORECAST NODE:
        // Red cyclone swirl with white category number inside (e.g. 1, 2, 3) + clean off-white callout card
        el.innerHTML = `
          <!-- Forecast Swirl with Category Number -->
          <div class="relative w-7 h-7 rounded-full bg-red-600 border border-red-800 shadow flex items-center justify-center shrink-0 z-20">
            <svg class="w-4 h-4 text-white/90" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
              <path d="M 16 5 C 22 5 26 9 26 15 C 26 18 23 21 20 23 C 17 25 14 23 13 21" />
              <path d="M 16 27 C 10 27 6 23 6 17 C 6 14 9 11 12 9 C 15 7 18 9 19 11" />
            </svg>
            <span class="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white font-sans">
              ${catInfo.num}
            </span>
          </div>

          <!-- Forecast Callout Card (Windy style) -->
          <div class="absolute ${
            calloutAlign === 'left' ? 'right-9' : 'left-9'
          } top-1/2 -translate-y-1/2 bg-[#fefce8]/95 sm:bg-white/95 rounded-lg px-2.5 py-1.5 shadow-md border border-slate-200 text-left whitespace-nowrap pointer-events-auto z-30 transition-transform group-hover:scale-105">
            <div class="text-[11px] font-semibold text-slate-700 leading-tight">
              ${timeLabel}
            </div>
            <div class="text-[11px] font-medium text-slate-900 leading-tight mt-0.5">
              ${point.windSpeedKnots}kt
            </div>
            <div class="text-[10px] text-slate-500 leading-tight mt-0.5">
              ${catInfo.label}
            </div>
          </div>
        `;
      } else {
        // PAST OBSERVATION NODE:
        // White circular dot with dark border + dark grey callout box
        el.innerHTML = `
          <!-- Historical Node Point -->
          <div class="w-3.5 h-3.5 rounded-full bg-white border-2 border-zinc-700 shadow shrink-0 z-20"></div>

          <!-- Past Callout Card -->
          <div class="absolute left-6 top-1/2 -translate-y-1/2 bg-zinc-800/90 rounded-lg px-2 py-1 shadow border border-zinc-700 text-left whitespace-nowrap pointer-events-auto z-30 transition-transform group-hover:scale-105">
            <div class="text-[10px] font-medium text-zinc-300 leading-tight">
              ${timeLabel}
            </div>
            <div class="text-[10px] font-bold text-white leading-tight mt-0.5">
              ${point.windSpeedKnots}kt | ${point.pressureHpa}hPa
            </div>
          </div>
        `;
      }

      el.addEventListener('click', (e) => {
        e.stopPropagation();
  