'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Flame,
  ChevronDown,
} from 'lucide-react';
import { Storm } from '@/lib/types/cyclone';
import { getCategoryColor } from '@/lib/utils/colors';

interface TopNavProps {
  storms: Storm[];
  selectedStorm: Storm;
  onSelectStorm: (storm: Storm) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  storms,
  selectedStorm,
  onSelectStorm,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [utcTime, setUtcTime] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(
        now.toISOString().slice(0, 19).replace('T', ' ') + ' UTC'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const catStyle = getCategoryColor(selectedStorm.currentPoint.category);

  return (
    <header className="relative h-14 w-full border-b border-zinc-800 bg-black px-3 sm:px-4 flex items-center justify-between gap-2 z-40 select-none shrink-0">
      {/* Left: Brand & Storm Selector */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
        {/* Brand & Logo */}
        <div className="flex items-center gap-2 cursor-pointer select-none shrink-0">
          {/* Cyclone Radar Eye Emblem */}
          <div className="relative flex items-center justify-center w-7 h-7 text-cyan-400 shrink-0">
            <svg
              className="w-7 h-7"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer ring */}
              <circle
                cx="16"
                cy="16"
                r="13.5"
                stroke="currentColor"
                strokeWidth="1.75"
                className="opacity-90"
              />
              {/* Eye / Lens contour */}
              <path
                d="M 6.5 16 C 10 9.5, 22 9.5, 25.5 16 C 22 22.5, 10 22.5, 6.5 16 Z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              {/* Center Storm Eye Dot */}
              <circle cx="16" cy="16" r="2.5" fill="currentColor" />
            </svg>
          </div>

          {/* Logotype */}
          <div className="flex items-center tracking-wider text-sm font-bold font-sans">
            <span className="text-white">STORM</span>
            <span className="text-cyan-400 font-semibold ml-0.5">SENSE</span>
            <span className="text-zinc-500 font-medium text-[10px] tracking-widest ml-1 self-center border border-zinc-800 px-1 py-0.2 rounded">
              AI
            </span>
          </div>
        </div>

        {/* Storm Selector Dropdown */}
        <div ref={dropdownRef} className="relative ml-1 sm:ml-2 shrink-0">
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="h-8 flex items-center gap-1.5 px-2.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800/80 transition-colors text-xs font-medium text-zinc-200"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 animate-pulse" />
            <span className="text-zinc-400 hidden md:inline">Storm:</span>
            <span className="text-white font-medium truncate max-w-[110px] sm:max-w-[160px]">
              {selectedStorm.name}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 ml-0.5 shrink-0 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-72 rounded-xl bg-zinc-950 border border-zinc-700/80 shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800/80">
                Select Active System
              </div>
              <div className="py-1">
                {storms.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onSelectStorm(s);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-zinc-900 transition-colors ${
                      s.id === selectedStorm.id
                        ? 'bg-zinc-900/80 text-cyan-400 font-semibold border-l-2 border-cyan-400'
                        : 'text-zinc-300'
                    }`}
                  >
                    <div className="truncate mr-2">
                      <div className="truncate text-white font-medium">{s.name}</div>
                      <div className="text-[10px] text-zinc-400 truncate">{s.basin}</div>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400 shrink-0">
                      {s.currentPoint.windSpeedKnots} kts
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Middle: Telemetry Quick Ribbon (Visible on laptops & desktops) */}
      <div className="hidden lg:flex items-center gap-2 xl:gap-3 px-2.5 sm:px-3 h-8 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] xl:text-xs text-zinc-300 whitespace-nowrap shrink-0">
        <div className="flex items-center gap-1 xl:gap-1.5 shrink-0">
          <span className="text-zinc-400 hidden xl:inline">Category:</span>
          <span className={`font-semibold whitespace-nowrap ${catStyle.text}`}>
            {selectedStorm.currentPoint.category}
          </span>
        </div>

        <div className="h-3 w-px bg-zinc-800 shrink-0" />

        <div className="flex items-center gap-1 xl:gap-1.5 shrink-0">
          <svg
            className="w-3.5 h-3.5 text-cyan-400 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M 12 3 C 16.5 3 20 6.5 20 11 C 20 13.8 18 16 15.5 16.8" />
            <path d="M 12 21 C 7.5 21 4 17.5 4 13 C 4 10.2 6 8 8.5 7.2" />
            <circle cx="12" cy="12" r="2.5" fill="currentColor" />
          </svg>
          <span className="text-zinc-400">MSW:</span>
          <span className="font-semibold text-white whitespace-nowrap">
            {selectedStorm.currentPoint.windSpeedKnots} kts
            <span className="hidden xl:inline text-zinc-400 font-normal ml-1">
              ({selectedStorm.currentPoint.windSpeedKmh} km/h)
            </span>
          </span>
        </div>

        <div className="h-3 w-px bg-zinc-800 shrink-0" />

        <div className="flex items-center gap-1 xl:gap-1.5 shrink-0">
          <Compass className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="text-zinc-400 hidden xl:inline">Heading:</span>
          <span className="font-semibold text-white whitespace-nowrap">
            {selectedStorm.currentPoint.movementHeadingText}
          </span>
        </div>

        <div className="h-3 w-px bg-zinc-800 shrink-0" />

        <div className="flex items-center gap-1 xl:gap-1.5 shrink-0">
          <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="text-zinc-400 hidden xl:inline">Trend:</span>
          <span className="font-semibold text-amber-300 whitespace-nowrap">
            {selectedStorm.trend.trendStatus}
          </span>
        </div>
      </div>

      {/* Right: Controls & Clock */}
      <div className="flex items-center gap-2 shrink-0">
        {/* UTC Clock */}
        <div className="hidden sm:flex flex-col items-end text-right mr-1 whitespace-nowrap shrink-0">
          <span className="font-mono text-[11px] text-zinc-300 font-medium whitespace-nowrap">
            {utcTime || '2026-08-28 06:00:00 UTC'}
          </span>
          <span className="text-[9px] text-zinc-400 uppercase tracking-wider whitespace-nowrap">
            SYNOPTIC CYCLE 06Z
          </span>
        </div>
      </div>
    </header>
  );
};
