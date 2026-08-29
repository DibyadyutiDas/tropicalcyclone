'use client';

import React from 'react';
import {
  FileText,
  Anchor,
  Wind,
  Waves,
  Clock,
} from 'lucide-react';
import { Storm } from '@/lib/types/cyclone';

interface IMDBulletinFeedProps {
  storm: Storm;
}

export const IMDBulletinFeed: React.FC<IMDBulletinFeedProps> = ({ storm }) => {
  const bulletins = storm.imdBulletins;

  return (
    <div className="flex flex-col h-full bg-zinc-950 rounded-xl border border-zinc-800 p-3.5 overflow-y-auto custom-scrollbar text-xs text-zinc-200 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-zinc-900 border border-zinc-800 text-red-400">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-white">IMD Official Bulletins</h3>
            <p className="text-[10px] text-zinc-400">RSMC Tropical Cyclone Feed</p>
          </div>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-900 text-red-400 border border-zinc-800">
          LIVE SYNC
        </span>
      </div>

      {bulletins.length === 0 ? (
        <div className="p-6 text-center text-zinc-500 text-xs">
          No active bulletins for this historical reference replay.
        </div>
      ) : (
        <div className="space-y-2.5">
          {bulletins.map((b) => (
            <div
              key={b.id}
              className="p-3 rounded-lg bg-black border border-zinc-800/80 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-semibold text-cyan-400 text-[11px]">
                  {b.bulletinNo}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-zinc-400 font-mono">
                  <Clock className="w-3 h-3 text-zinc-400" />
                  {b.issuedAt}
                </span>
              </div>

              <h4 className="font-medium text-white text-[11px] leading-snug">
                {b.headline}
              </h4>

              <p className="text-[10px] text-zinc-300 leading-relaxed bg-zinc-950 p-2 rounded border border-zinc-800/80">
                {b.synopsis}
              </p>

              <div className="space-y-1 pt-1 text-[10px]">
                <div className="flex items-start gap-1.5 text-amber-300">
                  <Wind className="w-3 h-3 shrink-0 mt-0.5" />
                  <span><strong>Wind:</strong> {b.windWarning}</span>
                </div>

                <div className="flex items-start gap-1.5 text-sky-300">
                  <Waves className="w-3 h-3 shrink-0 mt-0.5" />
                  <span><strong>Sea:</strong> {b.seaCondition}</span>
                </div>

                <div className="flex items-start gap-1.5 text-rose-400">
                  <Anchor className="w-3 h-3 shrink-0 mt-0.5" />
                  <span><strong>Advisory:</strong> {b.fishermenWarning}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
