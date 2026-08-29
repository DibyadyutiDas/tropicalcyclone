import { CycloneCategory, AlertSeverity, StormStage } from '../types/cyclone';

export function getCategoryColor(category: CycloneCategory): {
  bg: string;
  text: string;
  border: string;
  dot: string;
  hex: string;
} {
  switch (category) {
    case 'Super Cyclonic Storm':
      return {
        bg: 'bg-purple-950/60',
        text: 'text-purple-400',
        border: 'border-purple-600',
        dot: 'bg-purple-500',
        hex: '#a855f7',
      };
    case 'Extremely Severe Cyclonic Storm':
      return {
        bg: 'bg-rose-950/60',
        text: 'text-rose-400',
        border: 'border-rose-600',
        dot: 'bg-rose-500',
        hex: '#f43f5e',
      };
    case 'Very Severe Cyclone':
    case 'Very Severe Cyclonic Storm':
      return {
        bg: 'bg-red-950/60',
        text: 'text-red-400',
        border: 'border-red-600',
        dot: 'bg-red-500',
        hex: '#ef4444',
      };
    case 'Severe Cyclonic Storm':
      return {
        bg: 'bg-orange-950/60',
        text: 'text-orange-400',
        border: 'border-orange-600',
        dot: 'bg-orange-500',
        hex: '#f97316',
      };
    case 'Cyclonic Storm':
      return {
        bg: 'bg-amber-950/60',
        text: 'text-amber-400',
        border: 'border-amber-600',
        dot: 'bg-amber-500',
        hex: '#f59e0b',
      };
    case 'Deep Depression':
      return {
        bg: 'bg-emerald-950/60',
        text: 'text-emerald-400',
        border: 'border-emerald-600',
        dot: 'bg-emerald-500',
        hex: '#10b981',
      };
    case 'Depression':
    default:
      return {
        bg: 'bg-cyan-950/60',
        text: 'text-cyan-400',
        border: 'border-cyan-600',
        dot: 'bg-cyan-500',
        hex: '#06b6d4',
      };
  }
}

export function getAlertSeverityBadge(severity: AlertSeverity): {
  bg: string;
  text: string;
  border: string;
} {
  switch (severity) {
    case 'RED':
      return { bg: 'bg-red-950/50 text-red-400 border-red-700', text: 'text-red-400', border: 'border-red-700' };
    case 'ORANGE':
      return { bg: 'bg-orange-950/50 text-orange-400 border-orange-700', text: 'text-orange-400', border: 'border-orange-700' };
    case 'YELLOW':
      return { bg: 'bg-yellow-950/50 text-yellow-400 border-yellow-700', text: 'text-yellow-400', border: 'border-yellow-700' };
    case 'GREEN':
    default:
      return { bg: 'bg-emerald-950/50 text-emerald-400 border-emerald-700', text: 'text-emerald-400', border: 'border-emerald-700' };
  }
}

export function getStageColor(stage: StormStage): string {
  switch (stage) {
    case 'Developing':
      return 'text-cyan-400';
    case 'Organizing':
      return 'text-amber-400';
    case 'Mature':
      return 'text-rose-400';
    case 'Weakening':
      return 'text-purple-400';
  }
}
