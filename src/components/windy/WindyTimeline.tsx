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

  const progressPercent = timeline.length > 1
    ? (activePointIndex / (timeline.length - 1)) * 100
    : 100;
  const isLight = theme === 'light';

  // Clean time display (e.g. strips raw .000 ms)
  const formatTimeDisplay = (ts: string) => {
    if (!ts) return '';
    return ts.replace('.000', '').trim();
  };

  // Dedicated light vs dark category badge styling
  const getCatBadgeStyles = (category: string) => {
    if (isLight) {
      if (category.includes('Super')) {
        return { bg: 'bg-purple-50 text-purple-900 border-purple-200', icon: 'text-purple-600' };
      }
      if (category.includes('Extremely')) {
        return { bg: 'bg-rose-50 text-rose-900 border-rose-200', icon: 'text-rose-600' };
      }
      if (category.includes('Very Severe')) {
        return { bg: 'bg-red-50 text-red-900 border-red-200', icon: 'text-red-600' };
      }
      if (category.includes('Severe Cyclonic')) {
        return { bg: 'bg-orange-50 text-orange-900 border-orange-200', icon: 'text-orange-600' };
      }
      if (category.includes('Cyclonic Storm')) {
        return { bg: 'bg-amber-50 text-amber-900 border-amber-200', icon: 'text-amber-600' };
      }
      if (category.includes('Deep Depression')) {
        return { bg: 'bg-emerald-50 text-emerald-900 border-emerald-200', icon: 'text-emerald-600' };
      }
      return { bg: 'bg-sky-50 text-sky-900 border-sky-200', icon: 'text-sky-600' };
    }
    return {
      bg: `${catStyle.bg} ${catStyle.text} border-zinc-700/60`,
      icon: 'text-cyan-400',
    };
  };

  const currentCatBadge = getCatBadgeStyles(activePoint.category);

  return (
    <div
      className={`w-full max-w-3xl mx-auto rounded-t-2xl rounded-b-none py-2.5 px-4 border-t border-x shadow-2xl select-none flex flex-col gap-1.5 transition-all ${
        isLight
          ? 'bg-white/95 backdrop-blur-xl border-slate-200 text-slate-900 shadow-slate-300/40'
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
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all border disabled:opacity-30 cursor-pointer ${
              isLight
                ? 'bg-white text-slate-700 hover:text-slate-950 hover:bg-slate-100 border-slate-200 shadow-xs'
                : 'bg-[#222228] text-zinc-300 hover:text-white hover:bg-zinc-700 border-zinc-700/50'
            }`}
            title="Step Back"
          >
            <SkipBack className="w-3.5 h-3.5 stroke-[2.2]" />
          </button>

          {/* Clean Windy Play / Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`h-7 px-3.5 rounded-full flex items-center gap-1.5 font-bold text-[11px] transition-all shadow-sm ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
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
            disabled={activePointIndex >= timeline.length - 1}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all border disabled:opacity-30 cursor-pointer ${
              isLight
                ? 'bg-white text-slate-700 hover:text-slate-950 hover:bg-slate-100 border-slate-200 shadow-xs'
                : 'bg-[#222228] text-zinc-300 hover:text-white hover:bg-zinc-700 border-zinc-700/50'
            }`}
            title="Step Forward"
          >
            <SkipForward className="w-3.5 h-3.5 stroke-[2.2]" />
          </button>
        </div>

        {/* Mobile Compact Active Time Pill */}
        <div className={`flex md:hidden items-center gap-1.5 px-2.5 h-7 rounded-full font-mono text-[10px] ml-auto border ${
          isLight ? 'bg-slate-50 border-slate-200 text-slate-900 shadow-xs' : 'bg-[#202026] border-zinc-700/80 text-white'
        }`}>
          <Clock className="w-2.5 h-2.5 text-cyan-600" />
          <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {isNow ? 'NOW' : (activePoint.timestamp.split(' ')[1] || `${activePoint.timeOffsetHours}h`)}
          </span>
          <span className={isLight ? 'text-slate-300' : 'text-zinc-500'}>•</span>
          <span className={`font-bold ${currentCatBadge.icon}`}>
            {activePoint.windSpeedKnots}kt
          </span>
        </div>

        {/* Center/Right: Current Timestamp & Wind Speed (Desktop) */}
        <div className="hidden md:flex items-center gap-1.5 ml-auto">
          {/* Timestamp Info */}
          <div className={`flex items-center gap-1.5 px-2.5 h-7 rounded-full font-mono text-[11px] border ${
            isLight ? 'bg-slate-50 border-slate-200 shadow-xs' : 'bg-[#202026] border-zinc-700/70'
          }`}>
            <Clock className={`w-3 h-3 ${isLight ? 'text-cyan-600' : 'text-cyan-500'}`} />
            <span className={`text-[10px] hidden sm:inline ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Time:</span>
            <span className={`font-bold tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {formatTimeDisplay(activePoint.timestamp)}
            </span>
          </div>

          {/* Forecast / Obs Badge */}
          <div
            className={`flex items-center px-2.5 h-7 rounded-full text-[11px] font-bold transition-colors border ${
              isNow
                ? isLight
                  ? 'bg-rose-50 text-rose-700 border-rose-200 shadow-xs'
                  : 'bg-rose-950/70 text-rose-300 border-rose-700/60'
                : isForecast
                ? isLight
                  ? 'bg-amber-50 text-amber-800 border-amber-200 shadow-xs'
                  : 'bg-amber-950/70 text-amber-300 border-amber-700/60'
                : isLight
                ? 'bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
                : 'bg-[#202026] text-zinc-300 border-zinc-700'
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
            className={`flex items-center gap-1.5 px-2.5 h-7 rounded-full text-[11px] font-bold border transition-colors shadow-xs ${currentCatBadge.bg}`}
          >
            <svg
              className={`w-3 h-3 shrink-0 ${currentCatBadge.icon}`}
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
            <span className={`text-[10px] font-normal ${isLight ? 'text-slate-600' : 'opacity-85'} hidden sm:inline`}>
              ({activePoint.windSpeedKmh} km/h)
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Day & Hour Scrubber Ribbon */}
      <div className="relative pt-0.5">
        <div className={`relative h-1.5 w-full rounded-full overflow-hidden cursor-pointer border ${
          isLight ? 'bg-slate-100 border-slate-200 shadow-inner' : 'bg-[#121214] border-zinc-800'
        }`}>
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
                title={`${formatTimeDisplay(point.timestamp)} - ${point.category} (${point.windSpeedKnots} kts)`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-150 flex items-center justify-center ${
                    isSelected
                      ? isLight
                        ? 'scale-125 ring-2 ring-sky-600 bg-sky-600 shadow-xs'
                        : 'scale-125 ring-2 ring-cyan-400 bg-white'
                      : isPointNow
                      ? isLight
                        ? 'ring-2 ring-rose-500 bg-rose-500 scale-110 shadow-xs'
                        : 'ring-2 ring-red-500 bg-red-400'
                      : isLight
                      ? 'bg-slate-300 hover:bg-slate-500 border border-slate-400/60'
                      : 'bg-zinc-600 hover:bg-zinc-300'
                  }`}
                  style={!isSelected && !isPointNow ? { backgroundColor: pointCat.hex } : {}}
                />

                <span
                  className={`text-[9px] font-mono leading-none mt-1 transition-colors ${
                    isSelected
                      ? isLight
                        ? 'text-sky-700 font-bold block'
                        : 'text-cyan-400 font-bold block'
                      : isPointNow
                      ? isLight
                        ? 'text-rose-600 font-bold block'
                        : 'text-red-500 font-bold block'
                      : isLight
                      ? 'text-slate-600 group-hover:text-slate-900 hidden sm:block font-medium'
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
