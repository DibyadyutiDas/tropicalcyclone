'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Storm, ObservationPoint } from '@/lib/types/cyclone';
import { WindyActiveLayers, MapNavigationControls } from '@/components/windy/WindyLayerBar';
import { WindParticleCanvas } from './WindParticleCanvas';
import { Plus, Minus, Compass, Globe, RotateCw, Sparkles, Box, Play, Pause } from 'lucide-react';
import { SpotPickerData } from '@/components/windy/WindySpotPicker';

interface CycloneMapProps {
  storm: Storm;
  activePoint: ObservationPoint;
  onSelectPoint?: (point: ObservationPoint) => void;
  layers?: WindyActiveLayers;
  onToggleLayer?: (key: keyof WindyActiveLayers) => void;
  onMapClickSpot?: (data: SpotPickerData | null) => void;
  theme?: 'dark' | 'light';
  onControlsReady?: (controls: MapNavigationControls) => void;
}

// IMD Category Acronym Mapping
function getIMDAcronym(category: string, windKnots: number): string {
  if (windKnots >= 120 || category.includes('Super')) return 'SuCS';
  if (windKnots >= 90 || category.includes('Extremely')) return 'ESCS';
  if (windKnots >= 64 || category.includes('Very Severe')) return 'VSCS';
  if (windKnots >= 48 || category.includes('Severe')) return 'SCS';
  if (windKnots >= 34 || category.includes('Cyclonic Storm')) return 'CS';
  if (windKnots >= 28 || category.includes('Deep Depression')) return 'DD';
  return 'D';
}

// Format IMD Synoptic Label (e.g. "28/12, 82KT, VSCS")
function formatIMDLabel(timestamp: string, windKnots: number, category: string): string {
  const parts = timestamp.split(' ');
  const dateParts = (parts[0] || '').split('-');
  const day = dateParts[2] || '28';
  const timeParts = (parts[1] || '06:00').split(':');
  const hour = timeParts[0] || '06';
  const acronym = getIMDAcronym(category, windKnots);
  return `${day}/${hour}, ${windKnots}KT, ${acronym}`;
}

