'use client';

import React, { useState, useCallback, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { Storm, ObservationPoint } from '@/lib/types/cyclone';
import { getAllWindyStorms, fetchLiveWindyStorms } from '@/lib/data/stormSenseAdapter';
import { TopNav } from '@/components/dashboard/TopNav';
import { WindyLayerBar, WindyActiveLayers, MapNavigationControls } from '@/components/windy/WindyLayerBar';
import { WindyTimeline } from '@/components/windy/WindyTimeline';
import { WindyLeftHUD } from '@/components/windy/WindyLeftHUD';
import { WindySpotPicker, SpotPickerData } from '@/components/windy/WindySpotPicker';
import { MobileFilterDrawer } from '@/components/windy/MobileFilterDrawer';
import { Loader2, SlidersHorizontal } from 'lucide-react';

const DynamicCycloneMap = dynamic(
  () => import('@/components/map/CycloneMap').then((mod) => mod.CycloneMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#121214] text-zinc-300 gap-3">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        <span className="text-xs font-semibold text-zinc-300">
          Loading Meteorological WebGL Engine & Satellite Tiles...
        </span>
      </div>
    ),
  }
);

export default function StormSenseWindyDashboard() {
  return (
    <Suspense fallback={null}>
      <WindyDashboardContent />
    </Suspense>
  );
}

