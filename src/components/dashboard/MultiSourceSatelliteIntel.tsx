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
  theme?: 'dark' | 'light';
}

export const MultiSourceSatelliteIntel: React.FC<MultiSourceSatelliteIntelProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  storm,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const [selectedSensor, setSelectedSensor] = useState<'satA' | 'satB' | 'satC'>('satA');

  return (
    <div className="flex flex-col gap-2.5 p-3 overflow-y-auto custom-scrollbar select-none text-xs">
      {/* 1. Overview Card */}
      <div className={`p-3 rounded-xl border ${
        isLight
          ? 'bg-blue-50/50 border-blue-200 text-slate-800'
          : 'bg-[#17171d] border-zinc-800 text-zinc-100'
      }`}>
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <div className={`p-1 rounded-md ${isLight ? 'bg-blue-100 text-blue-700' : 'bg-zinc-800 text-blue-400'}`}>
              <Satellite className="w-3.5 h-3.5" />
            </div>
            <span className={`text-[11px] font-bold uppercase tracking-wider ${isLight ? 'text-blue-800' : 'text-zinc-200'}`}>
              Multi-Source Satellite Feeds
            </span>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
            isLight ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-zinc-800 text-blue-300 border-zinc-700'
          }`}>
            3 Active Feeds
          </span>
        </div>
        <p className={`text-[11px] leading-relaxed font-normal ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>
          Raw geostationary and polar-orbiting imagery streams are calibrated for brightness temperatures and re-gridded before downstream AI analysis.
        </p>

        {/* Dataflow Schema */}
        <div className={`mt-2.5 p-2.5 rounded-lg border text-[11px] ${
          isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-[#111115] border-zinc-800 text-zinc-300'
        }`}>
          <div className={`text-[10px] uppercase tracking-wider font-bold mb-1.5 flex items-center gap-1.5 ${
            isLight ? 'text-slate-600' : 'text-zinc-400'
          }`}>
            <Cpu className={`w-3 h-3 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />
            <span>Telemetry Pipeline Schema</span>
          </div>
          <div className="flex flex-col gap-1 text-[10px] leading-relaxed">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
              <span>INSAT-3DR (GEO 74°E) ── Thermal Infrared (TIR-1)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span>Meteosat-9 (GEO 45.5°E) ── Water Vapor (WV)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Oceansat-3 (Polar) ── Ku-Band Scatterometer</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sensor Feeds Selector */}
      <div className="space-y-2">
        <div className={`text-[11px] font-bold uppercase tracking-wider px-0.5 ${
          isLight ? 'text-slate-600' : 'text-zinc-400'
        }`}>
          Available Satellite Sensors
        </div>

        {/* Satellite A */}
        <div
          onClick={() => setSelectedSensor('satA')}
          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
            selectedSensor === 'satA'
              ? isLight
                ? 'bg-cyan-50/70 border-cyan-400'
                : 'bg-[#1f1f26] border-cyan-500'
              : isLight
                ? 'bg-white border-slate-200 hover:border-slate-300'
                : 'bg-[#17171d] border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              <span className={`text-[11px] font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Satellite A: INSAT-3DR
              </span>
            </div>
            <span className={`px-1.5 py-0.2 rounded text-[9px] font-medium border ${
              isLight ? 'bg-cyan-100 text-cyan-800 border-cyan-200' : 'bg-zinc-800 text-cyan-300 border-zinc-700'
            }`}>
              GEO 74°E (ISRO)
            </span>
          </div>

          <div className={`grid grid-cols-3 gap-1.5 text-[10px] ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>
            <div className={`p-1.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#111115] border-zinc-800'}`}>
              <div className={`text-[9px] ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Channel</div>
              <div className={`font-bold mt-0.5 ${isLight ? 'text-slate-900' : 'text-zinc-100'}`}>TIR-1 (10.8µm)</div>
            </div>
            <div className={`p-1.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#111115] border-zinc-800'}`}>
              <div className={`text-[9px] ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Resolution</div>
              <div className={`font-bold mt-0.5 ${isLight ? 'text-slate-900' : 'text-zinc-100'}`}>4.0 km/px</div>
            </div>
            <div className={`p-1.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#111115] border-zinc-800'}`}>
              <div className={`text-[9px] ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Min Core Temp</div>
              <div className="font-bold text-rose-500 mt-0.5">-84.2°C</div>
            </div>
          </div>
        </div>

        {/* Satellite B */}
        <div
          onClick={() => setSelectedSensor('satB')}
          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
            selectedSensor === 'satB'
              ? isLight
                ? 'bg-purple-50/70 border-purple-400'
                : 'bg-[#1f1f26] border-purple-500'
              : isLight
                ? 'bg-white border-slate-200 hover:border-slate-300'
                : 'bg-[#17171d] border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span className={`text-[11px] font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Satellite B: METEOSAT-9
              </span>
            </div>
            <span className={`px-1.5 py-0.2 rounded text-[9px] font-medium border ${
              isLight ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-zinc-800 text-purple-300 border-zinc-700'
            }`}>
              GEO 45.5°E (EUMETSAT)
            </span>
          </div>

          <div className={`grid grid-cols-3 gap-1.5 text-[10px] ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>
            <div className={`p-1.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#111115] border-zinc-800'}`}>
              <div className={`text-[9px] ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Channel</div>
              <div className={`font-bold mt-0.5 ${isLight ? 'text-slate-900' : 'text-zinc-100'}`}>WV (6.9µm)</div>
            </div>
            <div className={`p-1.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#111115] border-zinc-800'}`}>
              <div className={`text-[9px] ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Resolution</div>
              <div className={`font-bold mt-0.5 ${isLight ? 'text-slate-900' : 'text-zinc-100'}`}>3.0 km/px</div>
            </div>
            <div className={`p-1.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#111115] border-zinc-800'}`}>
              <div className={`text-[9px] ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Moisture Flux</div>
              <div className={`font-bold mt-0.5 ${isLight ? 'text-purple-600' : 'text-purple-300'}`}>82 g/kg/m</div>
            </div>
          </div>
        </div>

        {/* Satellite C */}
        <div
          onClick={() => setSelectedSensor('satC')}
          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
            selectedSensor === 'satC'
              ? isLight
                ? 'bg-emerald-50/70 border-emerald-400'
                : 'bg-[#1f1f26] border-emerald-500'
              : isLight
                ? 'bg-white border-slate-200 hover:border-slate-300'
                : 'bg-[#17171d] border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className={`text-[11px] font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Satellite C: OCEANSAT-3
              </span>
            </div>
            <span className={`px-1.5 py-0.2 rounded text-[9px] font-medium border ${
              isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-zinc-800 text-emerald-300 border-zinc-700'
            }`}>
              LEO Polar (ISRO)
            </span>
          </div>

          <div className={`grid grid-cols-3 gap-1.5 text-[10px] ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>
            <div className={`p-1.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#111115] border-zinc-800'}`}>
              <div className={`text-[9px] ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Instrument</div>
              <div className={`font-bold mt-0.5 ${isLight ? 'text-slate-900' : 'text-zinc-100'}`}>Scatterometer</div>
            </div>
            <div className={`p-1.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#111115] border-zinc-800'}`}>
              <div className={`text-[9px] ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Swath Res</div>
              <div className={`font-bold mt-0.5 ${isLight ? 'text-slate-900' : 'text-zinc-100'}`}>12.5 km</div>
            </div>
            <div className={`p-1.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#111115] border-zinc-800'}`}>
              <div className={`text-[9px] ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Max Wind RMW</div>
              <div className={`font-bold mt-0.5 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`}>24 km RMW</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Normalization Pipeline Verification */}
      <div className={`p-3 rounded-xl border space-y-2 ${
        isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#17171d] border-zinc-800 text-zinc-100'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sliders className={`w-3.5 h-3.5 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`} />
            <span className={`text-[11px] font-bold uppercase tracking-wider ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>
              Radiometric Calibration
            </span>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1 ${
            isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-zinc-800 text-emerald-300 border-zinc-700'
          }`}>
            <CheckCircle2 className={`w-3 h-3 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
            GSICS Calibrated
          </span>
        </div>

        <div className={`space-y-1.5 text-[11px] pt-1`}>
          <div className={`flex justify-between items-center py-0.5 border-b ${isLight ? 'border-slate-200' : 'border-zinc-800/70'}`}>
            <span className={isLight ? 'text-slate-500' : 'text-zinc-400'}>Brightness Temp Cal:</span>
            <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-zinc-100'}`}>±0.2K Standard</span>
          </div>
          <div className={`flex justify-between items-center py-0.5 border-b ${isLight ? 'border-slate-200' : 'border-zinc-800/70'}`}>
            <span className={isLight ? 'text-slate-500' : 'text-zinc-400'}>Grid Resampling:</span>
            <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-zinc-100'}`}>0.05° Equal-Area</span>
          </div>
          <div className={`flex justify-between items-center py-0.5 border-b ${isLight ? 'border-slate-200' : 'border-zinc-800/70'}`}>
            <span className={isLight ? 'text-slate-500' : 'text-zinc-400'}>Parallax Correction:</span>
            <span className={`font-bold ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`}>Applied (WGS84)</span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span className={isLight ? 'text-slate-500' : 'text-zinc-400'}>Prepared AI Tensor:</span>
            <span className={`px-1.5 py-0.2 rounded font-bold border ${
              isLight ? 'bg-slate-100 text-slate-800 border-slate-300' : 'bg-zinc-800 text-zinc-200 border-zinc-700'
            }`}>
              224 × 224 × 3
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