// Generate mathematically smooth Green Capsule Cone of Uncertainty (IMD Style)
function generateUncertaintyConePolygon(points: ObservationPoint[]): GeoJSON.Feature<GeoJSON.Polygon> | null {
  const forecastPoints = points.filter((p) => p.timeOffsetHours >= 0);
  if (forecastPoints.length < 2) return null;

  const leftPoints: [number, number][] = [];
  const rightPoints: [number, number][] = [];

  for (let i = 0; i < forecastPoints.length; i++) {
    const pt = forecastPoints[i];
    const radiusKm = pt.uncertaintyRadiusKm || Math.max(38, 32 + pt.timeOffsetHours * 4.2);
    const radiusDeg = radiusKm / 111.0;
    const latRad = (pt.lat * Math.PI) / 180;
    const lngScale = 1 / Math.max(0.2, Math.cos(latRad));

    let headingRad = (pt.movementHeadingDeg * Math.PI) / 180;
    if (i < forecastPoints.length - 1) {
      const nextPt = forecastPoints[i + 1];
      const dLng = (nextPt.lng - pt.lng) * Math.cos(latRad);
      const dLat = nextPt.lat - pt.lat;
      headingRad = Math.atan2(dLng, dLat);
    } else if (i > 0) {
      const prevPt = forecastPoints[i - 1];
      const dLng = (pt.lng - prevPt.lng) * Math.cos(latRad);
      const dLat = pt.lat - prevPt.lat;
      headingRad = Math.atan2(dLng, dLat);
    }

    const perpLeft = headingRad - Math.PI / 2;
    const perpRight = headingRad + Math.PI / 2;

    leftPoints.push([
      pt.lng + Math.sin(perpLeft) * radiusDeg * lngScale,
      pt.lat + Math.cos(perpLeft) * radiusDeg,
    ]);
    rightPoints.push([
      pt.lng + Math.sin(perpRight) * radiusDeg * lngScale,
      pt.lat + Math.cos(perpRight) * radiusDeg,
    ]);
  }

  // Top terminal dome around the last forecast point
  const lastPt = forecastPoints[forecastPoints.length - 1];
  const lastRadiusKm = lastPt.uncertaintyRadiusKm || Math.max(75, 32 + lastPt.timeOffsetHours * 4.2);
  const lastRadiusDeg = lastRadiusKm / 111.0;
  const lastLatRad = (lastPt.lat * Math.PI) / 180;
  const lastLngScale = 1 / Math.max(0.2, Math.cos(lastLatRad));

  let lastHeadingRad = (lastPt.movementHeadingDeg * Math.PI) / 180;
  if (forecastPoints.length >= 2) {
    const prevPt = forecastPoints[forecastPoints.length - 2];
    lastHeadingRad = Math.atan2(
      (lastPt.lng - prevPt.lng) * Math.cos(lastLatRad),
      lastPt.lat - prevPt.lat
    );
  }

  const topDomePoints: [number, number][] = [];
  const domeSteps = 18;
  for (let j = 0; j <= domeSteps; j++) {
    const angle = lastHeadingRad - Math.PI / 2 + (j / domeSteps) * Math.PI;
    topDomePoints.push([
      lastPt.lng + Math.sin(angle) * lastRadiusDeg * lastLngScale,
      lastPt.lat + Math.cos(angle) * lastRadiusDeg,
    ]);
  }

  // Bottom rounded cap around the first forecast point
  const firstPt = forecastPoints[0];
  const firstRadiusKm = firstPt.uncertaintyRadiusKm || 38;
  const firstRadiusDeg = firstRadiusKm / 111.0;
  const firstLatRad = (firstPt.lat * Math.PI) / 180;
  const firstLngScale = 1 / Math.max(0.2, Math.cos(firstLatRad));

  let firstHeadingRad = (firstPt.movementHeadingDeg * Math.PI) / 180;
  if (forecastPoints.length >= 2) {
    const nextPt = forecastPoints[1];
    firstHeadingRad = Math.atan2(
      (nextPt.lng - firstPt.lng) * Math.cos(firstLatRad),
      nextPt.lat - firstPt.lat
    );
  }

  const bottomCapPoints: [number, number][] = [];
  for (let j = 0; j <= domeSteps; j++) {
    const angle = firstHeadingRad + Math.PI / 2 + (j / domeSteps) * Math.PI;
    bottomCapPoints.push([
      firstPt.lng + Math.sin(angle) * firstRadiusDeg * firstLngScale,
      firstPt.lat + Math.cos(angle) * firstRadiusDeg,
    ]);
  }

  const polygonCoordinates = [
    ...leftPoints,
    ...topDomePoints,
    ...rightPoints.reverse(),
    ...bottomCapPoints,
    leftPoints[0],
  ];

  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [polygonCoordinates],
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

export const CycloneMap: React.FC<CycloneMapProps> = ({
  storm,
  activePoint,
  onSelectPoint,
  layers = {
    windParticles: true,
    rainRadar: false,
    thermalIR: false,
    waterVapor: false,
    waves: false,
    pressure: false,
    gradCam: false,
    trackAndCone: true,
    satelliteBasemap: false,
  },
  onMapClickSpot,
  theme = 'dark',
  onControlsReady,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);
  const [isOrbiting, setIsOrbiting] = useState(false);
  const [is3D, setIs3D] = useState(false);
  const orbitReqRef = useRef<number | null>(null);

  const [isSpinning, setIsSpinning] = useState(false);
  const [isGlobe, setIsGlobe] = useState(true);
  const spinReqRef = useRef<number | null>(null);

  const nodeMarkersRef = useRef<maplibregl.Marker[]>([]);

  // Stop Planetary Earth Rotation
  const stopEarthSpin = useCallback(() => {
    setIsSpinning(false);
    if (spinReqRef.current) {
      cancelAnimationFrame(spinReqRef.current);
      spinReqRef.current = null;
    }
  }, []);

  // Start Real Planetary Earth Spin (Google Earth Globe Rotation)
  const startEarthSpin = useCallback(() => {
    if (!mapRef.current) return;
    stopOrbit();
    setIsSpinning(true);

    // Zoom out smoothly to see the spherical 3D Earth floating in space
    if (mapRef.current.getZoom() > 3.4) {
      mapRef.current.easeTo({
        zoom: 2.2,
        duration: 800,
      });
    }

    const spin = () => {
      if (!mapRef.current) return;
      const center = mapRef.current.getCenter();
      let nextLng = center.lng - 0.22;
      if (nextLng < -180) nextLng += 360;
      mapRef.current.setCenter([nextLng, center.lat]);
      spinReqRef.current = requestAnimationFrame(spin);
    };

    spinReqRef.current = requestAnimationFrame(spin);
  }, []);

  const toggleEarthSpin = useCallback(() => {
    if (isSpinning) {
      stopEarthSpin();
    } else {
      startEarthSpin();
    }
  }, [isSpinning, startEarthSpin, stopEarthSpin]);

  // Stop 3D Orbit
  const stopOrbit = useCallback(() => {
    setIsOrbiting(false);
    if (orbitReqRef.current) {
      cancelAnimationFrame(orbitReqRef.current);
      orbitReqRef.current = null;
    }
  }, []);

  // Start 3D Orbit Animation around storm eye
  const startOrbit = useCallback(() => {
    if (!mapRef.current) return;
    stopEarthSpin();
    setIsOrbiting(true);
    setIs3D(true);

    if (mapRef.current.getPitch() < 35) {
      mapRef.current.easeTo({
        pitch: 56,
        center: [activePoint.lng, activePoint.lat],
        duration: 800,
      });
    }

    const animateOrbit = () => {
      if (!mapRef.current) return;
      const currentBearing = mapRef.current.getBearing();
      mapRef.current.setBearing((currentBearing + 0.22) % 360);
      orbitReqRef.current = requestAnimationFrame(animateOrbit);
    };

    orbitReqRef.current = requestAnimationFrame(animateOrbit);
  }, [activePoint, stopEarthSpin]);

  // Toggle 3D Orbit Mode
  const toggleOrbit = useCallback(() => {
    if (isOrbiting) {
      stopOrbit();
    } else {
      startOrbit();
    }
  }, [isOrbiting, startOrbit, stopOrbit]);

  // Google Earth True Space Swoop Fly-In (Deep Space Orbit -> Planetary Descent -> Cyclone Eye)
  const triggerGoogleEarthFlyIn = useCallback(() => {
    if (!mapRef.current) return;
    stopOrbit();
    stopEarthSpin();

    // Stage 1: Zoom out to deep space to view the entire round Earth sphere
    mapRef.current.jumpTo({
      center: [activePoint.lng - 25, activePoint.lat - 10],
      zoom: 1.2,
      pitch: 0,
      bearing: 0,
    });

    // Stage 2: Swoop through the atmosphere down into the cyclone eye
    setTimeout(() => {
      if (!mapRef.current) return;
      mapRef.current.flyTo({
        center: [activePoint.lng, activePoint.lat],
        zoom: 5.2,
        pitch: 0,
        bearing: 0,
        speed: 0.38,
        curve: 1.6,
        essential: true,
        easing: (t) => t * (2 - t),
      });
    }, 150);
  }, [activePoint, stopOrbit, stopEarthSpin]);

  // Toggle Globe vs Flat Projection
  const toggleProjection = useCallback(() => {
    if (!mapRef.current) return;
    const next = !isGlobe;
    setIsGlobe(next);
    try {
      (mapRef.current as unknown as { setProjection?: (opt: { type: string }) => void }).setProjection?.({
        type: next ? 'globe' : 'mercator',
      });
    } catch (e) {
      console.warn('Projection change', e);
    }
  }, [isGlobe]);

  // Toggle 2D / 3D Perspective Tilt
  const toggle3D = useCallback(() => {
    if (!mapRef.current) return;
    stopOrbit();
    stopEarthSpin();
    if (is3D) {
      mapRef.current.easeTo({
        pitch: 0,
        bearing: 0,
        duration: 700,
      });
      setIs3D(false);
    } else {
      mapRef.current.easeTo({
        pitch: 56,
        bearing: 25,
        duration: 700,
      });
      setIs3D(true);
    }
  }, [is3D, stopOrbit, stopEarthSpin]);

  // CARTO / Esri Basemaps Style Specification with Real 3D Globe Projection
  const mapBaseStyle = {
    version: 8,
    projection: {
      type: 'globe',
    },
    sources: {
      'carto-dark': {
        type: 'raster',
        tiles: [
          'https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
          'https://cartodb-basemaps-b.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
          'https://cartodb-basemaps-c.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
          'https://cartodb-basemaps-d.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
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
      'carto-light': {
        type: 'raster',
        tiles: [
          'https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
          'https://cartodb-basemaps-b.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
          'https://cartodb-basemaps-c.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
          'https://cartodb-basemaps-d.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
        ],
        tileSize: 256,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>',
      },
    },
    layers: [
      {
        id: 'base-satellite-layer',
        type: 'raster',
        source: 'esri-satellite',
        minzoom: 0,
        maxzoom: 19,
        layout: {
          visibility: layers.satelliteBasemap !== false ? 'visible' : 'none',
        },
      },
      {
        id: 'base-carto-layer',
        type: 'raster',
        source: 'carto-dark',
        minzoom: 0,
        maxzoom: 19,
        layout: {
          visibility: layers.satelliteBasemap !== false ? 'none' : theme === 'dark' ? 'visible' : 'none',
        },
      },
      {
        id: 'base-carto-light-layer',
        type: 'raster',
        source: 'carto-light',
        minzoom: 0,
        maxzoom: 19,
        layout: {
          visibility: layers.satelliteBasemap !== false ? 'none' : theme === 'light' ? 'visible' : 'none',
        },
      },
    ],
  } as maplibregl.StyleSpecification;

  // 1. Initialize MapLibre with 3D Globe
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const mapOptions = {
      container: mapContainerRef.current,
      style: mapBaseStyle,
      center: [activePoint.lng, activePoint.lat],
      zoom: 4.8,
      pitch: 0,
      projection: {
        type: 'globe',
      },
      attributionControl: false,
    };

    const map = new maplibregl.Map(mapOptions as unknown as maplibregl.MapOptions);

    map.addControl(
      new maplibregl.AttributionControl({
        customAttribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a> &copy; IMD',
        compact: true,
      }),
      'bottom-right'
    );

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

      const spotWindKnots = Math.max(12, Math.round(activePoint.windSpeedKnots * speedFactor));
      const spotWindKmh = Math.round(spotWindKnots * 1.852);
      const spotPressureHpa = Math.min(1013, Math.round(activePoint.pressureHpa + (1 - speedFactor) * 45));

      if (onMapClickSpot) {
        onMapClickSpot({
          lat: clickLat,
          lng: clickLng,
          windSpeedKnots: spotWindKnots,
          windSpeedKmh: spotWindKmh,
          windHeadingDeg: Math.round(bearingDeg),
          pressureHpa: spotPressureHpa,
          distanceToEyeKm: Math.round(distanceKm),
          bearingToEye: `${Math.round(bearingDeg)}° (${compassText})`,
        });
      }
    });

    map.on('load', () => {
      setMapInstance(map);
    });

    map.on('dragstart', () => {
      stopOrbit();
    });

    map.on('rotatestart', () => {
      stopOrbit();
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [stopOrbit]);

  // 2. Basemap Layer Visibility Switcher
  useEffect(() => {
    if (!mapRef.current || !mapInstance) return;
    const map = mapRef.current;

    const showSatellite = !!layers.satelliteBasemap;

    if (map.getLayer('base-satellite-layer')) {
      map.setLayoutProperty(
        'base-satellite-layer',
        'visibility',
        showSatellite ? 'visible' : 'none'
      );
    }
    if (map.getLayer('base-carto-layer')) {
      map.setLayoutProperty(
        'base-carto-layer',
        'visibility',
        !showSatellite && theme === 'dark' ? 'visible' : 'none'
      );
    }
    if (map.getLayer('base-carto-light-layer')) {
      map.setLayoutProperty(
        'base-carto-light-layer',
        'visibility',
        !showSatellite && theme === 'light' ? 'visible' : 'none'
      );
    }
  }, [layers.satelliteBasemap, theme, mapInstance]);

  // 3. Render IMD Green Capsule Cone and Track Lines
  useEffect(() => {
    if (!mapRef.current || !mapInstance) return;
    const map = mapRef.current;

    // Past track LineString (Dark observed line)
    const pastPoints = storm.timeline.filter((p) => p.timeOffsetHours <= 0);
    const pastGeoJSON: GeoJSON.Feature<GeoJSON.LineString> = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: pastPoints.map((p) => [p.lng, p.lat]),
      },
      properties: {},
    };

    // Forecast track LineString (Brownish-red forecast line)
    const forecastPoints = storm.timeline.filter((p) => p.timeOffsetHours >= 0);
    const forecastGeoJSON: GeoJSON.Feature<GeoJSON.LineString> = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: forecastPoints.map((p) => [p.lng, p.lat]),
      },
      properties: {},
    };

    // IMD Cone of Uncertainty (Smooth Green Capsule Polygon)
    const conePolygon = generateUncertaintyConePolygon(storm.timeline);

    // Past Track: Solid Dark Line
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
          'line-color': '#0f172a',
          'line-width': 2.5,
          'line-opacity': 0.95,
        },
      });
    }

    // IMD Cone of Uncertainty (Green Capsule Envelope)
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
            'fill-color': '#22c55e',
            'fill-opacity': 0.48,
          },
        });

        map.addLayer({
          id: 'cone-border',
          type: 'line',
          source: 'cone-src',
          paint: {
            'line-color': '#15803d',
            'line-width': 2.2,
            'line-opacity': 0.95,
          },
        });
      }
    }

    // Forecast Track: Solid Brownish-Red Line through Cone Center
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
          'line-color': '#991b1b',
          'line-width': 3.0,
          'line-opacity': 1.0,
        },
      });
    }

    const trackVis = layers.trackAndCone ? 'visible' : 'none';
    ['past-track-line', 'forecast-track-line', 'cone-fill', 'cone-border'].forEach((layerId) => {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', trackVis);
      }
    });
  }, [storm, activePoint, layers.trackAndCone, mapInstance]);

  // 4. Render IMD Synoptic Node Markers & Pure Royal Blue Text Labels (Exact Style from Screenshot 2)
  useEffect(() => {
    if (!mapRef.current || !mapInstance) return;
    const map = mapRef.current;

    nodeMarkersRef.current.forEach((m) => m.remove());
    nodeMarkersRef.current = [];

    if (!layers.trackAndCone) return;

    storm.timeline.forEach((point) => {
      const isNow = point.timeOffsetHours === 0;
      const isForecast = point.timeOffsetHours > 0;
      const labelText = formatIMDLabel(point.timestamp, point.windSpeedKnots, point.category);

      const el = document.createElement('div');
      el.className = 'relative flex items-center select-none cursor-pointer group';

      if (isNow) {
        // LIVE STORM CORE: Red circle with black border & white halo + Royal Blue Text
        el.innerHTML = `
          <div class="w-4 h-4 rounded-full bg-red-600 border-2 border-black ring-2 ring-white shadow flex items-center justify-center shrink-0 z-30 transition-transform group-hover:scale-125"></div>
          <span class="ml-2 font-mono font-bold text-xs text-[#2563eb] whitespace-nowrap drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)] pointer-events-auto z-30 transition-transform group-hover:scale-105">
            ${labelText}
          </span>
        `;
      } else if (isForecast) {
        // FORECAST NODES: Red circle with dark border + Royal Blue Text
        el.innerHTML = `
          <div class="w-3.5 h-3.5 rounded-full bg-red-600 border-2 border-black shadow shrink-0 z-30 transition-transform group-hover:scale-125"></div>
          <span class="ml-2 font-mono font-bold text-xs text-[#2563eb] whitespace-nowrap drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)] pointer-events-auto z-30 transition-transform group-hover:scale-105">
            ${labelText}
          </span>
        `;
      } else {
        // PAST OBS NODES: Black circle with white border + Royal Blue Text
        el.innerHTML = `
          <div class="w-3 h-3 rounded-full bg-black border-2 border-white shadow shrink-0 z-20 transition-transform group-hover:scale-125"></div>
          <span class="ml-2 font-mono font-bold text-xs text-[#2563eb] whitespace-nowrap drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)] pointer-events-auto z-20 transition-transform group-hover:scale-105">
            ${labelText}
          </span>
        `;
      }

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        if (onSelectPoint) onSelectPoint(point);
      });

      const marker = new maplibregl.Marker({ element: el, anchor: 'left' })
        .setLngLat([point.lng, point.lat])
        .addTo(map);

      nodeMarkersRef.current.push(marker);
    });

    map.easeTo({
      center: [activePoint.lng, activePoint.lat],
      duration: 500,
    });
  }, [storm, activePoint, layers.trackAndCone, mapInstance, onSelectPoint]);

  const handleRecenter = useCallback(() => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: [activePoint.lng, activePoint.lat],
      zoom: 5.4,
      duration: 600,
    });
  }, [activePoint]);

  useEffect(() => {
    if (!onControlsReady) return;
    onControlsReady({
      zoomIn: () => mapRef.current?.zoomIn(),
      zoomOut: () => mapRef.current?.zoomOut(),
      recenter: handleRecenter,
      toggleProjection,
      toggleEarthSpin,
      isGlobe,
      isSpinning,
    });
  }, [onControlsReady, handleRecenter, toggleProjection, toggleEarthSpin, isGlobe, isSpinning]);

  const isLight = theme === 'light';

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#121214] select-none">
      {/* MapLibre WebGL Canvas Container */}
      <div ref={mapContainerRef} className="absolute inset-0 z-0 w-full h-full" />

      {/* Wind Particles & Meteorological Layers */}
      <WindParticleCanvas
        map={mapInstance}
        centerLat={activePoint.lat}
        centerLng={activePoint.lng}
        maxWindKnots={activePoint.windSpeedKnots}
        visible={layers.windParticles}
        waterVapor={layers.waterVapor}
        thermalIR={layers.thermalIR}
        rainRadar={layers.rainRadar}
        waves={layers.waves}
        pressure={layers.pressure}
        gradCam={layers.gradCam}
      />

      {/* Real 3D Earth Spin Active Top HUD */}
      {isSpinning && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#16161a]/95 border border-cyan-500/50 shadow-2xl shadow-cyan-500/20 backdrop-blur-md animate-in fade-in slide-in-from-top-3 duration-200 pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-semibold text-cyan-300 tracking-wide flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            REAL 3D EARTH GLOBE ROTATION
          </span>
          <button
            onClick={stopEarthSpin}
            className="ml-2 px-2.5 py-0.5 rounded-full bg-red-500/25 hover:bg-red-500/40 text-red-300 text-[10px] font-bold uppercase transition-colors border border-red-500/40 flex items-center gap-1"
          >
            <Pause className="w-2.5 h-2.5 fill-current" />
            <span>PAUSE</span>
          </button>
        </div>
      )}

      {/* Mobile-Only Quick Map & 3D Controls (< md) */}
      <div className="absolute bottom-24 right-3 z-20 flex flex-col gap-1.5 md:hidden select-none pointer-events-auto">
        {/* Globe / Projection Actions */}
        <div
          className={`flex flex-col gap-1 p-1 rounded-xl backdrop-blur-md border shadow-xl ${
            isLight ? 'bg-white/95 border-slate-300' : 'bg-[#18181c]/90 border-zinc-800'
          }`}
        >
          <button
            onClick={toggleProjection}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all text-[10px] font-bold font-mono ${
              isGlobe
                ? 'bg-blue-500/25 text-blue-400 border border-blue-500/40'
                : isLight
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                : 'bg-[#222226] text-zinc-300 hover:text-white hover:bg-zinc-700'
            }`}
            title="Toggle 3D Globe / 2D Flat"
          >
            <span>{isGlobe ? 'GLOBE' : 'FLAT'}</span>
          </button>
        </div>

        {/* Zoom Controls */}
        <div
          className={`flex flex-col gap-1 p-1 rounded-xl backdrop-blur-md border shadow-xl ${
            isLight ? 'bg-white/95 border-slate-300' : 'bg-[#18181c]/90 border-zinc-800'
          }`}
        >
          <button
            onClick={() => mapRef.current?.zoomIn()}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
              isLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-[#222226] text-zinc-200 hover:text-white hover:bg-zinc-700'
            }`}
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => mapRef.current?.zoomOut()}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
              isLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-[#222226] text-zinc-200 hover:text-white hover:bg-zinc-700'
            }`}
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Recenter Compass */}
        <div
          className={`p-1 rounded-xl backdrop-blur-md border shadow-xl ${
            isLight ? 'bg-white/95 border-slate-300' : 'bg-[#18181c]/90 border-zinc-800'
          }`}
        >
          <button
            onClick={handleRecenter}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
              isLight ? 'bg-slate-100 text-cyan-600 hover:bg-slate-200' : 'bg-[#222226] text-cyan-400 hover:text-cyan-300 hover:bg-zinc-700'
            }`}
            title="Recenter on Cyclone Eye"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