function WindyDashboardContent() {
  const searchParams = useSearchParams();
  const [storms, setStorms] = useState<Storm[]>(() => getAllWindyStorms());
  const [selectedStorm, setSelectedStorm] = useState<Storm>(() => {
    const all = getAllWindyStorms();
    return all[0];
  });

  // Fetch live NOAA & IMD storms on mount to append to list
  useEffect(() => {
    let mounted = true;
    fetchLiveWindyStorms().then((updatedList) => {
      if (mounted && updatedList.length > 0) {
        setStorms(updatedList);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Listen for ?storm= in URL params
  useEffect(() => {
    const stormParam = searchParams.get('storm');
    if (!stormParam) return;
    const target = storms.find(
      (s) =>
        s.id.toLowerCase() === stormParam.toLowerCase() ||
        s.name.toLowerCase().includes(stormParam.toLowerCase())
    );
    if (target && target.id !== selectedStorm.id) {
      setSelectedStorm(target);
      const idx = target.timeline.findIndex((p) => p.timeOffsetHours === 0);
      setActivePointIndex(idx !== -1 ? idx : 0);
    }
  }, [searchParams, storms, selectedStorm.id]);

  // Initial timeline index at T0 (NOW)
  const initialIndex = selectedStorm.timeline.findIndex((p) => p.timeOffsetHours === 0);
  const [activePointIndex, setActivePointIndex] = useState<number>(
    initialIndex !== -1 ? initialIndex : 0
  );

  // Active Weather Layers (Windy Style) - Default to vivid Satellite Imagery basemap
  const [layers, setLayers] = useState<WindyActiveLayers>({
    windParticles: true,
    rainRadar: false,
    thermalIR: false,
    waterVapor: false,
    waves: false,
    pressure: false,
    gradCam: false,
    trackAndCone: true,
    satelliteBasemap: true,
  });

  const [unit, setUnit] = useState<'kts' | 'kmh' | 'mph'>('kts');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [spotData, setSpotData] = useState<SpotPickerData | null>(null);
  const [mapControls, setMapControls] = useState<MapNavigationControls | null>(null);

  // Load theme preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('stormsense_theme') as 'dark' | 'light' | null;
      if (saved === 'light' || saved === 'dark') {
        setTheme(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  // Sync document root attribute and class
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (theme === 'light') {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    }
  }, [theme]);

  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('stormsense_theme', next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const handleSetTheme = useCallback((newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    try {
      localStorage.setItem('stormsense_theme', newTheme);
    } catch {
      // ignore
    }
  }, []);

  const activePoint: ObservationPoint =
    selectedStorm.timeline[activePointIndex] || selectedStorm.timeline[0];

  const activeFilterCount = Object.values(layers).filter(Boolean).length;

  const toggleLayer = useCallback((key: keyof WindyActiveLayers) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleSelectStorm = useCallback((storm: Storm) => {
    setSelectedStorm(storm);
    const idx = storm.timeline.findIndex((p) => p.timeOffsetHours === 0);
    setActivePointIndex(idx !== -1 ? idx : 0);
  }, []);

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden flex flex-col font-sans select-none transition-colors duration-200 ${
        theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-[#121214] text-zinc-100'
      }`}
    >
      {/* Intact Top Navigation Bar with Theme Toggle */}
      <TopNav
        storms={storms}
        selectedStorm={selectedStorm}
        onSelectStorm={handleSelectStorm}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Full-Screen Meteorological Workspace */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        {/* Full-Screen WebGL Meteorological Map Engine */}
        <div className="absolute inset-0 z-0">
          <DynamicCycloneMap
            storm={selectedStorm}
            activePoint={activePoint}
            layers={layers}
            theme={theme}
            onSelectPoint={(pt) => {
              const idx = selectedStorm.timeline.findIndex((p) => p.id === pt.id);
              if (idx !== -1) setActivePointIndex(idx);
            }}
            onMapClickSpot={(spot) => setSpotData(spot)}
            onControlsReady={setMapControls}
          />
        </div>

        {/* Floating Spot Weather Inspector Tooltip (When user clicks anywhere on map) */}
        {spotData && (
          <WindySpotPicker
            data={spotData}
            onClose={() => setSpotData(null)}
          />
        )}

        {/* Antigravity Docked Left Activity Bar & Sidebar Panel (Flush to Left Edge) */}
        <div className="absolute top-0 bottom-0 left-0 z-30 flex pointer-events-none">
          <div className="pointer-events-auto h-full flex">
            <WindyLeftHUD
              storm={selectedStorm}
              activePoint={activePoint}
              isOpen={isSidebarOpen}
              onToggleOpen={setIsSidebarOpen}
              theme={theme}
              onToggleTheme={handleToggleTheme}
              onRecenter={() => {
                const pt = activePoint;
                const idx = selectedStorm.timeline.findIndex((p) => p.id === pt.id);
                if (idx !== -1) setActivePointIndex(idx);
              }}
            />
          </div>
        </div>

        {/* Floating Right Weather Layers & Map Navigation Dock (Desktop / Tablet md+) */}
        <div className="absolute top-4 right-4 z-20 hidden md:block">
          <WindyLayerBar
            layers={layers}
            onToggleLayer={toggleLayer}
            activeUnit={unit}
            theme={theme}
            mapControls={mapControls}
          />
        </div>

        {/* Floating Mobile Filter Trigger Button (Small screens < md) */}
        <div className="absolute top-3 right-3 z-20 md:hidden">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className={`w-10 h-10 rounded-full active:scale-95 border shadow-2xl backdrop-blur-md transition-all flex items-center justify-center relative group cursor-pointer ${
              theme === 'light'
                ? 'bg-white/95 hover:bg-slate-100 border-slate-300'
                : 'bg-[#18181d]/95 hover:bg-[#24242c] border-zinc-700/80'
            }`}
            aria-label="Open Weather Filters & Layers"
            title="Weather Filters & Layers"
          >
            {/* Iconic 3-Bar Electric Blue Hamburger */}
            <div className="flex flex-col items-center justify-center gap-[3px] w-5">
              <span className="w-4.5 h-[2.5px] rounded-full bg-[#38bdf8] group-hover:bg-[#60a5fa] transition-colors shadow-[0_0_8px_rgba(56,189,248,0.4)]" />
              <span className="w-4.5 h-[2.5px] rounded-full bg-[#38bdf8] group-hover:bg-[#60a5fa] transition-colors shadow-[0_0_8px_rgba(56,189,248,0.4)]" />
              <span className="w-4.5 h-[2.5px] rounded-full bg-[#38bdf8] group-hover:bg-[#60a5fa] transition-colors shadow-[0_0_8px_rgba(56,189,248,0.4)]" />
            </div>

            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[17px] h-4 px-1 rounded-full bg-[#0ea5e9] text-white text-[9px] font-bold flex items-center justify-center shadow-md border-2 border-[#121214]">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Bottom Docked Forecast Timeline Scrubber (Offset to prevent overlapping left sidebar) */}
        <div
          className={`absolute bottom-0 z-20 flex justify-center pointer-events-none transition-all duration-300 ${
            isSidebarOpen
              ? 'left-12 sm:left-[380px] right-0'
              : 'left-12 right-0'
          }`}
        >
          <div className="w-full max-w-3xl pointer-events-auto px-2">
            <WindyTimeline
              timeline={selectedStorm.timeline}
              activePointIndex={activePointIndex}
              onSelectIndex={setActivePointIndex}
              theme={theme}
            />
          </div>
        </div>
      </main>

      {/* Mobile Filters & Layers Hamburger Slide-in Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        layers={layers}
        onToggleLayer={toggleLayer}
        onSetLayers={setLayers}
        unit={unit}
        onToggleUnit={setUnit}
        theme={theme}
        onToggleTheme={handleSetTheme}
      />
    </div>
  );
}
