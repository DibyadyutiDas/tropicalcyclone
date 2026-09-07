'use client';

import React, { useState, useEffect } from 'react';
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Clock,
} from 'lucide-react';
import { ObservationPoint } from '@/lib/types/cyclone';
import { getCategoryColor } from '@/lib/utils/colors';

interface WindyTimelineProps {
  timeline: ObservationPoint[];
  activePointIndex: number;
  onSelectIndex: (index: number) => void;
  theme?: 'dark' | 'light';
}

export const WindyTimeline: React.FC<WindyTimelineProps> = ({
  timeline,
  activePointIndex,
  onSelectIndex,
  theme = 'dark',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = 1200;
    const timer = setInterval(() => {
      onSelectIndex((activePointIndex + 1) % timeline.length);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, activePointIndex, timeline.length, onSelectIndex]);

  const activePoint = timeline[activePointIndex] || timeline[0];
  const catStyle = getCategoryColor(activePoint.category);
  const isNow = activePoint.timeOffsetHours === 0;
  const isForecast = activePoint.timeOffsetHours > 0;

  const progressPercent = (activePointIndex / Math.max(1, timeline.length - 1)) * 100;
  const isLight = theme === 'light';

  return (
    <div
      className={`w-full max-w-3xl mx-auto rounded-t-2xl rounded-b-none py-2.5 px-4 border-t border-x shadow-2xl select-none flex flex-col gap-1.5 transition-all ${
        isLight
          ? 'bg-white/95 backdrop-blur-xl border-slate-300 text-slate-900'
          : 'bg-[#16161a]/95 backdrop-blur-xl border-zinc-700/80 text-zinc-100'
      }`}
    >
      {/* Top Row: Playback Controls & Frame Badge */}
      <div className="flex items-center justify-between gap-1.5 flex-wrap">
        {/* Left: Player Buttons */}
        <div className="flex items-center gap-1">
          {/* Step Back */}
          <button
            onClick={() => onSelectIndex(Math.max(0, activePointIndex - 1))}
            disabled={activePointIndex === 0}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors border disabled:opacity-30 cursor-pointer ${
              isLight
                ? 'bg-slate-100 text-slate-700 hover:text-slate-950 hover:bg-slate-200 border-slate-300'
                : 'bg-[#222228] text-zinc-300 hover:text-white hover:bg-zinc-700 border-zinc-700/50'
            }`}
            title="Step Back"
          >
            <SkipBack className="w-3 h-3" />
          </button>

          {/* Clean Windy Play / Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`h-7 px-3.5 rounded-full flex items-center gap-1.5 font-bold text-[11px] transition-colors shadow-sm ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-black'
                : 'bg-cyan-500 hover:bg-cyan-400 text-black'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3 h-3 fill-current" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current ml-0.5" />
                <span>PLAY</span>
              </>
            )}
          </button>

          {/* Step Forward */}
          <button
            onClick={() => onSelectIndex(Math.min(timeline.length - 1, activePointIndex + 1))}
            disabled={activePointIndex === timeline.length - 1}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-[#222228] text-zinc-300 hover:text-white hover:bg-zinc-700 disabled:opacity-30 transition-colors border border-zinc-700/50"
            title="Step Forward"
          >
            <SkipForward className="w-3 h-3" />
          </button>
        </div>

        {/* Mobile Compact Active Time Pill */}
        <div className="flex md:hidden items-center gap-1.5 px-2.5 h-7 rounded-full bg-[#202026] border border-zinc-700/80 font-mono text-[10px] ml-auto">
          <Clock className="w-2.5 h-2.5 text-cyan-400" />
          <span className="font-bold text-white">
            {isNow ? 'NOW' : (activePoint.timestamp.split(' ')[1] || `${activePoint.timeOffsetHours}h`)}
          </span>
          <span className="text-zinc-500">•</span>
          <span className={`font-bold ${catStyle.text}`}>
            {activePoint.windSpeedKnots}kt
          </span>
        </div>

        {/* Center/Right: Current Timestamp & Wind Speed (Desktop) */}
        <div className="hidden md:flex items-center gap-1.5 ml-auto">
          {/* Timestamp Info */}
          <div className="flex items-center gap-1.5 px-2.5 h-7 rounded-full bg-[#202026] border border-zinc-700/70 font-mono text-[11px]">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span className="text-zinc-400 text-[10px] hidden sm:inline">Time:</span>
            <span className="font-bold text-white tracking-wide">
              {activePoint.timestamp}
            </span>
          </div>

          {/* Forecast / Obs Badge */}
          <div
            className={`flex items-center px-2.5 h-7 rounded-full text-[11px] font-bold transition-colors ${
              isNow
                ? 'bg-red-500/25 text-red-400 border border-red-500/30'
                : isForecast
                ? 'bg-amber-500/25 text-amber-300 border border-amber-500/30'
                : 'bg-[#202026] text-zinc-300 border border-zinc-700'
            }`}
          >
            <span>
              {isNow
                ? 'NOW (06Z)'
                : isForecast
                ? `+${activePoint.timeOffsetHours}h Forecast`
                : `${activePoint.timeOffsetHours}h Obs`}
            </span>
          </div>

          {/* Wind Speed Badge */}
          <div
            className={`flex items-center gap-1.5 px-2.5 h-7 rounded-full text-[11px] font-bold ${catStyle.bg} ${catStyle.text} border border-white/10`}
          >
            <svg
              className="w-3 h-3 text-cyan-400 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M 12 3 C 16.5 3 20 6.5 20 11 C 20 13.8 18 16 15.5 16.8" />
              <path d="M 12 21 C 7.5 21 4 17.5 4 13 C 4 10.2 6 8 8.5 7.2" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
            <span className="font-mono font-bold">{activePoint.windSpeedKnots} kts</span>
            <span className="text-[10px] font-normal opacity-85 hidden sm:inline">({activePoint.windSpeedKmh} km/h)</span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Day & Hour Scrubber Ribbon */}
      <div className="relative pt-0.5">
        <div className="relative h-1.5 w-full bg-[#121214] rounded-full overflow-hidden cursor-pointer">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-amber-400 transition-all duration-150"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Observation / Forecast Interactive Ticks */}
        <div className="relative flex justify-between items-center mt-1 px-1">
          {timeline.map((point, idx) => {
            const isSelected = idx === activePointIndex;
            const isPointNow = point.timeOffsetHours === 0;
            const pointCat = getCategoryColor(point.category);

            const parts = point.timestamp.split(' ');
            const timeStr = parts[1] || '';

            return (
              <button
                key={point.id}
                onClick={() => onSelectIndex(idx)}
                className="group flex flex-col items-center focus:outline-none relative"
                title={`${point.timestamp} - ${point.category} (${point.windSpeedKnots} kts)`}
              >
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-150 flex items-center justify-center ${
                    isSelected
                      ? 'scale-125 ring-2 ring-cyan-400 bg-white'
                      : isPointNow
                      ? 'ring-2 ring-red-500 bg-red-400'
                      : 'bg-zinc-600 hover:bg-zinc-300'
                  }`}
                  style={!isSelected && !isPointNow ? { backgroundColor: pointCat.hex } : {}}
                />

                <span
                  className={`text-[8.5px] font-mono leading-none mt-0.5 transition-colors ${
                    isSelected
                      ? 'text-cyan-400 font-bold block'
                      : isPointNow
                      ? 'text-red-400 font-bold block'
                      : 'text-zinc-400 group-hover:text-zinc-200 hidden sm:block'
                  }`}
                >
                  {isPointNow ? 'NOW' : timeStr.slice(0, 5) || `${point.timeOffsetHours}h`}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
