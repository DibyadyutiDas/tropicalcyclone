'use client';

import React, { useState, useEffect } from 'react';
import {
  FastForward,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Clock,
} from 'lucide-react';
import { ObservationPoint } from '@/lib/types/cyclone';
import { getCategoryColor } from '@/lib/utils/colors';

interface TimelineScrubberProps {
  timeline: ObservationPoint[];
  activePointIndex: number;
  onSelectIndex: (index: number) => void;
}

export const TimelineScrubber: React.FC<TimelineScrubberProps> = ({
  timeline,
  activePointIndex,
  onSelectIndex,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Auto-advance playhead when playing
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = Math.max(800, 2000 / playbackSpeed);
    const timer = setInterval(() => {
      onSelectIndex((activePointIndex + 1) % timeline.length);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, activePointIndex, timeline.length, playbackSpeed, onSelectIndex]);

  const activePoint = timeline[activePointIndex] || timeline[0];
  const catStyle = getCategoryColor(activePoint.category);

  return (
    <div className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-2.5 shadow-sm flex flex-col gap-2 select-none">
      <div className="flex items-center justify-between">
        {/* Playback Controls (All standard uniform button sizes) */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onSelectIndex(Math.max(0, activePointIndex - 1))}
            disabled={activePointIndex === 0}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-30 transition-colors"
            title="Step Backward"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="h-8 flex items-center gap-1.5 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play</span>
              </>
            )}
          </button>

          <button
            onClick={() => onSelectIndex(Math.min(timeline.length - 1, activePointIndex + 1))}
            disabled={activePointIndex === timeline.length - 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-30 transition-colors"
            title="Step Forward"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          {/* Speed Toggle */}
          <button
            onClick={() => {
              const speeds = [1, 2, 4];
              const next = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
              setPlaybackSpeed(next);
            }}
            className="h-8 flex items-center gap-1 px-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <FastForward className="w-3 h-3 text-cyan-400" />
            <span>{playbackSpeed}x</span>
          </button>
        </div>

        {/* Current Scrubber Timestamp Badge */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 h-8 rounded-lg bg-black border border-zinc-800 text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-zinc-400 font-sans">Frame:</span>
            <span className="font-semibold text-white">
              {activePoint.timestamp}
            </span>
          </div>

          <div
            className={`h-8 flex items-center px-2.5 rounded-lg text-xs font-semibold border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
          >
            {activePoint.timeOffsetHours === 0
              ? 'NOW (06Z)'
              : activePoint.timeOffsetHours > 0
              ? `+${activePoint.timeOffsetHours}h Forecast`
              : `${activePoint.timeOffsetHours}h Obs`}
          </div>
        </div>
      </div>

      {/* Timeline Slider Track */}
      <div className="relative pt-1">
        {/* Scrubber track line */}
        <div className="relative h-1.5 w-full bg-zinc-900 rounded-full border border-zinc-800/80 overflow-hidden">
          <div
            className="h-full bg-cyan-400 transition-all duration-300"
            style={{
              width: `${(activePointIndex / (timeline.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Ticks along the timeline */}
        <div className="relative flex justify-between mt-1.5">
          {timeline.map((point, idx) => {
            const isSelected = idx === activePointIndex;
            const isNow = point.timeOffsetHours === 0;
            const pointCat = getCategoryColor(point.category);

            return (
              <button
                key={point.id}
                onClick={() => onSelectIndex(idx)}
                className="group flex flex-col items-center focus:outline-none"
              >
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-150 ${
                    isSelected
                      ? 'scale-150 ring-2 ring-cyan-400 bg-white'
                      : isNow
                      ? 'ring-1 ring-red-500 bg-red-400'
                      : 'bg-zinc-700 hover:bg-zinc-400'
                  }`}
                  style={!isSelected && !isNow ? { backgroundColor: pointCat.hex } : {}}
                />
                <span
                  className={`text-[9px] mt-1 font-mono transition-colors ${
                    isSelected
                      ? 'text-cyan-400 font-bold'
                      : isNow
                      ? 'text-red-400 font-semibold'
                      : 'text-zinc-400 group-hover:text-zinc-300'
                  }`}
                >
                  {point.timeOffsetHours === 0
                    ? 'NOW'
                    : point.timeOffsetHours > 0
                    ? `+${point.timeOffsetHours}h`
                    : `${point.timeOffsetHours}h`}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
