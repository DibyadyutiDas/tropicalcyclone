'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Compass,
  Flame,
  ChevronDown,
  Sun,
  Moon,
} from 'lucide-react';
import { Storm } from '@/lib/types/cyclone';
import { getCategoryColor } from '@/lib/utils/colors';

interface TopNavProps {
  storms: Storm[];
  selectedStorm: Storm;
  onSelectStorm: (storm: Storm) => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  storms,
  selectedStorm,
  onSelectStorm,
  theme = 'dark',
  onToggleTheme,
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

  const getCategoryShort = (cat: string): string => {
    if (cat.includes('Very Severe')) return 'VSCS';
    if (cat.includes('Extremely Severe')) return 'ESCS';
    if (cat.includes('Super')) return 'SuCS';
    if (cat.includes('Severe Cyclonic')) return 'SCS';
    if (cat.includes('Cyclonic Storm')) return 'CS';
    if (cat.includes('Deep Depression')) return 'DD';
    if (cat.includes('Depression')) return 'D';
    return cat;
  };

  const isLight = theme === 'light';

  return (
    <header
      className={`relative h-13 sm:h-14 w-full border-b transition-colors duration-200 px-2 sm:px-4 flex items-center justify-between gap-2 z-40 select-none shrink-0 shadow-md ${
        isLight
          ? 'bg-white/95 border-slate-200 text-slate-900 backdrop-blur-md'
          : 'bg-[#16161a]/95 border-zinc-800/80 text-zinc-100 backdrop-blur-md'
      }`}
    >
      {/* Left: Brand & Storm Selector */}
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1 mr-1">
        {/* Brand & Logo */}
        <div className="flex items-center gap-1.5 sm:gap-2 cursor-pointer select-none shrink-0">
          {/* Cyclone Radar Eye Emblem */}
          <div className="relative flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 text-cyan-500 shrink-0">
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7"
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
          <div className="flex items-center tracking-wider text-xs sm:text-sm font-bold font-sans">
            <span className={isLight ? 'text-slate-900' : 'text-white'}>STORM</span>
            <span className="text-cyan-500 font-semibold ml-0.5 hidden xs:inline">SENSE</span>
            <span
              className={`font-medium text-[9px] tracking-widest ml-1 self-center border px-1 py-0.2 rounded hidden sm:inline ${
                isLight
                  ? 'border-slate-300 bg-slate-100 text-cyan-600'
                  : 'border-zinc-700 bg-[#222226] text-cyan-400'
              }`}
            >
              AI
            </span>
          </div>
        </div>

        {/* Storm Selector Dropdown */}
        <div ref={dropdownRef} className="relative min-w-0 max-w-[130px] xs:max-w-[165px] sm:max-w-[210px] flex-1">
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className={`h-7 sm:h-8 w-full flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 rounded-lg border transition-colors text-[11px] sm:text-xs font-medium min-w-0 ${
              isLight
                ? 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-800'
                : 'bg-[#202025] border-zinc-700/80 hover:bg-[#282830] text-zinc-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 animate-pulse" />
            <span className={`${isLight ? 'text-slate-500' : 'text-zinc-400'} hidden md:inline shrink-0`}>Storm:</span>
            <span className={`font-medium truncate flex-1 min-w-0 text-left ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {selectedStorm.name}
            </span>
            <ChevronDown
              className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                isLight ? 'text-slate-500' : 'text-zinc-400'
              } shrink-0 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isDropdownOpen && (
            <div
              className={`absolute left-0 top-full mt-1.5 w-64 sm:w-72 max-w-[calc(100vw-24px)] rounded-xl border shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 ${
                isLight ? 'bg-white border-slate-200 shadow-slate-300/50' : 'bg-[#1c1c21] border-zinc-700'
              }`}
            >
              <div
                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border-b ${
                  isLight ? 'text-slate-500 border-slate-100' : 'text-zinc-400 border-zinc-800'
                }`}
              >
                Select Active System
              </div>
              <div className="py-1 max-h-64 overflow-y-auto">
                {storms.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onSelectStorm(s);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                      s.id === selectedStorm.id
                        ? isLight
                          ? 'bg-cyan-50 text-cyan-700 font-semibold border-l-2 border-cyan-500'
                          : 'bg-[#27272e] text-cyan-400 font-semibold border-l-2 border-cyan-400'
                        : isLight
                        ? 'text-slate-700 hover:bg-slate-50'
                        : 'text-zinc-200 hover:bg-[#27272e]'
                    }`}
                  >
                    <div className="truncate mr-2">
                      <div className={`truncate font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>{s.name}</div>
                      <div className={`text-[10px] truncate ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>{s.basin}</div>
                    </div>
                    <span className={`text-[10px] font-mono shrink-0 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                      {s.currentPoint.windSpeedKnots} kts
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Suite Module Switcher Links */}
        <nav className="hidden 2xl:flex items-center gap-1 ml-1 text-xs font-medium">
          <Link
            href="/"
            className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${
              isLight
                ? 'bg-cyan-100 text-cyan-800'
                : 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/60'
            }`}
          >
            Windy GIS
          </Link>
          <Link
            href="/live"
            className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
              isLight
                ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                : 'text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200'
            }`}
          >
            🔴 Live Ops
          </Link>
          <Link
            href="/monitor"
            className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
              isLight
                ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                : 'text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200'
            }`}
          >
            📊 Monitor
          </Link>
          <Link
            href="/storms"
            className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
              isLight
                ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                : 'text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200'
            }`}
          >
            📁 Storms
          </Link>
          <Link
            href="/chat"
            className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
              isLight
                ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                : 'text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200'
            }`}
          >
            💬 Copilot
          </Link>
        </nav>
      </div>

      {/* Middle: Telemetry Quick Ribbon (Visible on laptops & desktops) */}
      <div
        className={`hidden lg:flex items-center gap-2 xl:gap-3 px-2.5 sm:px-3 h-8 rounded-lg border text-[11px] xl:text-xs whitespace-nowrap shrink-0 shadow-inner ${
          isLight
            ? 'bg-slate-100 border-slate-200 text-slate-700'
            : 'bg-[#1a1a1f] border-zinc-700/80 text-zinc-200'
        }`}
      >
        <div className="flex items-center gap-1 xl:gap-1.5 shrink-0">
          <span className={`${isLight ? 'text-slate-500' : 'text-zinc-400'} hidden xl:inline`}>Category:</span>
          <span className={`font-semibold whitespace-nowrap ${catStyle.text}`}>
            {getCategoryShort(selectedStorm.currentPoint.category)}
          </span>
        </div>

        <div className={`h-3 w-px ${isLight ? 'bg-slate-300' : 'bg-zinc-700'} shrink-0`} />

        <div className="flex items-center gap-1 xl:gap-1.5 shrink-0">
          <svg
            className="w-3.5 h-3.5 text-cyan-500 shrink-0"
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
          <span className={isLight ? 'text-slate-500' : 'text-zinc-400'}>MSW:</span>
          <span className={`font-semibold whitespace-nowrap ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {selectedStorm.currentPoint.windSpeedKnots} kts
            <span className={`hidden xl:inline font-normal ml-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
              ({selectedStorm.currentPoint.windSpeedKmh} km/h)
            </span>
          </span>
        </div>

        <div className={`h-3 w-px ${isLight ? 'bg-slate-300' : 'bg-zinc-700'} shrink-0`} />

        <div className="flex items-center gap-1 xl:gap-1.5 shrink-0">
          <Compass className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span className={`${isLight ? 'text-slate-500' : 'text-zinc-400'} hidden xl:inline`}>Heading:</span>
          <span className={`font-semibold whitespace-nowrap ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {selectedStorm.currentPoint.movementHeadingText}
          </span>
        </div>

        <div className={`h-3 w-px ${isLight ? 'bg-slate-300' : 'bg-zinc-700'} shrink-0`} />

        <div className="flex items-center gap-1 xl:gap-1.5 shrink-0">
          <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className={`${isLight ? 'text-slate-500' : 'text-zinc-400'} hidden xl:inline`}>Trend:</span>
          <span className={`font-semibold whitespace-nowrap ${isLight ? 'text-amber-600' : 'text-amber-300'}`}>
            {selectedStorm.trend.trendStatus}
          </span>
        </div>
      </div>

      {/* Right: Controls, Theme Toggle & Clock */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Mobile Storm Category/Intensity Badge */}
        <div
          className={`flex sm:hidden items-center gap-1.5 px-2 h-7 rounded-lg border text-[10px] font-semibold shrink-0 ${
            isLight
              ? 'bg-slate-100 border-slate-200'
              : 'bg-[#202025] border-zinc-700/80'
          }`}
        >
          <span className={`font-bold ${catStyle.text}`}>
            {getCategoryShort(selectedStorm.currentPoint.category)}
          </span>
          <span className={isLight ? 'text-slate-300' : 'text-zinc-500'}>•</span>
          <span className={`font-mono font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>
            {selectedStorm.currentPoint.windSpeedKnots}kt
          </span>
        </div>

        {/* Dedicated Modern Theme Toggle Button */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            type="button"
            className={`relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg border transition-all duration-200 cursor-pointer shadow-sm ${
              isLight
                ? 'bg-amber-50 border-amber-200/80 text-amber-600 hover:bg-amber-100 hover:border-amber-300 hover:shadow-amber-100'
                : 'bg-[#202025] border-zinc-700/80 text-zinc-300 hover:text-cyan-400 hover:border-cyan-500/40 hover:bg-[#282830]'
            }`}
            aria-label={`Switch to ${isLight ? 'Dark' : 'Light'} theme`}
            title={`Switch to ${isLight ? 'Dark' : 'Light'} theme`}
          >
            {isLight ? (
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 transition-transform hover:rotate-45 duration-300" />
            ) : (
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 transition-transform hover:-rotate-12 duration-300" />
            )}
          </button>
        )}

        {/* UTC Clock (Tablet & Desktop) */}
        <div className="hidden sm:flex flex-col items-end text-right mr-0.5 whitespace-nowrap shrink-0">
          <span
            className={`font-mono text-[11px] font-medium whitespace-nowrap ${
              isLight ? 'text-slate-700' : 'text-zinc-200'
            }`}
          >
            {utcTime || '2026-08-28 06:00:00 UTC'}
          </span>
          <span
            className={`text-[9px] uppercase tracking-wider whitespace-nowrap ${
              isLight ? 'text-slate-400' : 'text-zinc-400'
            }`}
          >
            SYNOPTIC CYCLE 06Z
          </span>
        </div>
      </div>
    </header>
  );
};
