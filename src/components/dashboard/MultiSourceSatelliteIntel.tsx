'use client';

import React, { useState } from 'react';
import {
  Satellite,
  Sliders,
  Radio,
  CheckCircle2,
  Cpu,
  Layers,
} from 'lucide-react';
import { Storm } from '@/lib/types/cyclone';

interface MultiSourceSatelliteIntelProps {
  storm: Storm;
}

export const MultiSourceSatelliteIntel: React.FC<MultiSourceSatelliteIntelProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  storm,
}) => {
  const [selectedSensor, setSelectedSensor] = useState<'satA' | 'satB' | 'satC'>('satA');

  return (
    <div className="flex flex-col gap-2.5 p-3 overflow-y-auto custom-scrollbar select-none text-xs">
      {/* 1. Overview Card */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/10 via-cyan-500/5 to-transparent border border-blue-500/20 shadow-sm">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-blue-500/15 text-blue-400">
              <Satellite className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300">
              Multi-Source Satellite Feeds
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
            3 Active Feeds
          </span>
        </div>
        <p className="text-[11px] text-zinc-300/90 leading-relaxed font-normal">
          Raw geostationary and polar-orbiting imagery streams are calibrated for brightness temperatures and re-gridded before downstream AI analysis.
        </p>

        {/* Dataflow Schema */}
        <div className="mt-2.5 p-2.5 rounded-lg bg-[#111115] border border-zinc-800/90 text-[11px] text-zinc-300">
          <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold mb-1.5 flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <span>Telemetry Pipeline Schema</span>
          </div>
          <div className="flex flex-col gap-1 text-[10px] leading-relaxed">
            <div className="flex items-center gap-1.5 text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>INSAT-3DR (GEO 74°E) ── Thermal Infrared (TIR-1)</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span>Meteosat-9 (GEO 45.5°E) ── Water Vapor (WV)</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Oceansat-3 (Polar) ── Ku-Band Scatterometer</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sensor Feeds Selector */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 px-0.5">
          Available Satellite Sensors
        </div>

        {/* Satellite A */}
        <div
          onClick={() => setSelectedSensor('satA')}
          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
            selectedSensor === 'satA'
              ? 'bg-gradient-to-r from-cyan-500/15 to-[#1c1c24] border-cyan-500/40 shadow-sm'
              : 'bg-[#17171d]/90 border-zinc-800/80 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-[11px] font-bold text-white">
                Satellite A: INSAT-3DR
              </span>
            </div>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-medium bg-zinc-800 text-cyan-300 border border-zinc-700/60">
              GEO 74°E (ISRO)
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-[10px] text-zinc-300">
            <div className="p-1.5 rounded-lg bg-[#111115] border border-zinc-800/80">
              <div className="text-[9px] text-zinc-400">Channel</div>
              <div className="font-bold text-zinc-100 mt-0.5">TIR-1 (10.8µm)</div>
            </div>
            <div className="p-1.5 rounded-lg bg-[#111115] border border-zinc-800/80">
              <div className="text-[9px] text-zinc-400">Resolution</div>
              <div className="font-bold text-zinc-100 mt-0.5">4.0 km/px</div>
            </div>
            <div className="p-1.5 rounded-lg bg-[#111115] border border-zinc-800/80">
              <div className="text-[9px] text-zinc-400">Min Core Temp</div>
              <div className="font-bold text-rose-400 mt-0.5">-84.2°C</div>
            </div>
          </div>
        </div>

        {/* Satellite B */}
        <div
          onClick={() => setSelectedSensor('satB')}
          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
            selectedSensor === 'satB'
              ? 'bg-gradient-to-r from-purple-500/15 to-[#1c1c24] border-purple-500/40 shadow-sm'
              : 'bg-[#17171d]/90 border-zinc-800/80 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span className="text-[11px] font-bold text-white">
                Satellite B: METEOSAT-9
              </span>
            </div>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-medium bg-zinc-800 text-purple-300 border border-zinc-700/60">
              GEO 45.5°E (EUMETSAT)
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-[10px] text-zinc-300">
            <div className="p-1.5 rounded-lg bg-[#111115] border border-zinc-800/80">
              <div className="text-[9px] text-zinc-400">Channel</div>
              <div className="font-bold text-zinc-100 mt-0.5">WV (6.9µm)</div>
            </div>
            <div className="p-1.5 rounded-lg bg-[#111115] border border-zinc-800/80">
              <div className="text-[9px] text-zinc-400">Resolution</div>
              <div className="font-bold text-zinc-100 mt-0.5">3.0 km/px</div>
            </div>
            <div className="p-1.5 rounded-lg bg-[#111115] border border-zinc-800/80">
              <div className="text-[9px] text-zinc-400">Moisture Flux</div>
              <div className="font-bold text-purple-300 mt-0.5">82 g/kg/m</div>
            </div>
          </div>
        </div>

        {/* Satellite C */}
        <div
          onClick={() => setSelectedSensor('satC')}
          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
            selectedSensor === 'satC'
              ? 'bg-gradient-to-r from-emerald-500/15 to-[#1c1c24] border-emerald-500/40 shadow-sm'
              : 'bg-[#17171d]/90 border-zinc-800/80 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[11px] font-bold text-white">
                Satellite C: OCEANSAT-3
              </span>
            </div>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-medium bg-zinc-800 text-emerald-300 border border-zinc-700/60">
              LEO Polar (ISRO)
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-[10px] text-zinc-300">
            <div className="p-1.5 rounded-lg bg-[#111115] border border-zinc-800/80">
              <div className="text-[9px] text-zinc-400">Instrument</div>
              <div className="font-bold text-zinc-100 mt-0.5">Scatterometer</div>
            </div>
            <div className="p-1.5 rounded-lg bg-[#111115] border border-zinc-800/80">
              <div className="text-[9px] text-zinc-400">Swath Res</div>
              <div className="font-bold text-zinc-100 mt-0.5">12.5 km</div>
            </div>
            <div className="p-1.5 rounded-lg bg-[#111115] border border-zinc-800/80">
              <div className="text-[9px] text-zinc-400">Max Wind RMW</div>
              <div className="font-bold text-emerald-400 mt-0.5">24 km RMW</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Normalization Pipeline Verification */}
      <div className="p-3 rounded-xl bg-[#17171d]/90 border border-zinc-800/80 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-200">
              Radiometric Calibration
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            GSICS Calibrated
          </span>
        </div>

        <div className="space-y-1.5 text-[11px] pt-1">
          <div className="flex justify-between items-center py-0.5 border-b border-zinc-800/70">
            <span className="text-zinc-400">Brightness Temp Cal:</span>
            <span className="font-bold text-zinc-100">±0.2K Standard</span>
          </div>
          <div className="flex justify-between items-center py-0.5 border-b border-zinc-800/70">
            <span className="text-zinc-400">Grid Resampling:</span>
            <span className="font-bold text-zinc-100">0.05° Equal-Area</span>
          </div>
          <div className="flex justify-between items-center py-0.5 border-b border-zinc-800/70">
            <span className="text-zinc-400">Parallax Correction:</span>
            <span className="font-bold text-emerald-400">Applied (WGS84)</span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span className="text-zinc-400">Prepared AI Tensor:</span>
            <span className="px-1.5 py-0.2 rounded font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              224 × 224 × 3
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
