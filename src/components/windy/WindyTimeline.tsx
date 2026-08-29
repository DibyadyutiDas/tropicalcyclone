'use client';

import React, { useState, useEffect } from 'react';
import {
  FastForward,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Clock,
  Radio,
} from 'lucide-react';
import { ObservationPoint } from '@/lib/types/cyclone';
import { getCategoryColor } from '@/lib/utils/colors';

interface WindyTimelineProps {
  timeline: ObservationPoint[];
  activePointIndex: number;
  onSelectIndex: (index: number) => void;
}

export const WindyTimeline: React.FC<WindyTimelineProps> = ({
  timeline,
  activePointIndex,
  onSelectIndex,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Auto-advance playhead when playing
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = Math.max(700, 2000 / playbackSpeed);
    const timer = setInterval(() => {
      onSelectIndex((activePointIndex + 1) % timeline.length);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, activePointIndex, timeline.length, playbackSpeed, onSelectIndex]);

  const activePoint = timeline[activePointIndex] || timeline[0];
  const catStyle = getCategoryColor(activePoint.category);
  const isNow = activePoint.timeOffsetHours === 0;
  const isForecast = activePoint.timeOffsetHours > 0;

  // Group timeline points by day / synoptic periods
  const progressPercent = (activePointIndex / Math.max(1, timeline.length - 1)) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl bg-zinc-950/85 backdrop-blur-xl border border-zinc-800/90 p-3 shadow-2xl select-none text-zinc-100 flex flex-col gap-2.5 transition-all">
      {/* Top Row: Playback Controls & Frame Badge */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {/* Left: Player Actions (Windy Style Circular / Pill Buttons) */}
        <div className="flex items-center gap-2">
          {/* Step Back */}
          <button
            onClick={() => onSelectIndex(Math.max(0, activePointIndex - 1))}
            disabled={activePointIndex === 0}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-zinc-900/90 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-30 transition-colors"
            title="Step Back"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          {/* Glowing Windy Play / Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`h-9 px-4 rounded-full flex items-center gap-2 font-bold text-xs transition-all shadow-lg ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/25'
                : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/30'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                <span>PLAY</span>
              </>
            )}
          </button>

          {/* Step Forward */}
          <button
            onClick={() => onSelectIndex(Math.min(timeline.length - 1, activePointIndex + 1))}
            disabled={activePointIndex === timeline.length - 1}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-zinc-900/90 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-30 transition-colors"
            title="Step Forward"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          {/* Speed Toggle (1x, 2x, 4x) */}
          <button
            onClick={() => {
              const speeds = [1, 2, 4];
              const next = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
              setPlaybackSpeed(next);
            }}
            className="h-8 px-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-1"
          >
            <FastForward className="w-3 h-3 text-cyan-400" />
            <span>{playbackSpeed}x</span>
          </button>
        </div>

        {/* Center/Right: Current Timestamp & Category Status */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Timestamp Info */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-black/60 border border-zinc-800/80 font-mono text-xs">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-zinc-400 text-[11px] hidden sm:inline">Time:</span>
            <span className="font-bold text-white tracking-wide">
              {activePoint.timestamp}
            </span>
          </div>

          {/* Forecast / Obs Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
              isNow
                ? 'bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                : isForecast
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
            }`}
          >
            {isNow && <Radio className="w-3 h-3 animate-pulse text-red-400" />}
            <span>
              {isNow
                ? 'NOW (06Z Live)'
                : isForecast
                ? `+${activePoint.timeOffsetHours}h Forecast`
                : `${activePoint.timeOffsetHours}h Historical`}
            </span>
          </div>

          {/* Category Tag */}
          <div
            className={`hidden md:flex items-center px-2.5 py-1 rounded-xl text-xs font-bold border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
          >
            {activePoint.category}
          </div>
        </div>
      </div>

      {/* Bottom Row: Windy-Style Day & Hour Scrubber Ribbon */}
      <div className="relative pt-1">
        {/* Continuous Progress Background Track */}
        <div className="relative h-2 w-full bg-zinc-900/90 rounded-full border border-zinc-800 overflow-hidden cursor-pointer">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-amber-400 transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Synoptic Observation / Forecast Interactive Ticks */}
        <div className="relative flex justify-between items-start mt-2 px-1">
          {timeline.map((point, idx) => {
            const isSelected = idx === activePointIndex;
            const isPointNow = point.timeOffsetHours === 0;
            const pointCat = getCategoryColor(point.category);

            // Extract Day and Hour for Windy style display
            const parts = point.timestamp.split(' ');
            const dateStr = parts[0] || '';
            const timeStr = parts[1] || '';

            return (
              <button
                key={point.id}
                onClick={() => onSelectIndex(idx)}
                className="group flex flex-col items-center focus:outline-none relative"
                title={`${point.timestamp} - ${point.category} (${point.windSpeedKnots} kts)`}
              >
                {/* Tick dot indicator */}
                <div
                  className={`w-3 h-3 rounded-full transition-all duration-200 flex items-center justify-center ${
                    isSelected
                      ? 'scale-125 ring-2 ring-cyan-400 bg-white shadow-[0_0_10px_#22d3ee]'
                      : isPointNow
                      ? 'ring-2 ring-red-500 bg-red-400 animate-pulse'
                      : 'bg-zinc-700 hover:bg-zinc-400 group-hover:scale-110'
                  }`}
                  style={!isSelected && !isPointNow ? { backgroundColor: pointCat.hex } : {}}
                />

                {/* Day / Hour Label */}
                <div className="flex flex-col items-center mt-1">
                  <span
                    className={`text-[10px] font-mono leading-none transition-colors ${
                      isSelected
                        ? 'text-cyan-400 font-bold'
                        : isPointNow
                        ? 'text-red-400 font-bold'
                        : 'text-zinc-400 group-hover:text-zinc-200'
                    }`}
                  >
                    {isPointNow ? 'NOW' : timeStr.slice(0, 5) || `${point.timeOffsetHours}h`}
                  </span>
                  <span
                    className={`text-[8px] font-mono uppercase mt-0.5 ${
                      isSelected ? 'text-cyan-300 font-semibold' : 'text-zinc-400'
                    }`}
                  >
                    {dateStr.slice(5) || ''}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
