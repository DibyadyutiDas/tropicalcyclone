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

// Map speed to clean white/light grey streamline particles (no neon glow)
function getParticleColor(speedNorm: number): string {
  if (speedNorm < 0.25) return 'rgba(255, 255, 255, 0.4)';
  if (speedNorm < 0.6) return 'rgba(255, 255, 255, 0.7)';
  if (speedNorm < 0.85) return 'rgba(255, 255, 255, 0.9)';
  return 'rgba(255, 255, 255, 1.0)';
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
  pressure = true,
  gradCam = false,
}) => {
  const fgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameId = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  // 1. Render Meteorological Satellite / Radar / Isobars (No Glow, Clean Cartography)
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

      const centerScreen = map.project([centerLng, centerLat]);
      const zoom = map.getZoom();
      const radiusPx = Math.max(120, Math.pow(2, zoom - 2) * 50);

      // A. WATER VAPOR (Clean atmospheric moisture gradient)
      if (waterVapor) {
        const wvGrad = ctx.createRadialGradient(
          centerScreen.x,
          centerScreen.y,
          0,
          centerScreen.x,
          centerScreen.y,
          radiusPx * 2.2
        );
        wvGrad.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
        wvGrad.addColorStop(0.4, 'rgba(14, 165, 233, 0.22)');
        wvGrad.addColorStop(0.8, 'rgba(3, 105, 161, 0.1)');
        wvGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');

        ctx.fillStyle = wvGrad;
        ctx.beginPath();
        ctx.arc(centerScreen.x, centerScreen.y, radiusPx * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // B. THERMAL IR (Cold cloud tops)
      if (thermalIR) {
        const irGrad = ctx.createRadialGradient(
          centerScreen.x,
          centerScreen.y,
          0,
          centerScreen.x,
          centerScreen.y,
          radiusPx * 1.8
        );
        irGrad.addColorStop(0, 'rgba(225, 29, 72, 0.6)');
        irGrad.addColorStop(0.25, 'rgba(219, 39, 119, 0.45)');
        irGrad.addColorStop(0.5, 'rgba(147, 51, 234, 0.3)');
        irGrad.addColorStop(0.8, 'rgba(59, 130, 246, 0.15)');
        irGrad.addColorStop(1, 'rgba(59, 130, 246, 0)');

        ctx.fillStyle = irGrad;
        ctx.beginPath();
        ctx.arc(centerScreen.x, centerScreen.y, radiusPx * 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // C. RAIN & RADAR CONVECTION (Doppler reflectivity echoes like reference image)
      if (rainRadar) {
        const radarGrad = ctx.createRadialGradient(
          centerScreen.x,
          centerScreen.y,
          radiusPx * 0.1,
          centerScreen.x,
          centerScreen.y,
          radiusPx * 1.5
        );
        radarGrad.addColorStop(0, 'rgba(220, 38, 38, 0.65)');
        radarGrad.addColorStop(0.2, 'rgba(249, 115, 22, 0.55)');
        radarGrad.addColorStop(0.45, 'rgba(234, 179, 8, 0.4)');
        radarGrad.addColorStop(0.75, 'rgba(34, 197, 94, 0.25)');
        radarGrad.addColorStop(1, 'rgba(34, 197, 94, 0)');

        ctx.fillStyle = radarGrad;
        ctx.beginPath();
        ctx.arc(centerScreen.x, centerScreen.y, radiusPx * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // D. WAVES & SWELL (Clean oceanic contours)
      if (waves) {
        const waveRings = [0.5, 0.9, 1.3, 1.7, 2.1];
        ctx.save();
        waveRings.forEach((scale) => {
          ctx.strokeStyle = 'rgba(96, 165, 250, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(centerScreen.x, centerScreen.y, radiusPx * scale, 0, Math.PI * 2);
          ctx.stroke();
        });
        ctx.restore();
      }

      // E. PRESSURE & ISOBARS (Exact Windy Style from Image: Cyan lines + Oval Badges: 1004, 1006, 1008, 1012)
      if (pressure) {
        const isobars = [
          { r: 0.5, label: '992' },
          { r: 0.85, label: '1004' },
          { r: 1.25, label: '1006' },
          { r: 1.65, label: '1008' },
          { r: 2.1, label: '1012' },
        ];

        ctx.save();
        isobars.forEach((iso, i) => {
          // Isobar contour line (solid cyan/blue line)
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(centerScreen.x, centerScreen.y, radiusPx * iso.r, 0, Math.PI * 2);
          ctx.stroke();

          // Oval badge on top of contour (Windy style rounded pill badge)
          const angle = -Math.PI / 3 - i * 0.25;
          const badgeX = centerScreen.x + Math.cos(angle) * (radiusPx * iso.r);
          const badgeY = centerScreen.y + Math.sin(angle) * (radiusPx * iso.r);

          const pillW = 34;
          const pillH = 16;
          const pillR = 8;

          // Pill Background
          ctx.fillStyle = '#0e7490';
          ctx.beginPath();
          ctx.roundRect(badgeX - pillW / 2, badgeY - pillH / 2, pillW, pillH, pillR);
          ctx.fill();

          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Pill Text (White bold font)
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(iso.label, badgeX, badgeY);
        });

        ctx.restore();
      }

      // F. GRAD-CAM ATTENTION
      if (gradCam) {
        const camGrad = ctx.createRadialGradient(
          centerScreen.x,
          centerScreen.y,
          0,
          centerScreen.x,
          centerScreen.y,
          radiusPx * 1.3
        );
        camGrad.addColorStop(0, 'rgba(234, 179, 8, 0.6)');
        camGrad.addColorStop(0.4, 'rgba(239, 68, 68, 0.4)');
        camGrad.addColorStop(0.8, 'rgba(147, 51, 234, 0.2)');
        camGrad.addColorStop(1, 'rgba(147, 51, 234, 0)');

        ctx.fillStyle = camGrad;
        ctx.beginPath();
        ctx.arc(centerScreen.x, centerScreen.y, radiusPx * 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
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

  // 2. Wind Particle Simulation Loop (Natural Streamlines, No Neon Glow)
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

    const NUM_PARTICLES = 1000;

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
        maxAge: 70 + Math.floor(Math.random() * 80),
        speedMultiplier: 0.75 + Math.random() * 0.4,
      };
    };

    particlesRef.current = Array.from({ length: NUM_PARTICLES }, spawnParticle);

    const render = () => {
      if (!fgCanvas || !fgCtx || !map) return;

      // Clean fading
      fgCtx.globalCompositeOperation = 'destination-in';
      fgCtx.fillStyle = 'rgba(0, 0, 0, 0.93)';
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

        // Ambient flow
        const ambientSpeed = 0.0035;
        u += Math.sin(p.lat * 0.12 + time) * ambientSpeed - (isNorthernHemisphere ? 0.003 : -0.003);
        v += Math.cos(p.lng * 0.12 + time) * ambientSpeed;

        // Cyclone Rankine Vortex Model
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

          const cycloneSpeed = (maxWindKnots / 100) * 0.014 * vTangential;

          const angle = Math.atan2(dLat, dLng);
          const rotationSign = isNorthernHemisphere ? 1 : -1;
          const tangentialAngle = angle + (rotationSign * Math.PI) / 2;

          const movementAngle = tangentialAngle - rotationSign * inflowAngle;

          u += Math.cos(movementAngle) * cycloneSpeed;
          v += Math.sin(movementAngle) * cycloneSpeed;
        }

        u *= p.speedMultiplier;
        v *= p.speedMultiplier;

        const maxExpectedSpeed = (maxWindKnots / 100) * 0.014;
        const speedNorm = Math.sqrt(u * u + v * v) / maxExpectedSpeed;

        p.lng += u;
        p.lat += v;

        const screenPos = map.project([p.lng, p.lat]);

        fgCtx.beginPath();
        fgCtx.moveTo(p.prevX, p.prevY);
        fgCtx.lineTo(screenPos.x, screenPos.y);

        fgCtx.strokeStyle = getParticleColor(speedNorm);
        fgCtx.lineWidth = 1.1;
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
      <canvas
        ref={overlayCanvasRef}
        className="absolute inset-0 pointer-events-none z-10 w-full h-full"
      />

      {visible && (
        <canvas
          ref={fgCanvasRef}
          className="absolute inset-0 pointer-events-none z-20 w-full h-full opacity-85"
        />
      )}
    </>
  );
};
