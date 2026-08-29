'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { TimelineScrubber } from './TimelineScrubber';
import { Storm, ObservationPoint } from '@/lib/types/cyclone';
import { Loader2 } from 'lucide-react';

const DynamicCycloneMap = dynamic(
  () => import('@/components/map/CycloneMap').then((mod) => mod.CycloneMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 rounded-2xl border border-slate-800 text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        <span className="text-xs font-semibold text-slate-300">
          Initializing MapLibre GIS WebGL Canvas...
        </span>
      </div>
    ),
  }
);

interface CenterPanelProps {
  storm: Storm;
  activePointIndex: number;
  onSelectIndex: (index: number) => void;
  activePoint: ObservationPoint;
}

export const CenterPanel: React.FC<CenterPanelProps> = ({
  storm,
  activePointIndex,
  onSelectIndex,
  activePoint,
}) => {
  return (
    <main className="w-full h-full flex flex-col gap-3 relative">
      {/* Interactive GIS Map (Flex 1) */}
      <div className="w-full flex-1 relative min-h-[400px]">
        <DynamicCycloneMap
          storm={storm}
          activePoint={activePoint}
          onSelectPoint={(pt) => {
            const idx = storm.timeline.findIndex((p) => p.id === pt.id);
            if (idx !== -1) onSelectIndex(idx);
          }}
        />
      </div>

      {/* Time-Series Timeline Bar (Bottom) */}
      <div className="w-full shrink-0">
        <TimelineScrubber
          timeline={storm.timeline}
          activePointIndex={activePointIndex}
          onSelectIndex={onSelectIndex}
        />
      </div>
    </main>
  );
};
