'use client';

import React from 'react';
import {
  ShieldAlert,
  Users,
  Waves,
  Wind,
  CheckSquare,
  MapPin,
} from 'lucide-react';
import { Storm } from '@/lib/types/cyclone';
import { getAlertSeverityBadge } from '@/lib/utils/colors';

interface ActionableAlertsProps {
  storm: Storm;
}

export const ActionableAlerts: React.FC<ActionableAlertsProps> = ({ storm }) => {
  const alerts = storm.coastalAlerts;

  return (
    <div className="flex flex-col h-full bg-zinc-950 rounded-xl border border-zinc-800 p-3.5 overflow-y-auto custom-scrollbar text-xs text-zinc-200 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-zinc-900 border border-zinc-800 text-rose-400">
            <ShieldAlert className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-white">Coastal Threat Matrix</h3>
            <p className="text-[10px] text-zinc-400">Regional Risk & Directives</p>
          </div>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-900 text-rose-400 border border-zinc-800">
          {alerts.filter((a) => a.warningLevel === 'RED').length} RED ALERTS
        </span>
      </div>

      {alerts.length === 0 ? (
        <div className="p-6 text-center text-zinc-500 text-xs">
          No coastal alerts active for this replay scenario.
        </div>
      ) : (
        <div className="space-y-2.5">
          {alerts.map((alert) => {
            const badge = getAlertSeverityBadge(alert.warningLevel);

            return (
              <div
                key={alert.id}
                className="p-3 rounded-lg bg-black border border-zinc-800/80 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-medium text-white text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{alert.region}</span>
                  </div>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${badge.bg}`}
                  >
                    {alert.warningLevel}
                  </span>
                </div>

                <div className="text-[10px] text-zinc-400">
                  {alert.state}
                </div>

                {/* Threat Stats */}
                <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                  <div className="p-1.5 rounded bg-zinc-950 border border-zinc-800/80 flex items-center gap-1.5">
                    <Waves className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <div>
                      <span className="text-[9px] text-zinc-400 block">Surge</span>
                      <span className="font-semibold text-white font-mono text-[11px]">
                        {alert.surgeHeightMeters}m
                      </span>
                    </div>
                  </div>

                  <div className="p-1.5 rounded bg-zinc-950 border border-zinc-800/80 flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <div>
                      <span className="text-[9px] text-zinc-400 block">Peak Gusts</span>
                      <span className="font-semibold text-white font-mono text-[11px]">
                        {alert.windGustThreat}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Population & Evacuation status */}
                <div className="p-2 rounded bg-zinc-950 border border-zinc-800/80 text-[10px] space-y-0.5">
                  <div className="flex items-center justify-between text-zinc-300">
                    <span className="flex items-center gap-1 text-zinc-400">
                      <Users className="w-3 h-3 text-amber-400" /> Population:
                    </span>
                    <strong className="text-white font-mono">
                      {alert.affectedPopulationEstimate}
                    </strong>
                  </div>
                  <div className="text-amber-300 font-medium">
                    {alert.evacuationStatus}
                  </div>
                </div>

                {/* Action Item */}
                <div className="flex items-start gap-1.5 text-[10px] text-zinc-300 bg-zinc-950 p-2 rounded border border-zinc-800/80">
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Directive:</strong> {alert.keyActionItem}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
