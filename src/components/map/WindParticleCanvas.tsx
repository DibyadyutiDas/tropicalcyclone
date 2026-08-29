'use client';

import React, { useEffect, useRef } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';

interface WindParticleCanvasProps {
  map: MapLibreMap | null;
  centerLat: number;
  centerLng: number;
  maxWindKnots: number;
  visible: boolean;
  waterVapor?: boolean;
  thermalIR?: boolean;
  rainRadar?: boolean;
  waves?: boolean;
  pressure?: boolean;
  gradCam?: boolean;
}

interface Particle {
  lat: number;
  lng: number;
  prevX: number;
  prevY: number;
  age: number;
  maxAge: number;
  speedMultiplier: number;
}

// Map speed to clean white/cyan particle glow with Windy vibrant ramp
function getParticleColor(speedNorm: number): string {
  if (speedNorm < 0.2) return 'rgba(180, 230, 255, 0.4)';
  if (speedNorm < 0.45) return 'rgba(56, 189, 248, 0.7)';
  if (speedNorm < 0.7) return 'rgba(52, 211, 153, 0.85)';
  if (speedNorm < 0.88) return 'rgba(250, 204, 21, 0.95)';
  return 'rgba(244, 63, 94, 1.0)';
}

export const WindParticleCanvas: React.FC<WindParticleCanvasProps> = ({
  map,
  centerLat,
  centerLng,
  maxWindKnots,
  visible,
  waterVapor = false,
  thermalIR = false,
  rainRadar = false,
  waves = false,
  pressure = false,
  gradCam = false,
}) => {
  const fgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameId = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  // 1. Render Meteorological Satellite / Radar / Waves / Isobars Overlays
  useEffect(() => {
    if (!map) return;
    const canvas = overlayCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawOverlay = () => {
      const container = map.getContainer();
      if (!container) return;
      if (canvas.width !== container.clientWidth || canvas.height !== container.clientHeight) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const hasOverlay = waterVapor || thermalIR || rainRadar || waves || pressure || gradCam;
      if (!hasOverlay) return;

      const centerScreen = map.project([centerLng, centerLat]);
      const zoom = map.getZoom();
      const radiusPx = Math.max(120, Math.pow(2, zoom - 2) * 48);

      // A. WATER VAPOR (Atmospheric moisture stream)
      if (waterVapor) {
        const wvGrad = ctx.createRadialGradient(
          centerScreen.x,
          centerScreen.y,
          0,
          centerScreen.x,
          centerScreen.y,
          radiusPx * 2.3
        );
        wvGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
        wvGrad.addColorStop(0.35, 'rgba(14, 165, 233, 0.3)');
        wvGrad.addColorStop(0.7, 'rgba(3, 105, 161, 0.15)');
        wvGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');

        ctx.fillStyle = wvGrad;
        ctx.beginPath();
        ctx.arc(centerScreen.x, centerScreen.y, radiusPx * 2.3, 0, Math.PI * 2);
        ctx.fill();

        // Spiral moisture bands
        ctx.save();
        ctx.translate(centerScreen.x, centerScreen.y);
        ctx.rotate(-0.4);
        ctx.strokeStyle = 'rgba(186, 230, 253, 0.22)';
        ctx.lineWidth = radiusPx * 0.28;
        ctx.beginPath();
        ctx.arc(0, 0, radiusPx * 1.1, 0.5, Math.PI * 1.4);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, radiusPx * 1.6, Math.PI * 0.8, Math.PI * 1.9);
        ctx.stroke();
        ctx.restore();
      }

      // B. THERMAL IR (Cold convective cloud top temperature palette)
      if (thermalIR) {
        const irGrad = ctx.createRadialGradient(
          centerScreen.x,
          centerScreen.y,
          0,
          centerScreen.x,
          centerScreen.y,
          radiusPx * 1.85
        );
        irGrad.addColorStop(0, 'rgba(244, 63, 94, 0.7)'); // Core deep convective red (-80°C)
        irGrad.addColorStop(0.2, 'rgba(236, 72, 153, 0.55)'); // Pink
        irGrad.addColorStop(0.45, 'rgba(168, 85, 247, 0.4)'); // Purple
        irGrad.addColorStop(0.75, 'rgba(59, 130, 246, 0.22)'); // Cold blue
        irGrad.addColorStop(1, 'rgba(59, 130, 246, 0)');

        ctx.fillStyle = irGrad;
        ctx.beginPath();
        ctx.arc(centerScreen.x, centerScreen.y, radiusPx * 1.85, 0, Math.PI * 2);
        ctx.fill();
      }

      // C. RAIN & CONVECTIVE RADAR (Doppler reflectivity echoes in dBZ)
      if (rainRadar) {
        const radarGrad = ctx.createRadialGradient(
          centerScreen.x,
          centerScreen.y,
          radiusPx * 0.12,
          centerScreen.x,
          centerScreen.y,
          radiusPx * 1.6
        );
        radarGrad.addColorStop(0, 'rgba(220, 38, 38, 0.75)'); // Intense red precipitation core > 55 dBZ
        radarGrad.addColorStop(0.25, 'rgba(249, 115, 22, 0.65)'); // Orange
        radarGrad.addColorStop(0.5, 'rgba(234, 179, 8, 0.5)'); // Yellow
        radarGrad.addColorStop(0.75, 'rgba(34, 197, 94, 0.35)'); // Green rain band
        radarGrad.addColorStop(1, 'rgba(34, 197, 94, 0)');

        ctx.fillStyle = radarGrad;
        ctx.beginPath();
        ctx.arc(centerScreen.x, centerScreen.y, radiusPx * 1.6, 0, Math.PI * 2);
        ctx.fill();

        // Convective rain spiral feeder bands
        ctx.save();
        ctx.translate(centerScreen.x, centerScreen.y);
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
        ctx.lineWidth = radiusPx * 0.18;
        ctx.beginPath();
        ctx.arc(0, 0, radiusPx * 0.7, 0.2, Math.PI * 1.2);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(234, 179, 8, 0.35)';
        ctx.lineWidth = radiusPx * 0.22;
        ctx.beginPath();
        ctx.arc(0, 0, radiusPx * 1.2, Math.PI * 0.7, Math.PI * 1.8);
        ctx.stroke();
        ctx.restore();
      }

      // D. WAVES & SWELL (Oceanic swell heights)
      if (waves) {
        const waveRings = [0.4, 0.8, 1.2, 1.6, 2.0];
        ctx.save();
        waveRings.forEach((scale, i) => {
          ctx.strokeStyle = `rgba(59, 130, 246, ${0.4 - i * 0.06})`;
          ctx.lineWidth = 2.5;
          ctx.setLineDash([8, 6]);
          ctx.beginPath();
          ctx.arc(centerScreen.x, centerScreen.y, radiusPx * scale, 0, Math.PI * 2);
          ctx.stroke();

          // Swell height annotations
          const swellH = (6.5 - i * 1.0).toFixed(1);
          ctx.fillStyle = 'rgba(147, 197, 253, 0.85)';
          ctx.font = 'bold 10px monospace';
          ctx.fillText(`${swellH}m`, centerScreen.x + radiusPx * scale - 12, centerScreen.y - 6);
        });
        ctx.restore();
      }

      // E. PRESSURE & ISOBARS (MSLP contours)
      if (pressure) {
        const isobars = [
          { r: 0.3, p: '940 hPa' },
          { r: 0.6, p: '960 hPa' },
          { r: 0.9, p: '980 hPa' },
          { r: 1.3, p: '996 hPa' },
          { r: 1.7, p: '1004 hPa' },
          { r: 2.1, p: '1008 hPa' },
        ];
        ctx.save();
        isobars.forEach((iso) => {
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.arc(centerScreen.x, centerScreen.y, radiusPx * iso.r, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = 'rgba(252, 211, 77, 0.9)';
          ctx.font = 'bold 10px monospace';
          ctx.fillText(iso.p, centerScreen.x + radiusPx * iso.r - 20, centerScreen.y + 12);
        });

        // Center Low marker
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('L', centerScreen.x - 6, centerScreen.y + 6);
        ctx.restore();
      }

      // F. GRAD-CAM ATTENTION (Model focal attention map)
      if (gradCam) {
        const camGrad = ctx.createRadialGradient(
          centerScreen.x,
          centerScreen.y,
          0,
          centerScreen.x,
          centerScreen.y,
          radiusPx * 1.4
        );
        camGrad.addColorStop(0, 'rgba(234, 179, 8, 0.7)');
        camGrad.addColorStop(0.35, 'rgba(239, 68, 68, 0.5)');
        camGrad.addColorStop(0.7, 'rgba(147, 51, 234, 0.25)');
        camGrad.addColorStop(1, 'rgba(147, 51, 234, 0)');

        ctx.fillStyle = camGrad;
        ctx.beginPath();
        ctx.arc(centerScreen.x, centerScreen.y, radiusPx * 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // G. Realistic Stadium Eyewall Cloud Canopy
      const eyeHoleRadius = Math.max(10, radiusPx * 0.14);
      const eyewallRadius = Math.max(34, radiusPx * 0.5);

      const eyeWallGrad = ctx.createRadialGradient(
        centerScreen.x,
        centerScreen.y,
        eyeHoleRadius,
        centerScreen.x,
        centerScreen.y,
        eyewallRadius
      );
      eyeWallGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      eyeWallGrad.addColorStop(0.2, 'rgba(255, 255, 255, 0.45)');
      eyeWallGrad.addColorStop(0.65, 'rgba(200, 235, 255, 0.2)');
      eyeWallGrad.addColorStop(1, 'rgba(200, 235, 255, 0)');

      ctx.fillStyle = eyeWallGrad;
      ctx.beginPath();
      ctx.arc(centerScreen.x, centerScreen.y, eyewallRadius, 0, Math.PI * 2);
      ctx.fill();
    };

    drawOverlay();
    map.on('move', drawOverlay);
    map.on('zoom', drawOverlay);
    map.on('resize', drawOverlay);

    return () => {
      map.off('move', drawOverlay);
      map.off('zoom', drawOverlay);
      map.off('resize', drawOverlay);
    };
  }, [map, centerLat, centerLng, waterVapor, thermalIR, rainRadar, waves, pressure, gradCam]);

  // 2. Wind Particle Simulation Loop
  useEffect(() => {
    if (!visible || !map) return;

    const fgCanvas = fgCanvasRef.current;
    if (!fgCanvas) return;
    const fgCtx = fgCanvas.getContext('2d', { alpha: true });
    if (!fgCtx) return;

    const resize = () => {
      const container = map.getContainer();
      if (!container) return;
      fgCanvas.width = container.clientWidth;
      fgCanvas.height = container.clientHeight;
    };

    resize();
    map.on('resize', resize);

    const NUM_PARTICLES = 1050;

    const spawnParticle = (): Particle => {
      const bounds = map.getBounds();
      const pad = 6;
      const s = bounds.getSouth() - pad;
      const n = bounds.getNorth() + pad;
      const w = bounds.getWest() - pad;
      const e = bounds.getEast() + pad;

      const lat = s + Math.random() * (n - s);
      const lng = w + Math.random() * (e - w);

      const pos = map.project([lng, lat]);
      return {
        lat,
        lng,
        prevX: pos.x,
        prevY: pos.y,
        age: 0,
        maxAge: 70 + Math.floor(Math.random() * 90),
        speedMultiplier: 0.75 + Math.random() * 0.45,
      };
    };

    particlesRef.current = Array.from({ length: NUM_PARTICLES }, spawnParticle);

    const render = () => {
      if (!fgCanvas || !fgCtx || !map) return;

      // Clean trail fading for silky streamlines
      fgCtx.globalCompositeOperation = 'destination-in';
      fgCtx.fillStyle = 'rgba(0, 0, 0, 0.94)';
      fgCtx.fillRect(0, 0, fgCanvas.width, fgCanvas.height);
      fgCtx.globalCompositeOperation = 'source-over';

      const particles = particlesRef.current;
      const isNorthernHemisphere = centerLat >= 0;
      const bounds = map.getBounds();
      const time = Date.now() / 25000;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.age++;

        const pad = 4;
        const outOfBounds =
          p.lat < bounds.getSouth() - pad ||
          p.lat > bounds.getNorth() + pad ||
          p.lng < bounds.getWest() - pad ||
          p.lng > bounds.getEast() + pad;

        if (p.age >= p.maxAge || outOfBounds) {
          particles[i] = spawnParticle();
          continue;
        }

        const dLat = p.lat - centerLat;
        const dLng = p.lng - centerLng;
        const dist = Math.sqrt(dLat * dLat + dLng * dLng);

        let u = 0;
        let v = 0;

        // Gentle ambient background flow
        const ambientSpeed = 0.0035;
        u += Math.sin(p.lat * 0.12 + time) * ambientSpeed - (isNorthernHemisphere ? 0.003 : -0.003);
        v += Math.cos(p.lng * 0.12 + time) * ambientSpeed;

        // Cyclone Rankine Vortex & Inflow Spiral Model
        if (dist < 28) {
          const eyeRadiusDeg = 0.42;
          let vTangential = 0;
          let inflowAngle = 0.35;

          if (dist < eyeRadiusDeg * 0.45) {
            vTangential = 0.02;
            inflowAngle = 0.01;
          } else if (dist < eyeRadiusDeg) {
            const rNorm = dist / eyeRadiusDeg;
            vTangential = Math.pow(rNorm, 1.5);
            inflowAngle = 0.18;
          } else {
            vTangential = Math.pow(eyeRadiusDeg / dist, 0.55);
            inflowAngle = 0.34 + 0.12 * Math.min(1, dist / 14);
          }

          const falloff = Math.max(0, 1 - Math.pow(dist / 28, 1.4));
          vTangential *= falloff;

          const cycloneSpeed = (maxWindKnots / 100) * 0.015 * vTangential;

          const angle = Math.atan2(dLat, dLng);
          const rotationSign = isNorthernHemisphere ? 1 : -1;
          const tangentialAngle = angle + (rotationSign * Math.PI) / 2;

          const movementAngle = tangentialAngle - rotationSign * inflowAngle;

          u += Math.cos(movementAngle) * cycloneSpeed;
          v += Math.sin(movementAngle) * cycloneSpeed;
        }

        u *= p.speedMultiplier;
        v *= p.speedMultiplier;

        const maxExpectedSpeed = (maxWindKnots / 100) * 0.015;
        const speedNorm = Math.sqrt(u * u + v * v) / maxExpectedSpeed;

        p.lng += u;
        p.lat += v;

        const screenPos = map.project([p.lng, p.lat]);

        fgCtx.beginPath();
        fgCtx.moveTo(p.prevX, p.prevY);
        fgCtx.lineTo(screenPos.x, screenPos.y);

        fgCtx.strokeStyle = getParticleColor(speedNorm);
        fgCtx.lineWidth = speedNorm > 0.8 ? 1.5 : 1.1;
        fgCtx.stroke();

        p.prevX = screenPos.x;
        p.prevY = screenPos.y;
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    const onMapMove = () => {
      for (const p of particlesRef.current) {
        const pos = map.project([p.lng, p.lat]);
        p.prevX = pos.x;
        p.prevY = pos.y;
      }
    };

    map.on('move', onMapMove);
    map.on('zoom', onMapMove);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      map.off('resize', resize);
      map.off('move', onMapMove);
      map.off('zoom', onMapMove);
    };
  }, [map, centerLat, centerLng, maxWindKnots, visible]);

  return (
    <>
      {/* Meteorological Satellite / Radar / Wave / Isobar Overlays */}
      <canvas
        ref={overlayCanvasRef}
        className="absolute inset-0 pointer-events-none z-10 w-full h-full"
      />

      {/* Wind Particles Streamlines */}
      {visible && (
        <canvas
          ref={fgCanvasRef}
          className="absolute inset-0 pointer-events-none z-20 w-full h-full opacity-90"
        />
      )}
    </>
  );
};
