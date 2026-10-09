import React, { useRef, useEffect } from 'react';

/**
 * 3D Dark Glass Globe Canvas Component
 * Renders a dark metallic 3D sphere with glowing cyan landmass dots,
 * 3D trade-route arcs, animated cargo marker, and mouse parallax.
 */
export function AboutGlobeCanvas({ className = '' }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.parentElement.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement.clientHeight || 500);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseRef.current.targetX = x * 0.4;
      mouseRef.current.targetY = y * 0.4;
    };

    const containerEl = containerRef.current;
    if (containerEl) {
      containerEl.addEventListener('mousemove', handleMouseMove);
    }

    // Latitude & Longitude Points for realistic 3D Globe dots
    const dots = [];
    const numLat = 24;
    const radius = Math.min(width, height) * 0.34;

    for (let i = 0; i < numLat; i++) {
      const lat = (Math.PI / (numLat + 1)) * (i + 1) - Math.PI / 2;
      const numLon = Math.floor(Math.cos(lat) * 42);
      for (let j = 0; j < numLon; j++) {
        const lon = ((2 * Math.PI) / numLon) * j;
        // Simple landmass density masking (Americas, Europe, Asia, Africa, Oceania)
        const isLand =
          (lon > 0.5 && lon < 2.4 && lat > -0.6 && lat < 1.1) || // Eurasia/Africa
          (lon > 3.6 && lon < 5.4 && lat > -0.8 && lat < 1.0) || // Americas
          (lon > 2.5 && lon < 3.2 && lat > -0.7 && lat < -0.1); // Australia/SE Asia
        
        if (isLand || Math.random() < 0.12) {
          dots.push({
            lat,
            lon,
            isLand,
            size: isLand ? 1.5 : 1.0,
            alpha: isLand ? 0.85 : 0.3,
          });
        }
      }
    }

    // Trade Route Arcs (Connecting major global hubs)
    const routes = [
      { start: { lat: 0.6, lon: 0.8 }, end: { lat: 0.4, lon: 2.1 } }, // Europe -> East Asia
      { start: { lat: 0.4, lon: 2.1 }, end: { lat: 0.6, lon: 4.2 } }, // East Asia -> US West Coast
      { start: { lat: 0.6, lon: 4.8 }, end: { lat: 0.7, lon: 0.1 } }, // US East Coast -> Europe
      { start: { lat: 0.4, lon: 0.9 }, end: { lat: 0.1, lon: 1.4 } }, // Mediterranean -> Middle East
      { start: { lat: 0.1, lon: 1.4 }, end: { lat: -0.4, lon: 1.9 } }, // Middle East -> SE Asia
      { start: { lat: -0.4, lon: 1.9 }, end: { lat: -0.5, lon: 0.6 } }, // SE Asia -> East Africa
    ];

    let rotationY = 0;
    let routeProgress = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse parallax
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const centerX = width / 2;
      const centerY = height / 2;
      const r = Math.min(width, height) * 0.34;

      rotationY += 0.0035;
      routeProgress = (routeProgress + 0.006) % 1;

      const rotX = mouseRef.current.y;
      const rotY = rotationY + mouseRef.current.x;

      // 1. Faint Atmospheric Glow behind globe
      const atmosphereGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        r * 0.8,
        centerX,
        centerY,
        r * 1.35
      );
      atmosphereGlow.addColorStop(0, 'rgba(0, 200, 245, 0.18)');
      atmosphereGlow.addColorStop(0.5, 'rgba(10, 27, 49, 0.08)');
      atmosphereGlow.addColorStop(1, 'rgba(6, 20, 38, 0)');
      ctx.fillStyle = atmosphereGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, r * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // 2. Floating Metallic Base Ring beneath globe
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + r * 1.08, r * 0.85, r * 0.22, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 200, 245, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      const baseGlow = ctx.createRadialGradient(
        centerX,
        centerY + r * 1.08,
        0,
        centerX,
        centerY + r * 1.08,
        r * 0.85
      );
      baseGlow.addColorStop(0, 'rgba(0, 200, 245, 0.22)');
      baseGlow.addColorStop(1, 'rgba(0, 200, 245, 0)');
      ctx.fillStyle = baseGlow;
      ctx.fill();
      ctx.restore();

      // 3. Dark Metallic Glass Sphere Base
      const sphereGradient = ctx.createRadialGradient(
        centerX - r * 0.35,
        centerY - r * 0.35,
        r * 0.1,
        centerX,
        centerY,
        r
      );
      sphereGradient.addColorStop(0, '#102A4C');
      sphereGradient.addColorStop(0.6, '#0A1B31');
      sphereGradient.addColorStop(1, '#051120');

      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.fillStyle = sphereGradient;
      ctx.fill();
      ctx.strokeStyle = 'rgba(0, 200, 245, 0.4)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();

      // Project 3D Point to 2D
      const project = (lat, lon) => {
        const cosLat = Math.cos(lat);
        const sinLat = Math.sin(lat);
        const cosLon = Math.cos(lon + rotY);
        const sinLon = Math.sin(lon + rotY);

        // 3D coordinates
        let x3d = r * cosLat * sinLon;
        let y3d = r * sinLat;
        let z3d = r * cosLat * cosLon;

        // Apply X rotation (mouse tilt)
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        const y3dRot = y3d * cosX - z3d * sinX;
        const z3dRot = y3d * sinX + z3d * cosX;

        return {
          x: centerX + x3d,
          y: centerY - y3dRot,
          z: z3dRot,
          visible: z3dRot > 0,
        };
      };

      // 4. Draw Globe Dots
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const p = project(d.lat, d.lon);
        if (!p.visible) continue;

        const opacity = (p.z / r) * d.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, d.size * (0.8 + (p.z / r) * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = d.isLand
          ? `rgba(0, 200, 245, ${opacity})`
          : `rgba(184, 196, 211, ${opacity * 0.4})`;
        ctx.fill();
      }

      // 5. Draw Glowing Trade-Route Arcs
      routes.forEach((route, idx) => {
        const p1 = project(route.start.lat, route.start.lon);
        const p2 = project(route.end.lat, route.end.lon);

        if (!p1.visible && !p2.visible) return;

        // Draw Arc curve
        const midLat = (route.start.lat + route.end.lat) / 2 + 0.25;
        const midLon = (route.start.lon + route.end.lon) / 2;
        const pMid = project(midLat, midLon);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.quadraticCurveTo(pMid.x, pMid.y, p2.x, p2.y);
        const arcAlpha = Math.max(0, Math.min(1, (p1.z + p2.z) / (2 * r)));
        ctx.strokeStyle = `rgba(0, 200, 245, ${arcAlpha * 0.6})`;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.stroke();

        // Pulsing Port Nodes
        [p1, p2].forEach((p) => {
          if (p.visible) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 200, 245, ${arcAlpha * 0.9})`;
            ctx.shadowColor = '#00C8F5';
            ctx.shadowBlur = 8;
            ctx.fill();
          }
        });

        // Moving Cargo Marker along route #0
        if (idx === 0) {
          const t = routeProgress;
          const markerX = (1 - t) * (1 - t) * p1.x + 2 * (1 - t) * t * pMid.x + t * t * p2.x;
          const markerY = (1 - t) * (1 - t) * p1.y + 2 * (1 - t) * t * pMid.y + t * t * p2.y;

          if (pMid.visible) {
            ctx.shadowColor = '#00C8F5';
            ctx.shadowBlur = 12;
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(markerX, markerY, 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = 'rgba(0, 200, 245, 0.9)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(markerX, markerY, 7, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (containerEl) {
        containerEl.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[420px] sm:h-[480px] lg:h-[540px] flex items-center justify-center select-none ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
