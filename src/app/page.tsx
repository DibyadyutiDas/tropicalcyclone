'use client';

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { MOCK_STORMS } from '@/lib/data/mockStorms';
import { Storm, ObservationPoint } from '@/lib/types/cyclone';
import { TopNav } from '@/components/dashboard/TopNav';
import { WindyLayerBar, WindyActiveLayers } from '@/components/windy/WindyLayerBar';
import { WindyTimeline } from '@/components/windy/WindyTimeline';
import { WindyLegend } from '@/components/windy/WindyLegend';
import { WindyLeftHUD } from '@/components/windy/WindyLeftHUD';
import { WindySpotPicker, SpotPickerData } from '@/components/windy/WindySpotPicker';
import { WindyChatDrawer } from '@/components/windy/WindyChatDrawer';
import { Loader2 } from 'lucide-react';

const DynamicCycloneMap = dynamic(
  () => import('@/components/map/CycloneMap').then((mod) => mod.CycloneMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-black text-zinc-400 gap-3">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        <span className="text-xs font-semibold text-zinc-300">
          Loading Meteorological WebGL Engine & CARTO Tiles...
        </span>
      </div>
    ),
  }
);

export default function StormSenseWindyDashboard() {
  const [storms] = useState<Storm[]>(MOCK_STORMS);
  const [selectedStorm, setSelectedStorm] = useState<Storm>(MOCK_STORMS[0]);

  // Initial timeline index at T0 (NOW)
  const initialIndex = selectedStorm.timeline.findIndex((p) => p.timeOffsetHours === 0);
  const [activePointIndex, setActivePointIndex] = useState<number>(
    initialIndex !== -1 ? initialIndex : 0
  );

  // Active Weather Layers (Windy Style)
  const [layers, setLayers] = useState<WindyActiveLayers>({
    windParticles: true,
    rainRadar: false,
    thermalIR: false,
    waterVapor: false,
    waves: false,
    pressure: false,
    gradCam: false,
    trackAndCone: true,
    satelliteBasemap: false,
  });

  const [unit, setUnit] = useState<'kts' | 'kmh' | 'mph'>('kts');
  const [spotData, setSpotData] = useState<SpotPickerData | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleLayer = useCallback((key: keyof WindyActiveLayers) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleSelectStorm = (storm: Storm) => {
    setSelectedStorm(storm);
    const nowIdx = storm.timeline.findIndex((p) => p.timeOffsetHours === 0);
    setActivePointIndex(nowIdx !== -1 ? nowIdx : 0);
    setSpotData(null);
  };

  const activePoint: ObservationPoint =
    selectedStorm.timeline[activePointIndex] || selectedStorm.currentPoint;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-black text-zinc-100 antialiased selection:bg-cyan-900 selection:text-white">
      {/* 1. TOP NAVIGATION BAR (Kept intact as requested) */}
      <TopNav
        storms={storms}
        selectedStorm={selectedStorm}
        onSelectStorm={handleSelectStorm}
      />

      {/* 2. FULL-BLEED WINDY HERO MAP & FLOATING HUD ENVIRONMENT */}
      <main className="relative flex-1 w-full h-[calc(100vh-3.5rem)] overflow-hidden">
        {/* Immersive Edge-to-Edge WebGL Map Canvas */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <DynamicCycloneMap
            storm={selectedStorm}
            activePoint={activePoint}
            layers={layers}
            onToggleLayer={toggleLayer}
            onSelectPoint={(pt) => {
              const idx = selectedStorm.timeline.findIndex((p) => p.id === pt.id);
              if (idx !== -1) setActivePointIndex(idx);
            }}
            onMapClickSpot={(spot) => setSpotData(spot)}
          />
        </div>

        {/* Floating Spot Weather Inspector Tooltip (When user clicks anywhere on map) */}
        {spotData && (
          <WindySpotPicker
            data={spotData}
            onClose={() => setSpotData(null)}
          />
        )}

        {/* Floating Left Meteorological Telemetry Cockpit */}
        <div className="absolute top-4 left-4 z-20 max-w-[calc(100vw-2rem)]">
          <WindyLeftHUD
            storm={selectedStorm}
            activePoint={activePoint}
            onOpenChat={() => setIsChatOpen(true)}
            onRecenter={() => {
              // Trigger recenter
              const pt = activePoint;
              const idx = selectedStorm.timeline.findIndex((p) => p.id === pt.id);
              if (idx !== -1) setActivePointIndex(idx);
            }}
          />
        </div>

        {/* Floating Right Weather Layers Dock */}
        <div className="absolute top-4 right-4 z-20 hidden md:block">
          <WindyLayerBar
            layers={layers}
            onToggleLayer={toggleLayer}
            activeUnit={unit}
          />
        </div>

        {/* Bottom Floating Bar: Color Legend + Windy Forecast Timeline Scrubber */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col md:flex-row items-end md:items-center justify-between gap-3 pointer-events-none">
          {/* Bottom Left Legend & Units Switcher */}
          <div className="pointer-events-auto hidden sm:block">
            <WindyLegend
              activeLayer={layers.rainRadar ? 'rain' : layers.waves ? 'waves' : 'wind'}
              unit={unit}
              onToggleUnit={(newUnit) => setUnit(newUnit)}
            />
          </div>

          {/* Bottom Center Floating Windy Scrubber Player */}
          <div className="w-full md:w-auto md:flex-1 max-w-3xl pointer-events-auto">
            <WindyTimeline
              timeline={selectedStorm.timeline}
              activePointIndex={activePointIndex}
              onSelectIndex={setActivePointIndex}
            />
          </div>

          {/* Spacer for balance on large screens */}
          <div className="hidden lg:block w-44 pointer-events-none" />
        </div>

        {/* Floating AI Copilot Slide-Over Drawer */}
        <WindyChatDrawer
          storm={selectedStorm}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      </main>
    </div>
  );
}
