import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';

// ─── ISO 20ft Container Dimensions (meters) ───
const C = {
  L: 6.058, W: 2.438, H: 2.591,
  corrDepth: 0.048, corrCount: 20, corrCountEnd: 8,
  castSize: 0.178, postW: 0.15, railH: 0.10,
  frameH: 0.14, barR: 0.014, wallT: 0.003, doorGap: 0.008,
};
const HL = C.L / 2, HW = C.W / 2, HH = C.H / 2;

// ─── Shared Static Geometry Buffers (Zero Allocation Loop Optimization) ───
const GEO = {
  rivet: new THREE.CylinderGeometry(0.003, 0.003, 0.008, 6),
  hingePin: new THREE.CylinderGeometry(0.009, 0.009, 0.088, 8),
  padlockHasp: new THREE.CylinderGeometry(0.003, 0.003, 0.016, 6),
  weldBeadV: new THREE.CylinderGeometry(0.0035, 0.0035, C.H - C.castSize * 2, 6),
  weldBeadH: new THREE.CylinderGeometry(0.0035, 0.0035, C.L - C.castSize, 6),
  seamWeld: new THREE.CylinderGeometry(0.003, 0.003, C.W - 0.22, 6),
};

// ─── Authentic ISO Trapezoidal Corrugation Profile ───
function corrZ(t, d) {
  const f = ((t % 1) + 1) % 1;
  if (f < 0.22) return 0;                            // Outer crest (flat top peak)
  if (f < 0.32) return d * (f - 0.22) / 0.10;        // Sloping side web down
  if (f < 0.72) return d;                            // Inner valley (flat bottom)
  if (f < 0.82) return d * (0.82 - f) / 0.10;        // Sloping side web up
  return 0;                                          // Outer crest
}

function makeCorrugatedGeo(w, h, n, d) {
  // Higher horizontal segment resolution for smooth vertex normal light interpolation
  const sx = Math.round(n * 20);
  const geo = new THREE.PlaneGeometry(w, h, sx, 1);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const t = ((pos.getX(i) / w) + 0.5) * n;
    pos.setZ(i, corrZ(t, d));
  }
  geo.computeVertexNormals();
  return geo;
}

// ─── Global Texture Cache for Instant Load & Refresh Performance ───
let _cachedIndustrialTextures = null;
function getIndustrialTextures() {
  if (!_cachedIndustrialTextures) {
    _cachedIndustrialTextures = createIndustrialTextures();
  }
  return _cachedIndustrialTextures;
}

// ─── Procedural Industrial Surface Textures (PBR Physical Micro-Realism) ───
function createIndustrialTextures() {
  // 1. Micro-Normal & Orange Peel Bump Texture (1024 x 1024)
  const canvas1 = document.createElement('canvas');
  canvas1.width = 1024;
  canvas1.height = 1024;
  const ctx1 = canvas1.getContext('2d');
  ctx1.fillStyle = '#808080';
  ctx1.fillRect(0, 0, 1024, 1024);

  // ── Ultra-Smooth Micro-Stipple Orange Peel (Multi-frequency organic waves) ──
  const imgData = ctx1.getImageData(0, 0, 1024, 1024);
  const data = imgData.data;
  for (let y = 0; y < 1024; y++) {
    for (let x = 0; x < 1024; x++) {
      const idx = (y * 1024 + x) * 4;
      const f1 = Math.sin(x * 0.08 + y * 0.05) * Math.cos(y * 0.08 - x * 0.04) * 7;
      const f2 = Math.sin(x * 0.22 + 2.1) * Math.cos(y * 0.18 + 1.2) * 4;
      const val = Math.min(255, Math.max(0, 128 + f1 + f2));

      data[idx] = val;
      data[idx + 1] = val;
      data[idx + 2] = val;
    }
  }
  ctx1.putImageData(imgData, 0, 0);

  // ── Subtle Hairline Micro-Scratches (Faint handling wear, 100% paint intact) ──
  ctx1.strokeStyle = 'rgba(152, 152, 152, 0.06)';
  ctx1.lineWidth = 0.8;
  for (let s = 0; s < 28; s++) {
    const sx = Math.random() * 1024;
    const sy = Math.random() * 1024;
    const len = 30 + Math.random() * 70;
    const angle = (Math.random() * 0.4 - 0.2) + (Math.random() < 0.5 ? 0 : Math.PI / 2);
    ctx1.beginPath();
    ctx1.moveTo(sx, sy);
    ctx1.lineTo(sx + Math.cos(angle) * len, sy + Math.sin(angle) * len);
    ctx1.stroke();
  }

  // ── Soft Organic Spray Pass Film Thickness Variation ──
  for (let w = 0; w < 12; w++) {
    const cx = Math.random() * 1024;
    const cy = Math.random() * 1024;
    const rx = 120 + Math.random() * 180;
    const ry = 60 + Math.random() * 120;
    const grad = ctx1.createRadialGradient(cx, cy, 0, cx, cy, rx);
    grad.addColorStop(0, 'rgba(140, 140, 140, 0.06)');
    grad.addColorStop(1, 'rgba(128, 128, 128, 0)');
    ctx1.fillStyle = grad;
    ctx1.beginPath();
    ctx1.ellipse(cx, cy, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx1.fill();
  }

  const bumpTex = new THREE.CanvasTexture(canvas1);
  bumpTex.wrapS = THREE.RepeatWrapping;
  bumpTex.wrapT = THREE.RepeatWrapping;
  bumpTex.repeat.set(6, 3);
  bumpTex.generateMipmaps = true;
  bumpTex.minFilter = THREE.LinearMipmapLinearFilter;
  bumpTex.magFilter = THREE.LinearFilter;

  // 2. Micro-Roughness Map with Mild Sun-Fading & Hardware Dust (512 x 512)
  const canvas2 = document.createElement('canvas');
  canvas2.width = 512;
  canvas2.height = 512;
  const ctx2 = canvas2.getContext('2d');

  // Base Satin Neutral Tone with Subtle Top-Edge Sun-Fading Gradient
  const fadeGrad = ctx2.createLinearGradient(0, 0, 0, 512);
  fadeGrad.addColorStop(0, '#858585');   // Mild top sun-fade (tiny 2% roughness increase)
  fadeGrad.addColorStop(0.3, '#7F7F7F'); // Standard satin sheen
  fadeGrad.addColorStop(1.0, '#7D7D7D'); // Lower protected base
  ctx2.fillStyle = fadeGrad;
  ctx2.fillRect(0, 0, 512, 512);

  // Smooth vertical panel roughness modulation
  for (let x = 0; x < 512; x++) {
    const panelVar = Math.sin((x / 512) * Math.PI * 8) * 5;
    ctx2.fillStyle = `rgba(${127 + panelVar}, ${127 + panelVar}, ${127 + panelVar}, 0.05)`;
    ctx2.fillRect(x, 0, 1, 512);
  }

  // Hairline Scratches Roughness Specular Variance
  ctx2.strokeStyle = 'rgba(160, 160, 160, 0.08)';
  ctx2.lineWidth = 0.8;
  for (let s = 0; s < 24; s++) {
    const sx = Math.random() * 512;
    const sy = Math.random() * 512;
    const len = 20 + Math.random() * 50;
    const angle = (Math.random() * 0.4 - 0.2);
    ctx2.beginPath();
    ctx2.moveTo(sx, sy);
    ctx2.lineTo(sx + Math.cos(angle) * len, sy + Math.sin(angle) * len);
    ctx2.stroke();
  }

  // Micro Dust Accumulation Smudges (Faint matte rings near hardware joints)
  for (let d = 0; d < 8; d++) {
    const cx = Math.random() * 512;
    const cy = 350 + Math.random() * 140; // concentrated near lower frame/hinge levels
    const rd = 15 + Math.random() * 30;
    const dGrad = ctx2.createRadialGradient(cx, cy, 0, cx, cy, rd);
    dGrad.addColorStop(0, 'rgba(100, 95, 90, 0.06)'); // Matte micro-dust tone
    dGrad.addColorStop(1, 'rgba(127, 127, 127, 0)');
    ctx2.fillStyle = dGrad;
    ctx2.beginPath();
    ctx2.arc(cx, cy, rd, 0, Math.PI * 2);
    ctx2.fill();
  }

  const roughTex = new THREE.CanvasTexture(canvas2);
  roughTex.wrapS = THREE.RepeatWrapping;
  roughTex.wrapT = THREE.RepeatWrapping;
  roughTex.repeat.set(6, 3);
  roughTex.generateMipmaps = true;
  roughTex.minFilter = THREE.LinearMipmapLinearFilter;
  roughTex.magFilter = THREE.LinearFilter;

  return { bumpTexture: bumpTex, roughnessTexture: roughTex };
}

// ─── PBR Materials (Marine Grade Corten Steel & Galvanized Hardware) ───
function useMats(color) {
  const { bumpTexture, roughnessTexture } = useMemo(() => getIndustrialTextures(), []);
  const prevMatsRef = useRef(null);

  const materials = useMemo(() => {
    if (prevMatsRef.current) {
      Object.values(prevMatsRef.current).forEach((m) => m && typeof m.dispose === 'function' && m.dispose());
    }

    const base = new THREE.Color(color);
    const darkBase = base.clone().multiplyScalar(0.75);

    const mats = {
      // Watertight Inner Shell
      shell: new THREE.MeshPhysicalMaterial({
        color: base,
        metalness: 0.16,
        roughness: 0.52,
        clearcoat: 0.04,
        clearcoatRoughness: 0.80,
        bumpMap: bumpTexture,
        bumpScale: 0.0012,
        roughnessMap: roughnessTexture,
      }),

      // Corrugated Side & End Panels (Marine Grade Painted Corten Steel - Soft Satin Finish)
      wall: new THREE.MeshPhysicalMaterial({
        color: base,
        metalness: 0.16,
        roughness: 0.52,
        clearcoat: 0.04,
        clearcoatRoughness: 0.80,
        bumpMap: bumpTexture,
        bumpScale: 0.0012,
        roughnessMap: roughnessTexture,
        side: THREE.FrontSide,
      }),

      // Roof Panel (Pressed Corten Steel Marine Paint)
      roof: new THREE.MeshPhysicalMaterial({
        color: base,
        metalness: 0.16,
        roughness: 0.52,
        clearcoat: 0.04,
        clearcoatRoughness: 0.80,
        bumpMap: bumpTexture,
        bumpScale: 0.0014,
        roughnessMap: roughnessTexture,
      }),

      // Outer Structural Frame Rails & Corner Posts (Folded Corten Steel Satin Finish)
      frame: new THREE.MeshPhysicalMaterial({
        color: darkBase,
        metalness: 0.16,
        roughness: 0.52,
        clearcoat: 0.04,
        clearcoatRoughness: 0.80,
        bumpMap: bumpTexture,
        bumpScale: 0.0014,
        roughnessMap: roughnessTexture,
      }),

      // Door Hardware — Galvanized Steel Locking Bars, Cams, Keepers, Hasps & Hinges
      chrome: new THREE.MeshStandardMaterial({
        color: '#9DA3A8',
        metalness: 0.82,
        roughness: 0.34,
        bumpMap: bumpTexture,
        bumpScale: 0.0006,
        roughnessMap: roughnessTexture,
      }),

      // Corner Castings — Heavy Sand-Cast ISO Corner Blocks
      casting: new THREE.MeshStandardMaterial({
        color: base.clone().multiplyScalar(0.50),
        metalness: 0.45,
        roughness: 0.50,
        bumpMap: bumpTexture,
        bumpScale: 0.0020,
        roughnessMap: roughnessTexture,
      }),

      // Safety Hazard Stripes
      hazard: new THREE.MeshStandardMaterial({
        color: '#D4A017',
        metalness: 0.12,
        roughness: 0.60,
      }),

      // EPDM Rubber Weather Seals & Gaskets
      dark: new THREE.MeshStandardMaterial({
        color: '#141416',
        metalness: 0.04,
        roughness: 0.85,
      }),

      // Door Panels (Marine Grade Oven-Baked Polyurethane Satin Paint)
      door: new THREE.MeshPhysicalMaterial({
        color: base.clone().multiplyScalar(0.88),
        metalness: 0.16,
        roughness: 0.52,
        clearcoat: 0.04,
        clearcoatRoughness: 0.80,
        bumpMap: bumpTexture,
        bumpScale: 0.0012,
        roughnessMap: roughnessTexture,
      }),
    };

    prevMatsRef.current = mats;
    return mats;
  }, [color, bumpTexture, roughnessTexture]);

  useEffect(() => {
    return () => {
      if (prevMatsRef.current) {
        Object.values(prevMatsRef.current).forEach((m) => m && typeof m.dispose === 'function' && m.dispose());
        prevMatsRef.current = null;
      }
    };
  }, []);

  return materials;
}

// ─── Global Cache for ISO Markings Textures ───
let _cachedISOMarkings = null;
function getISOMarkingsTextures() {
  if (!_cachedISOMarkings) {
    _cachedISOMarkings = createISOMarkingsTextures();
  }
  return _cachedISOMarkings;
}

/// ─── Procedural ISO 6346 Container Markings & Decals Texture Generator ───
function createISOMarkingsTextures() {
  // Helper function to draw the official HashHarbour Anchor + H Symbol (Solid White Fill Matching Reference Template)
  function drawHashHarbourSymbol(ctx, x, y, scale, isOutline = false) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.translate(-250, -250);

    const whiteColor = '#FFFFFF';

    if (isOutline) {
      // ── 100% Exact Vector Outline Style Matching Reference Image ──
      ctx.strokeStyle = whiteColor;
      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // 1. Top Hollow Circle Ring (Shackle)
      ctx.beginPath();
      ctx.arc(250, 75, 36, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(250, 75, 20, 0, Math.PI * 2);
      ctx.stroke();

      // 2. Connector Shaft & Horizontal Stock Crossbar (Trapezoidal wings, flat cut tips)
      ctx.beginPath();
      ctx.moveTo(238, 111); ctx.lineTo(238, 130); ctx.lineTo(135, 130);
      ctx.lineTo(152, 160); ctx.lineTo(238, 160); ctx.lineTo(238, 180);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(262, 111); ctx.lineTo(262, 130); ctx.lineTo(365, 130);
      ctx.lineTo(348, 160); ctx.lineTo(262, 160); ctx.lineTo(262, 180);
      ctx.stroke();

      // 3. H-Monogram Block (Negative Space 'H' Cut-Out)
      ctx.beginPath();
      // Left H leg
      ctx.strokeRect(182, 180, 28, 140);
      // Right H leg
      ctx.strokeRect(290, 180, 28, 140);
      // Center H crossbar
      ctx.strokeRect(210, 235, 80, 28);
      // Central spine shaft
      ctx.moveTo(238, 180); ctx.lineTo(238, 385);
      ctx.moveTo(262, 180); ctx.lineTo(262, 385);
      ctx.stroke();

      // 4. Sweeping Curved Anchor Arms & Arrowhead Flukes
      ctx.beginPath();
      ctx.moveTo(250, 435);
      ctx.bezierCurveTo(180, 435, 120, 395, 75, 285);
      ctx.lineTo(112, 318);
      ctx.bezierCurveTo(145, 362, 190, 392, 238, 392);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(250, 435);
      ctx.bezierCurveTo(320, 435, 380, 395, 425, 285);
      ctx.lineTo(388, 318);
      ctx.bezierCurveTo(355, 362, 310, 392, 262, 392);
      ctx.stroke();

      // 5. Pointed Diamond Spike Tip
      ctx.beginPath();
      ctx.moveTo(250, 435);
      ctx.lineTo(262, 462);
      ctx.lineTo(250, 485);
      ctx.lineTo(238, 462);
      ctx.closePath();
      ctx.stroke();

    } else {
      // Solid White Fill Style
      ctx.fillStyle = whiteColor;

      ctx.beginPath();
      ctx.arc(250, 75, 38, 0, Math.PI * 2);
      ctx.arc(250, 75, 22, 0, Math.PI * 2, true);
      ctx.fill();

      ctx.fillRect(238, 105, 24, 25);

      ctx.beginPath();
      ctx.moveTo(135, 130); ctx.lineTo(365, 130);
      ctx.lineTo(348, 162); ctx.lineTo(262, 162);
      ctx.lineTo(262, 130); ctx.lineTo(238, 130);
      ctx.lineTo(238, 162); ctx.lineTo(152, 162);
      ctx.closePath();
      ctx.fill();

      ctx.fillRect(237, 128, 26, 52);
      ctx.fillRect(182, 180, 30, 145);
      ctx.fillRect(288, 180, 30, 145);
      ctx.fillRect(212, 238, 76, 28);
      ctx.fillRect(237, 180, 26, 215);

      ctx.beginPath();
      ctx.moveTo(250, 448);
      ctx.bezierCurveTo(185, 448, 125, 410, 75, 295);
      ctx.lineTo(112, 330);
      ctx.bezierCurveTo(145, 372, 190, 405, 237, 410);
      ctx.lineTo(237, 345); ctx.lineTo(263, 345); ctx.lineTo(263, 410);
      ctx.bezierCurveTo(310, 405, 355, 372, 388, 330);
      ctx.lineTo(425, 295);
      ctx.bezierCurveTo(375, 410, 315, 448, 250, 448);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(250, 492);
      ctx.lineTo(262, 442);
      ctx.lineTo(238, 442);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  // ── 1. Door Markings Texture (2048 x 2048 Crisp Resolution) ──
  const doorCanvas = document.createElement('canvas');
  doorCanvas.width = 2048;
  doorCanvas.height = 2048;
  const ctxD = doorCanvas.getContext('2d');
  ctxD.clearRect(0, 0, 2048, 2048);

  const stencilWhite = 'rgba(241, 245, 249, 0.92)';
  const stencilMuted = 'rgba(203, 213, 225, 0.82)';

  // ══════════════════════════════════════════════════════════
  // LEFT DOOR MARKINGS (Weight Specs + CSC Safety Approval Plate)
  // ══════════════════════════════════════════════════════════
  ctxD.fillStyle = stencilWhite;
  ctxD.font = 'bold 64px "Courier New", "DIN 1451", monospace';
  ctxD.textAlign = 'left';

  ctxD.fillText('HHBU  749201', 140, 220);
  ctxD.strokeStyle = stencilWhite;
  ctxD.lineWidth = 5;
  ctxD.strokeRect(690, 168, 80, 80);
  ctxD.fillText('4', 712, 230);
  ctxD.font = 'bold 56px "Courier New", "DIN 1451", monospace';
  ctxD.fillText('22G1', 140, 310);

  ctxD.beginPath();
  ctxD.moveTo(140, 350);
  ctxD.lineTo(840, 350);
  ctxD.strokeStyle = 'rgba(241, 245, 249, 0.30)';
  ctxD.lineWidth = 4;
  ctxD.stroke();

  const specs = [
    { label: 'MAX GROSS', metric: '30,480 KG', imperial: '67,200 LBS' },
    { label: 'TARE',      metric: ' 2,230 KG', imperial: ' 4,920 LBS' },
    { label: 'PAYLOAD',   metric: '28,250 KG', imperial: '62,280 LBS' },
    { label: 'CU. CAP.',  metric: '  33.2 CU.M', imperial: '1,173 CU.FT' },
  ];

  let yOffset = 420;
  specs.forEach((item) => {
    ctxD.font = '900 42px "Courier New", "DIN 1451", monospace';
    ctxD.fillStyle = stencilMuted;
    ctxD.fillText(item.label, 140, yOffset);
    ctxD.font = '700 40px "Courier New", "DIN 1451", monospace';
    ctxD.fillText(item.metric, 480, yOffset);
    ctxD.fillText(item.imperial, 480, yOffset + 48);
    yOffset += 120;
  });

  ctxD.fillStyle = '#D97706';
  ctxD.fillRect(140, yOffset + 30, 440, 68);
  ctxD.fillStyle = '#0F172A';
  ctxD.font = '900 32px sans-serif';
  ctxD.fillText('SUPER HEAVY 20FT ISO', 165, yOffset + 76);

  const plateX = 140, plateY = 1260, plateW = 720, plateH = 500;
  ctxD.fillStyle = '#94A3B8';
  ctxD.fillRect(plateX, plateY, plateW, plateH);
  ctxD.strokeStyle = '#1E293B';
  ctxD.lineWidth = 8;
  ctxD.strokeRect(plateX, plateY, plateW, plateH);

  ctxD.strokeStyle = '#475569';
  ctxD.lineWidth = 3;
  ctxD.strokeRect(plateX + 20, plateY + 80, plateW - 40, plateH - 100);

  ctxD.fillStyle = '#0F172A';
  ctxD.font = '900 38px sans-serif';
  ctxD.fillText('CSC SAFETY APPROVAL', plateX + 40, plateY + 60);

  ctxD.font = '700 24px monospace';
  ctxD.fillText('APPROVAL NO.: GB-LR 49201-08/2025', plateX + 40, plateY + 130);
  ctxD.fillText('DATE OF MANUFACTURE: 06 / 2025', plateX + 40, plateY + 180);
  ctxD.fillText('MANUFACTURER: HASHHARBOUR HEAVY IND.', plateX + 40, plateY + 230);
  ctxD.fillText('ALLOWABLE STACKING WT: 216,000 KG', plateX + 40, plateY + 280);
  ctxD.fillText('RACKING TEST VALUE:   150,000 N', plateX + 40, plateY + 330);
  ctxD.fillText('END-WALL STRENGTH:    0.4t', plateX + 40, plateY + 380);
  ctxD.fillText('SIDE-WALL STRENGTH:   0.6t', plateX + 40, plateY + 430);

  ctxD.fillStyle = '#334155';
  [[plateX + 18, plateY + 18], [plateX + plateW - 18, plateY + 18], [plateX + 18, plateY + plateH - 18], [plateX + plateW - 18, plateY + plateH - 18]].forEach(([cx, cy]) => {
    ctxD.beginPath();
    ctxD.arc(cx, cy, 8, 0, Math.PI * 2);
    ctxD.fill();
  });

  // ══════════════════════════════════════════════════════════
  // RIGHT DOOR MARKINGS (Container ID + Stacked Official Logo)
  // ══════════════════════════════════════════════════════════
  ctxD.fillStyle = stencilWhite;
  ctxD.font = 'bold 64px "Courier New", "DIN 1451", monospace';
  ctxD.fillText('HHBU  749201', 1140, 220);
  ctxD.strokeStyle = stencilWhite;
  ctxD.lineWidth = 5;
  ctxD.strokeRect(1690, 168, 80, 80);
  ctxD.fillText('4', 1712, 230);
  ctxD.font = 'bold 56px "Courier New", "DIN 1451", monospace';
  ctxD.fillText('22G1', 1140, 310);

  // Draw Stacked Logo on Right Door Center (Outline Vector)
  const doorLogoX = 1460, doorLogoY = 820;
  drawHashHarbourSymbol(ctxD, doorLogoX, doorLogoY, 1.15, true);

  // Wordmark #HASHHARBOUR (Positioned clearly below bottom spike with 50px gap)
  ctxD.fillStyle = '#FFFFFF';
  ctxD.font = '900 95px "Impact", "Bebas Neue", "Oswald", sans-serif';
  ctxD.textAlign = 'center';
  ctxD.fillText('#HASHHARBOUR', doorLogoX, doorLogoY + 340);

  // Tagline SAFE • STRONG • GLOBAL
  ctxD.fillStyle = '#00C4EE';
  ctxD.font = 'bold 30px "Arial", "Montserrat", sans-serif';
  ctxD.letterSpacing = '6px';
  ctxD.fillText('SAFE  •  STRONG  •  GLOBAL', doorLogoX, doorLogoY + 400);

  const doorTex = new THREE.CanvasTexture(doorCanvas);
  doorTex.generateMipmaps = true;
  doorTex.minFilter = THREE.LinearMipmapLinearFilter;
  doorTex.magFilter = THREE.LinearFilter;
  doorTex.anisotropy = 16;
  doorTex.needsUpdate = true;

  // ── 2. Side Wall Markings Texture (4096 x 2048 Ultra High-Res Global Shipping Standard) ──
  const sideCanvas = document.createElement('canvas');
  sideCanvas.width = 4096;
  sideCanvas.height = 2048;
  const ctxS = sideCanvas.getContext('2d');
  ctxS.clearRect(0, 0, 4096, 2048);

  ctxS.shadowColor = 'transparent';
  ctxS.shadowBlur = 0;

  // Dead Center Position for Container Main Side Panel (X = 2048, Mid-Height Y = 660)
  const sideLogoX = 2048;
  const sideLogoY = 660;
  const iconScale = 2.50;

  // 1. Draw Final Approved Anchor + H Symbol (Solid White Fill, ~33% panel height)
  drawHashHarbourSymbol(ctxS, sideLogoX, sideLogoY, iconScale, false);

  // Icon bottom spike is at sideLogoY + (210 * iconScale) = 660 + 525 = 1185px
  // Clear Gap = 100px (~19% of icon height, ZERO OVERLAP!)
  // Wordmark Baseline Y = 1185 + 100 + 170 = 1455px

  // 2. Draw Wordmark #HASHHARBOUR (Solid white, 270px font with 20px letter spacing)
  ctxS.fillStyle = '#FFFFFF';
  ctxS.font = '900 270px "Impact", "Bebas Neue", "Oswald", sans-serif';
  ctxS.letterSpacing = '20px';
  ctxS.textAlign = 'center';
  ctxS.fillText('#HASHHARBOUR', sideLogoX, 1455);

  // 3. Draw Tagline SAFE • STRONG • GLOBAL (Centered directly below wordmark at Y = 1550)
  ctxS.fillStyle = '#00C4EE';
  ctxS.font = 'bold 58px "Arial", "Montserrat", sans-serif';
  ctxS.letterSpacing = '16px';
  ctxS.fillText('SAFE  •  STRONG  •  GLOBAL', sideLogoX, 1550);

  // 4. SIDE ISO CONTAINER IDENTIFICATION DATA (Discretely Right-Aligned at Top Corner)
  ctxS.textAlign = 'right';
  ctxS.fillStyle = 'rgba(255, 255, 255, 0.90)';
  ctxS.font = 'bold 96px "Courier New", monospace';
  ctxS.fillText('HHBU  749201  4', 3880, 200);
  ctxS.fillText('22G1', 3880, 320);

  const sideTex = new THREE.CanvasTexture(sideCanvas);
  sideTex.generateMipmaps = true;
  sideTex.minFilter = THREE.LinearMipmapLinearFilter;
  sideTex.magFilter = THREE.LinearFilter;
  sideTex.anisotropy = 16;
  sideTex.needsUpdate = true;

  return { doorTex, sideTex };
}

// ══════════════════════════════════════════
// ISO MARKINGS & DECALS OVERLAYS (PBR Industrial Painted Stencils)
// ══════════════════════════════════════════
function ISOMarkings({ bumpTexture }) {
  const { doorTex, sideTex } = useMemo(() => getISOMarkingsTextures(), []);

  // Shared PBR Material parameters for unwarped flat stencil presentation
  const doorMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: doorTex,
        transparent: true,
        alphaTest: 0.02,
        roughness: 0.50,
        metalness: 0.16,
        bumpMap: bumpTexture,
        bumpScale: 0.0012,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        polygonOffsetUnits: -2,
        depthWrite: true,
      }),
    [doorTex, bumpTexture]
  );

  // Matte Industrial Paint Side Material (Zero chrome, zero reflections, pure screen-printed matte paint)
  const sideMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: sideTex,
        transparent: true,
        alphaTest: 0.02,
        roughness: 0.85,
        metalness: 0.0,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        polygonOffsetUnits: -2,
        depthWrite: true,
      }),
    [sideTex]
  );

  // Flat side decal plane sitting slightly off the corrugated peaks for zero wrapping distortion
  const sidePlaneOffset = HW + C.corrDepth + 0.004;

  return (
    <group>
      {/* Door Markings Overlay (Front door face) — Positioned +0.022m to clear outer door hardware plates */}
      <mesh position={[HL + 0.022, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={doorMat}>
        <planeGeometry args={[C.W - 0.08, C.H - 0.08]} />
      </mesh>

      {/* Right Side Wall Branding (Flat unwarped overlay plane occupying 24% of height, centered horizontally) */}
      <mesh position={[0, 0.08, sidePlaneOffset]} rotation={[0, 0, 0]} material={sideMat}>
        <planeGeometry args={[C.L * 0.88, C.H * 0.58]} />
      </mesh>

      {/* Left Side Wall Branding (Flat unwarped overlay plane occupying 24% of height, centered horizontally) */}
      <mesh position={[0, 0.08, -sidePlaneOffset]} rotation={[0, Math.PI, 0]} material={sideMat}>
        <planeGeometry args={[C.L * 0.88, C.H * 0.58]} />
      </mesh>
    </group>
  );
}

// ══════════════════════════════════════════
// SEALED INNER SHELL — the watertight core
// A solid BoxGeometry = 6 sealed faces.
// Prevents ANY interior visibility.
// ══════════════════════════════════════════
function InnerShell({ mat }) {
  return (
    <mesh castShadow receiveShadow material={mat}>
      <boxGeometry args={[C.L, C.H, C.W]} />
    </mesh>
  );
}

// ══════════════════════════════════════════
// CORRUGATED SKINS — visual detail on outside
// Sit ON TOP of the inner shell.
// Even if gaps exist at edges, the shell behind blocks view.
// ══════════════════════════════════════════
function CorrugatedSkins({ mat }) {
  const sideGeo = useMemo(() => makeCorrugatedGeo(C.L + 0.01, C.H + 0.01, C.corrCount, C.corrDepth), []);
  const backGeo = useMemo(() => makeCorrugatedGeo(C.W + 0.01, C.H + 0.01, C.corrCountEnd, C.corrDepth), []);

  return (
    <group>
      {/* Right side wall */}
      <mesh geometry={sideGeo} material={mat} position={[0, 0, HW + 0.001]} castShadow receiveShadow />
      {/* Left side wall (flipped) */}
      <mesh geometry={sideGeo} material={mat} position={[0, 0, -HW - 0.001]} rotation={[0, Math.PI, 0]} castShadow receiveShadow />
      {/* Back wall */}
      <mesh geometry={backGeo} material={mat} position={[-HL - 0.001, 0, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow receiveShadow />
    </group>
  );
}

// ══════════════════════════════════════════
// ROOF — Transverse ISO Corrugated Roof & Edge Reinforcements
// ══════════════════════════════════════════
function Roof({ mat, darkMat }) {
  const prevRoofMatRef = useRef(null);

  // Flat-shaded material clone for roof corrugated panels to eliminate vertex normal interpolation optical illusion
  const roofMat = useMemo(() => {
    if (prevRoofMatRef.current) {
      prevRoofMatRef.current.dispose();
    }
    const m = mat.clone();
    m.flatShading = true;
    prevRoofMatRef.current = m;
    return m;
  }, [mat]);

  useEffect(() => {
    return () => {
      if (prevRoofMatRef.current) {
        prevRoofMatRef.current.dispose();
        prevRoofMatRef.current = null;
      }
    };
  }, []);

  // Transverse roof corrugation geometry (14 uniform die-pressed ribs across top to prevent moire frequency aliasing)
  const roofGeo = useMemo(() => {
    const w = C.W - 0.20;
    const l = C.L - 0.36;
    const n = 14; // 14 uniform transverse corrugation ribs
    const d = 0.022; // 22mm pressed roof corrugation depth
    return makeCorrugatedGeo(w, l, n, d);
  }, []);

  return (
    <group position={[0, HH + 0.002, 0]}>
      {/* ── 1. Base Sealed Roof Plate (Clean 4mm base thickness) ── */}
      <mesh castShadow receiveShadow material={mat}>
        <boxGeometry args={[C.L + 0.02, 0.004, C.W + 0.02]} />
      </mesh>

      {/* ── 2. Die-Pressed Transverse Corrugated Roof Panels (Offset +0.005m for zero coplanar Z-fighting) ── */}
      <mesh
        geometry={roofGeo}
        material={roofMat}
        position={[0, 0.005, 0]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        castShadow
        receiveShadow
      />

      {/* ── 3. Roof Edge Reinforcement & Longitudinal Rain Channels / Gutters ── */}
      {[-HW + 0.04, HW - 0.04].map((zFlange, idx) => (
        <group key={`roof-flange-${idx}`} position={[0, 0.012, zFlange]}>
          {/* Main Gutter Support Flange */}
          <mesh material={mat} castShadow>
            <boxGeometry args={[C.L - 0.36, 0.016, 0.032]} />
          </mesh>
          {/* Outer Rain Channel Edge Retention Lip */}
          <mesh position={[0, 0.008, zFlange > 0 ? 0.014 : -0.014]} material={mat} castShadow>
            <boxGeometry args={[C.L - 0.36, 0.012, 0.006]} />
          </mesh>
          {/* Inner Rain Drainage Channel Recess */}
          <mesh position={[0, 0.004, zFlange > 0 ? -0.006 : 0.006]} material={darkMat}>
            <boxGeometry args={[C.L - 0.36, 0.004, 0.012]} />
          </mesh>
        </group>
      ))}

      {/* ── 4. Roof Corner Casting Transition Gusset Plates (4 Top Corners) ── */}
      {[1, -1].map((xSign, i) =>
        [1, -1].map((zSign, j) => (
          <mesh
            key={`roof-corner-gusset-${i}-${j}`}
            position={[xSign * (HL - 0.16), 0.008, zSign * (HW - 0.14)]}
            material={mat}
            castShadow
          >
            <boxGeometry args={[0.22, 0.008, 0.22]} />
          </mesh>
        ))
      )}

      {/* ── 5. Transverse Roof Panel Seam Weld Lines ── */}
      {[-1.8, -0.9, 0, 0.9, 1.8].map((xSeam, sIdx) => (
        <mesh key={`roof-seam-${sIdx}`} position={[xSeam, 0.015, 0]} rotation={[Math.PI / 2, 0, 0]} material={darkMat} geometry={GEO.seamWeld} />
      ))}
    </group>
  );
}

// ══════════════════════════════════════════
// BOTTOM PLATE — seals underside
// ══════════════════════════════════════════
function BottomPlate({ mat }) {
  return (
    <mesh position={[0, -HH - 0.002, 0]} receiveShadow material={mat}>
      <boxGeometry args={[C.L + 0.02, 0.006, C.W + 0.02]} />
    </mesh>
  );
}

// ══════════════════════════════════════════
// FRAME RAILS — Flush Top & Bottom Structural Rails
// ══════════════════════════════════════════
function FrameRails({ mat }) {
  const rH = C.railH;
  const rD = 0.09;
  const ext = C.corrDepth + 0.008; // Flush extension past corrugation peaks

  const rails = [
    // Top longitudinal side rails (Tubular Corten steel)
    { p: [0, HH - rH / 2 + 0.005, HW + ext / 2], s: [C.L - C.castSize, rH, rD] },
    { p: [0, HH - rH / 2 + 0.005, -HW - ext / 2], s: [C.L - C.castSize, rH, rD] },
    // Top end rails / Front Door Header Rail & Rear Roof Rail
    { p: [HL - C.castSize / 2, HH - rH / 2 + 0.005, 0], s: [rD, rH + 0.016, C.W - C.castSize] },
    { p: [-HL + C.castSize / 2, HH - rH / 2 + 0.005, 0], s: [rD, rH + 0.016, C.W - C.castSize] },
    // Bottom longitudinal side rails (Heavy C-channel profile with bottom flange)
    { p: [0, -HH + C.frameH / 2 - 0.005, HW + ext / 2], s: [C.L - C.castSize, C.frameH, rD] },
    { p: [0, -HH + C.frameH / 2 - 0.005, -HW - ext / 2], s: [C.L - C.castSize, C.frameH, rD] },
    // Bottom end rails / Front Door Sill Channel
    { p: [HL - C.castSize / 2, -HH + C.frameH / 2 - 0.005, 0], s: [rD, C.frameH + 0.016, C.W - C.castSize] },
    { p: [-HL + C.castSize / 2, -HH + C.frameH / 2 - 0.005, 0], s: [rD, C.frameH + 0.016, C.W - C.castSize] },
  ];

  return (
    <group>
      {rails.map((r, i) => (
        <mesh key={`rail-${i}`} position={r.p} material={mat} castShadow receiveShadow>
          <boxGeometry args={r.s} />
        </mesh>
      ))}

      {/* Front Door Header Rain Gutter Edge Flange */}
      <mesh position={[HL + 0.042, HH + 0.008, 0]} material={mat} castShadow>
        <boxGeometry args={[0.038, 0.014, C.W - C.castSize + 0.02]} />
      </mesh>
    </group>
  );
}

// ══════════════════════════════════════════
// CORNER POSTS — Folded Corten L-section Vertical Columns
// ══════════════════════════════════════════
function CornerPosts({ mat }) {
  const pw = C.postW;
  const postH = C.H - C.castSize * 2 + 0.004; // Extends flush between corner castings

  // 4 corners: [xSign, zSign]
  const corners = [
    [1, 1],   // Front Right
    [1, -1],  // Front Left
    [-1, 1],  // Back Right
    [-1, -1], // Back Left
  ];

  return (
    <group>
      {corners.map(([xSign, zSign], i) => {
        const xPos = xSign * (HL - pw / 2);
        const zPos = zSign * (HW - pw / 2);

        return (
          <group key={`corner-post-${i}`} position={[xPos, 0, zPos]}>
            {/* Front/Back Outer Column Face Plate (18mm structural thickness) */}
            <mesh position={[xSign * 0.01, 0, 0]} material={mat} castShadow receiveShadow>
              <boxGeometry args={[pw, postH, 0.018]} />
            </mesh>
            {/* Side Outer Column Face Plate (18mm structural thickness) */}
            <mesh position={[0, 0, zSign * 0.01]} material={mat} castShadow receiveShadow>
              <boxGeometry args={[0.018, postH, pw]} />
            </mesh>
            {/* Inner Corner Stiffener Core Member */}
            <mesh position={[-xSign * 0.02, 0, -zSign * 0.02]} material={mat} castShadow>
              <boxGeometry args={[pw - 0.04, postH, pw - 0.04]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// ══════════════════════════════════════════
// STEEL REINFORCEMENTS & INDUSTRIAL GUSSETS
// ══════════════════════════════════════════
function SteelReinforcements({ mat, frameMat }) {
  const ext = C.corrDepth + 0.008;
  const gussetS = 0.085;

  return (
    <group>
      {/* ── 1. Door Frame Top Header & Sill Reinforcement Plates ── */}
      {[-HW + 0.15, HW - 0.15].map((zPos, idx) => (
        <group key={`door-reinforce-${idx}`}>
          {/* Top Header Gusset Plate */}
          <mesh position={[HL - 0.01, HH - C.railH * 0.5, zPos]} material={frameMat} castShadow>
            <boxGeometry args={[0.014, 0.12, 0.14]} />
          </mesh>
          {/* Bottom Sill Support Gusset Plate */}
          <mesh position={[HL - 0.01, -HH + C.frameH * 0.5, zPos]} material={frameMat} castShadow>
            <boxGeometry args={[0.014, 0.14, 0.14]} />
          </mesh>
        </group>
      ))}

      {/* ── 2. Structural Corner Post Diagonal Gussets (All 8 Frame Corners) ── */}
      {[1, -1].map((xSign, i) =>
        [1, -1].map((zSign, j) =>
          [1, -1].map((ySign, k) => (
            <mesh
              key={`gusset-${i}-${j}-${k}`}
              position={[
                xSign * (HL - 0.14),
                ySign * (HH - 0.08),
                zSign * (HW + ext / 2),
              ]}
              rotation={[0, 0, xSign * ySign * 0.785]}
              material={frameMat}
              castShadow
            >
              <boxGeometry args={[gussetS, 0.01, 0.065]} />
            </mesh>
          ))
        )
      )}

      {/* ── 3. Bottom Longitudinal Rub Rails (Protective Steel Strips along lower side walls) ── */}
      {[-HW - ext - 0.001, HW + ext + 0.001].map((zSide, sideIdx) => (
        <group key={`rub-rail-${sideIdx}`}>
          <mesh position={[0, -HH + 0.08, zSide]} material={mat} castShadow>
            <boxGeometry args={[C.L - C.castSize * 2, 0.018, 0.01]} />
          </mesh>
          <mesh position={[0, -HH + 0.22, zSide]} material={mat} castShadow>
            <boxGeometry args={[C.L - C.castSize * 2, 0.018, 0.01]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ══════════════════════════════════════════
// WELD BEADS — Industrial welded seam lines
// ══════════════════════════════════════════
function WeldBeads({ mat }) {
  const ext = C.corrDepth + 0.008;

  return (
    <group>
      {/* Vertical Corner Post Weld Seam Beads (4 Vertical Columns) */}
      {[1, -1].map((xSign, i) =>
        [1, -1].map((zSign, j) => (
          <mesh
            key={`v-weld-${i}-${j}`}
            position={[xSign * (HL - 0.004), 0, zSign * (HW - 0.004)]}
            material={mat}
            geometry={GEO.weldBeadV}
            castShadow
          />
        ))
      )}

      {/* Horizontal Top & Bottom Rail Longitudinal Weld Seams */}
      {[1, -1].map((zSign, idx) => (
        <group key={`h-weld-${idx}`}>
          {/* Top Rail Weld Seam */}
          <mesh position={[0, HH - 0.01, zSign * (HW + ext / 2 + 0.001)]} rotation={[0, 0, Math.PI / 2]} material={mat} geometry={GEO.weldBeadH} />
          {/* Bottom Rail Weld Seam */}
          <mesh position={[0, -HH + 0.02, zSign * (HW + ext / 2 + 0.001)]} rotation={[0, 0, Math.PI / 2]} material={mat} geometry={GEO.weldBeadH} />
        </group>
      ))}
    </group>
  );
}

// ══════════════════════════════════════════
// CORNER CASTINGS — Authentic ISO 1161 Corner Blocks
// ══════════════════════════════════════════
function SingleCornerCasting({ pos, isTop, isFront, isRight, mat, darkMat }) {
  const s = C.castSize; // 0.178m (ISO 1161 standard)
  const holeMat = darkMat;

  // Aperture dimensions (ISO 1161 twistlock holes)
  const topHoleW = 0.063, topHoleL = 0.124;
  const sideHoleW = 0.051, sideHoleL = 0.102;

  // Normal directions for exposed faces
  const yDir = isTop ? 1 : -1;
  const xDir = isFront ? 1 : -1;
  const zDir = isRight ? 1 : -1;

  return (
    <group position={pos}>
      {/* Main Solid Cast Steel Block Body */}
      <mesh material={mat} castShadow receiveShadow>
        <boxGeometry args={[s, s, s]} />
      </mesh>

      {/* Outer Chamfered Bevel Accent Frame (3D Inset Trim) */}
      <mesh material={mat} castShadow>
        <boxGeometry args={[s * 0.96, s * 0.96, s * 0.96]} />
      </mesh>

      {/* ── 1. Top / Bottom ISO Twistlock Aperture (Stadium Hole) ── */}
      <group position={[0, yDir * (s / 2 + 0.001), 0]} rotation={[-yDir * Math.PI / 2, 0, 0]}>
        {/* Recessed Dark Hole Interior */}
        <mesh material={holeMat}>
          <planeGeometry args={[topHoleW, topHoleL]} />
        </mesh>
        {/* Rounded End Caps for Oval Twistlock Hole */}
        {[-topHoleL / 2 + topHoleW / 2, topHoleL / 2 - topHoleW / 2].map((yOff, idx) => (
          <mesh key={`top-cap-${idx}`} position={[0, yOff, 0.0005]} material={holeMat}>
            <circleGeometry args={[topHoleW / 2, 12]} />
          </mesh>
        ))}
        {/* Raised Beveled Hole Rim Collar */}
        <mesh material={mat} position={[0, 0, 0.001]}>
          <ringGeometry args={[topHoleW / 2, topHoleW / 2 + 0.012, 16]} />
        </mesh>
      </group>

      {/* ── 2. Front / Back ISO Aperture (End Face Hole) ── */}
      <group position={[xDir * (s / 2 + 0.001), 0, 0]} rotation={[0, xDir * Math.PI / 2, 0]}>
        {/* Recessed Dark Hole Interior */}
        <mesh material={holeMat}>
          <planeGeometry args={[sideHoleL, sideHoleW]} />
        </mesh>
        {/* Rounded End Caps */}
        {[-sideHoleL / 2 + sideHoleW / 2, sideHoleL / 2 - sideHoleW / 2].map((xOff, idx) => (
          <mesh key={`front-cap-${idx}`} position={[xOff, 0, 0.0005]} material={holeMat}>
            <circleGeometry args={[sideHoleW / 2, 12]} />
          </mesh>
        ))}
        {/* Beveled Hole Rim Collar */}
        <mesh material={mat} position={[0, 0, 0.001]}>
          <ringGeometry args={[sideHoleW / 2, sideHoleW / 2 + 0.012, 16]} />
        </mesh>
      </group>

      {/* ── 3. Outer Side ISO Aperture (Side Face Hole) ── */}
      <group position={[0, 0, zDir * (s / 2 + 0.001)]} rotation={[0, 0, 0]}>
        {/* Recessed Dark Hole Interior */}
        <mesh material={holeMat}>
          <planeGeometry args={[sideHoleL, sideHoleW]} />
        </mesh>
        {/* Rounded End Caps */}
        {[-sideHoleL / 2 + sideHoleW / 2, sideHoleL / 2 - sideHoleW / 2].map((xOff, idx) => (
          <mesh key={`side-cap-${idx}`} position={[xOff, 0, 0.0005]} material={holeMat}>
            <circleGeometry args={[sideHoleW / 2, 12]} />
          </mesh>
        ))}
        {/* Beveled Hole Rim Collar */}
        <mesh material={mat} position={[0, 0, 0.001]}>
          <ringGeometry args={[sideHoleW / 2, sideHoleW / 2 + 0.012, 16]} />
        </mesh>
      </group>
    </group>
  );
}

function CornerCastings({ mat, darkMat }) {
  const s = C.castSize;
  const off = s / 2 + 0.008;

  const cornerDefs = [
    { pos: [HL + off - s / 2, HH + off - s / 2, HW + off - s / 2],   isTop: true,  isFront: true,  isRight: true  },
    { pos: [HL + off - s / 2, HH + off - s / 2, -HW - off + s / 2],  isTop: true,  isFront: true,  isRight: false },
    { pos: [-HL - off + s / 2, HH + off - s / 2, HW + off - s / 2],  isTop: true,  isFront: false, isRight: true  },
    { pos: [-HL - off + s / 2, HH + off - s / 2, -HW - off + s / 2], isTop: true,  isFront: false, isRight: false },
    { pos: [HL + off - s / 2, -HH - off + s / 2, HW + off - s / 2],  isTop: false, isFront: true,  isRight: true  },
    { pos: [HL + off - s / 2, -HH - off + s / 2, -HW - off + s / 2], isTop: false, isFront: true,  isRight: false },
    { pos: [-HL - off + s / 2, -HH - off + s / 2, HW + off - s / 2], isTop: false, isFront: false, isRight: true  },
    { pos: [-HL - off + s / 2, -HH - off + s / 2, -HW - off + s / 2],isTop: false, isFront: false, isRight: false },
  ];

  return (
    <group>
      {cornerDefs.map((def, i) => (
        <SingleCornerCasting
          key={`corner-casting-${i}`}
          pos={def.pos}
          isTop={def.isTop}
          isFront={def.isFront}
          isRight={def.isRight}
          mat={mat}
          darkMat={darkMat}
        />
      ))}
    </group>
  );
}

// ══════════════════════════════════════════
// BOTTOM FRAME — Authentic ISO Underside Construction (Rendered 3D Detail)
// ══════════════════════════════════════════
// ══════════════════════════════════════════
// BOTTOM FRAME — Real 3D Underside Construction & Hollow Forklift Pockets
// ══════════════════════════════════════════
function BottomFrame({ mat, darkMat }) {
  const crossCount = 18; // Standard 18 C-channel joists
  const usableL = C.L - C.postW * 2 - 0.2;
  const spacing = usableL / (crossCount + 1);
  const joistH = 0.095;
  const joistW = C.W - 0.16;

  // Standard ISO 20ft Forklift Pocket positions (X = ±1.025m) center-to-center
  const forkXPositions = [-1.025, 1.025];

  return (
    <group>
      {/* ── 1. C-Channel Floor Cross-Members (18 Transverse Structural Joists) ── */}
      {Array.from({ length: crossCount }, (_, i) => {
        const xPos = -HL + C.postW + 0.1 + spacing * (i + 1);
        // Skip cross members where forklift pockets sit
        const isNearFork = forkXPositions.some((fx) => Math.abs(fx - xPos) < 0.24);
        if (isNearFork) return null;

        return (
          <group key={`joist-${i}`} position={[xPos, -HH - joistH / 2 + 0.002, 0]}>
            {/* C-Channel Vertical Web Plate */}
            <mesh material={mat} castShadow receiveShadow>
              <boxGeometry args={[0.045, joistH, joistW]} />
            </mesh>
            {/* Top Flange Lip */}
            <mesh position={[0.015, joistH / 2 - 0.004, 0]} material={mat} castShadow>
              <boxGeometry args={[0.035, 0.008, joistW]} />
            </mesh>
            {/* Bottom Flange Lip */}
            <mesh position={[0.015, -joistH / 2 + 0.004, 0]} material={mat} castShadow>
              <boxGeometry args={[0.035, 0.008, joistW]} />
            </mesh>
          </group>
        );
      })}

      {/* ── 2. ISO Forklift Pockets (Real 3D Hollow Tunnel Assemblies) ── */}
      {forkXPositions.map((forkX, idx) => (
        <group key={`forklift-pocket-${idx}`} position={[forkX, -HH - 0.055, 0]}>
          {/* Top Heavy Steel Load Distribution Plate (Spans full container width) */}
          <mesh position={[0, 0.052, 0]} material={mat} castShadow receiveShadow>
            <boxGeometry args={[0.38, 0.014, C.W - 0.08]} />
          </mesh>

          {/* Real 3D Hollow Tunnel Sleeves (Left & Right Entry Portals) */}
          {[-1, 1].map((side) => {
            const sleeveZ = side * (HW - 0.32);
            return (
              <group key={`fork-sleeve-${side}`} position={[0, 0, sleeveZ]}>
                {/* Sleeve Top Plate */}
                <mesh position={[0, 0.045, 0]} material={mat} castShadow>
                  <boxGeometry args={[0.36, 0.012, 0.54]} />
                </mesh>
                {/* Sleeve Bottom Tie Strap Plate */}
                <mesh position={[0, -0.045, 0]} material={mat} castShadow>
                  <boxGeometry args={[0.36, 0.012, 0.54]} />
                </mesh>
                {/* Front & Back Vertical Steel Guide Walls */}
                {[-0.174, 0.174].map((wallX, wIdx) => (
                  <mesh key={`sleeve-wall-${wIdx}`} position={[wallX, 0, 0]} material={mat} castShadow>
                    <boxGeometry args={[0.012, 0.098, 0.54]} />
                  </mesh>
                ))}
                {/* Outer Portal Collar Bezel Welded to Bottom Side Rail */}
                <mesh position={[0, 0, side * 0.26]} material={mat} castShadow>
                  <boxGeometry args={[0.38, 0.11, 0.016]} />
                </mesh>
              </group>
            );
          })}
        </group>
      ))}

      {/* ── 3. Central Chassis Tunnel / Gooseneck Longitudinal I-Beams ── */}
      {[-0.42, 0.42].map((zBeam, bIdx) => (
        <group key={`chassis-beam-${bIdx}`} position={[0, -HH - 0.048, zBeam]}>
          {/* Main Web */}
          <mesh material={mat} castShadow receiveShadow>
            <boxGeometry args={[C.L - C.castSize * 2, 0.055, 0.016]} />
          </mesh>
          {/* Top Flange Lip */}
          <mesh position={[0, 0.024, 0]} material={mat} castShadow>
            <boxGeometry args={[C.L - C.castSize * 2, 0.008, 0.045]} />
          </mesh>
          {/* Bottom Flange Lip */}
          <mesh position={[0, -0.024, 0]} material={mat} castShadow>
            <boxGeometry args={[C.L - C.castSize * 2, 0.008, 0.045]} />
          </mesh>
        </group>
      ))}

      {/* ── 4. Chassis Twist-Lock Corner Seating Pads (4 Underside Corners) ── */}
      {[1, -1].map((xSign, i) =>
        [1, -1].map((zSign, j) => (
          <mesh
            key={`pad-${i}-${j}`}
            position={[xSign * (HL - 0.22), -HH - 0.065, zSign * (HW - 0.16)]}
            material={mat}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.18, 0.022, 0.18]} />
          </mesh>
        ))
      )}
    </group>
  );
}

// ══════════════════════════════════════════
// DOOR ASSEMBLY — Authentic ISO 20ft Rear Doors & Hardware
// ══════════════════════════════════════════
// ══════════════════════════════════════════
// DOOR ASSEMBLY — Authentic ISO 20ft Rear Doors & 3D Hardware
// ══════════════════════════════════════════
function DoorAssembly({ mats }) {
  const doorW = (C.W - C.doorGap) / 2 - 0.02;
  const doorH = C.H - 0.025;
  const doorX = HL + 0.008; // Door panel center

  // 4 bar Z-positions (2 for left door, 2 for right door)
  const barPositions = [
    -doorW * 0.72 - C.doorGap / 2,
    -doorW * 0.28 - C.doorGap / 2,
    doorW * 0.28 + C.doorGap / 2,
    doorW * 0.72 + C.doorGap / 2,
  ];

  // 4 hinge heights per door
  const hingeHeights = [-doorH * 0.38, -doorH * 0.13, doorH * 0.13, doorH * 0.38];

  return (
    <group>
      {/* ── 1. Door Panels, Reinforcement Plates & Rubber Gasket Grooves ── */}
      {[-1, 1].map((side) => {
        const centerZ = side * (C.doorGap / 2 + doorW / 2);
        return (
          <group key={`door-panel-${side}`}>
            {/* Main Corrugated Door Panel Sheet */}
            <mesh position={[doorX, 0, centerZ]} castShadow receiveShadow material={mats.door}>
              <boxGeometry args={[0.012, doorH, doorW]} />
            </mesh>

            {/* Recessed Corrugation Profile Insert */}
            <mesh position={[doorX + 0.006, 0, centerZ]} castShadow material={mats.wall}>
              <boxGeometry args={[0.005, doorH * 0.88, doorW * 0.82]} />
            </mesh>

            {/* Perimeter Rubber Gasket Channel Groove Lip */}
            <mesh position={[doorX - 0.003, 0, centerZ]} material={mats.dark}>
              <boxGeometry args={[0.016, doorH + 0.016, doorW + 0.016]} />
            </mesh>

            {/* Inner Weather Tight EPDM Seal Ring */}
            <mesh position={[doorX - 0.001, 0, centerZ]} material={mats.dark}>
              <boxGeometry args={[0.01, doorH + 0.008, doorW + 0.008]} />
            </mesh>

            {/* 3D Door Corner Reinforcement Plates (4 per door leaf) */}
            {[1, -1].map((yDir) =>
              [1, -1].map((zDir) => (
                <mesh
                  key={`door-gusset-${side}-${yDir}-${zDir}`}
                  position={[doorX + 0.007, yDir * (doorH * 0.44), centerZ + zDir * (doorW * 0.38)]}
                  material={mats.frame}
                  castShadow
                >
                  <boxGeometry args={[0.008, 0.08, 0.08]} />
                </mesh>
              ))
            )}

            {/* Horizontal Locking Bar Mounting Reinforcement Plates */}
            {[-doorH * 0.32, 0.1, doorH * 0.32].map((yPlate, pIdx) => (
              <mesh
                key={`reinforce-plate-${side}-${pIdx}`}
                position={[doorX + 0.008, yPlate, centerZ]}
                material={mats.frame}
                castShadow
              >
                <boxGeometry args={[0.006, 0.06, doorW * 0.88]} />
              </mesh>
            ))}

            {/* Lower Door Retainer / Hold-Back Catch Hook (Door bottom edge) */}
            <group position={[doorX + 0.02, -doorH * 0.46, centerZ]}>
              <mesh castShadow material={mats.chrome}>
                <boxGeometry args={[0.024, 0.014, 0.014]} />
              </mesh>
              <mesh position={[0.01, -0.01, 0]} castShadow material={mats.chrome}>
                <cylinderGeometry args={[0.003, 0.003, 0.02, 8]} />
              </mesh>
            </group>
          </group>
        );
      })}

      {/* Center Vertical Interlocking Overlap Gasket Strip */}
      <mesh position={[doorX + 0.004, 0, 0]} material={mats.dark}>
        <boxGeometry args={[0.016, doorH, 0.022]} />
      </mesh>

      {/* Customs Lock Hasp & Seal Staple Assembly */}
      <group position={[doorX + 0.024, -0.05, 0]}>
        {/* Base Hasp Plate */}
        <mesh castShadow material={mats.frame}>
          <boxGeometry args={[0.01, 0.06, 0.07]} />
        </mesh>
        {/* Chrome Lock Catch Lug */}
        <mesh position={[0.01, 0, 0]} castShadow material={mats.chrome}>
          <boxGeometry args={[0.02, 0.035, 0.032]} />
        </mesh>
        {/* Security Bolt Seal Ring */}
        <mesh position={[0.018, 0, 0]} castShadow material={mats.dark}>
          <cylinderGeometry args={[0.005, 0.005, 0.025, 10]} />
        </mesh>
      </group>

      {/* ── 2. Four Galvanized Vertical Locking Bars & Cam Locking System ── */}
      {barPositions.map((z, i) => {
        const isRightDoorBar = z > 0;
        const handleDir = isRightDoorBar ? 1 : -1; // handle extends outward

        return (
          <group key={`locking-bar-assembly-${i}`}>
            {/* Main Galvanized Steel Pipe Locking Bar (28mm diameter) */}
            <mesh position={[doorX + 0.032, 0, z]} castShadow material={mats.chrome}>
              <cylinderGeometry args={[C.barR, C.barR, doorH * 0.94, 16]} />
            </mesh>

            {/* Top & Bottom Cam Locking System (Rotating Wedge Cams & Catch Boxes) */}
            {[doorH * 0.48, -doorH * 0.48].map((yCam, j) => {
              const isTopCam = yCam > 0;
              return (
                <group key={`cam-keeper-${i}-${j}`} position={[doorX + 0.034, yCam, z]}>
                  {/* Tapered Rotating Wedge Cam Head */}
                  <mesh castShadow material={mats.chrome}>
                    <boxGeometry args={[0.028, 0.034, 0.026]} />
                  </mesh>
                  {/* Wedge Cam Extension Hook */}
                  <mesh position={[0.006, isTopCam ? 0.016 : -0.016, 0]} castShadow material={mats.chrome}>
                    <boxGeometry args={[0.018, 0.02, 0.018]} />
                  </mesh>
                  {/* Cam Keeper Catch Box (Frame Mounted Receptacle) */}
                  <mesh position={[-0.008, isTopCam ? 0.014 : -0.014, 0]} castShadow material={mats.frame}>
                    <boxGeometry args={[0.028, 0.026, 0.042]} />
                  </mesh>
                  {/* Dark Internal Guide Slot */}
                  <mesh position={[-0.006, isTopCam ? 0.014 : -0.014, 0]} material={mats.dark}>
                    <boxGeometry args={[0.014, 0.022, 0.024]} />
                  </mesh>
                </group>
              );
            })}

            {/* 3D Split Bar Guide Brackets / Collars (3 per bar = 12 total) */}
            {[-doorH * 0.32, 0.1, doorH * 0.32].map((yGuide, k) => (
              <group key={`guide-bracket-${i}-${k}`} position={[doorX + 0.016, yGuide, z]}>
                {/* Back Mounting Plate */}
                <mesh position={[-0.004, 0, 0]} castShadow material={mats.frame}>
                  <boxGeometry args={[0.008, 0.055, 0.048]} />
                </mesh>
                {/* Outer Bracket Clamp Collar */}
                <mesh position={[0.012, 0, 0]} castShadow material={mats.frame}>
                  <boxGeometry args={[0.018, 0.045, 0.038]} />
                </mesh>
                {/* 3D Rivet Heads Securing Collar */}
                {[-0.018, 0.018].map((zRivet, rIdx) => (
                  <mesh key={`guide-rivet-${rIdx}`} position={[0.018, 0, zRivet]} material={mats.chrome} geometry={GEO.rivet} />
                ))}
              </group>
            ))}

            {/* Locking Handle & Catch Assembly (Waist height) */}
            <group position={[doorX + 0.032, -0.12, z]}>
              {/* Handle Mounting Hub Block */}
              <mesh position={[0.008, 0, 0]} castShadow material={mats.chrome}>
                <boxGeometry args={[0.02, 0.048, 0.03]} />
              </mesh>
              {/* Hub Hinge Pin */}
              <mesh position={[0.008, 0, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.chrome} geometry={GEO.rivet} />

              {/* Lever Arm */}
              <mesh position={[0.018, 0, handleDir * 0.08]} rotation={[0, 0, -0.05]} castShadow material={mats.chrome}>
                <boxGeometry args={[0.012, 0.022, 0.14]} />
              </mesh>

              {/* Molded Black Rubber Handle Grip */}
              <mesh position={[0.020, 0, handleDir * 0.14]} castShadow material={mats.dark}>
                <boxGeometry args={[0.018, 0.026, 0.055]} />
              </mesh>

              {/* Handle Retainer Plate & Catch Hasp */}
              <mesh position={[0.008, 0, handleDir * 0.11]} castShadow material={mats.frame}>
                <boxGeometry args={[0.014, 0.06, 0.026]} />
              </mesh>
              {/* Padlock Hole Hasp */}
              <mesh position={[0.016, -0.01, handleDir * 0.11]} material={mats.chrome} geometry={GEO.padlockHasp} />
            </group>
          </group>
        );
      })}

      {/* ── 3. Correct 3D ISO Door Hinges (4 Per Door = 8 Total) ── */}
      {[-HW + 0.055, HW - 0.055].map((zHinge, sideIdx) => (
        <group key={`hinge-column-${sideIdx}`}>
          {hingeHeights.map((yHinge, hIdx) => {
            const isRightSide = zHinge > 0;
            const bladeZOffset = isRightSide ? -0.045 : 0.045;

            return (
              <group key={`hinge-${sideIdx}-${hIdx}`} position={[doorX + 0.022, yHinge, zHinge]}>
                {/* Vertical Stainless Hinge Pin */}
                <mesh castShadow material={mats.chrome} geometry={GEO.hingePin} />

                {/* Hinge Lug (Frame Corner Post side mount) */}
                <mesh position={[-0.008, 0, 0]} castShadow material={mats.frame}>
                  <boxGeometry args={[0.018, 0.058, 0.028]} />
                </mesh>

                {/* Tapered Steel Hinge Blade (Door panel face mount) */}
                <mesh position={[0.002, 0, bladeZOffset]} castShadow material={mats.frame}>
                  <boxGeometry args={[0.012, 0.042, 0.08]} />
                </mesh>

                {/* 3D Rivets on Hinge Blade */}
                {[-0.02, 0, 0.02].map((rOffset, rIdx) => (
                  <mesh
                    key={`hinge-rivet-${rIdx}`}
                    position={[0.009, 0, bladeZOffset + rOffset * (isRightSide ? -1 : 1)]}
                    rotation={[0, Math.PI / 2, 0]}
                    material={mats.chrome}
                  >
                    <cylinderGeometry args={[0.0035, 0.0035, 0.006, 8]} />
                  </mesh>
                ))}
              </group>
            );
          })}
        </group>
      ))}
    </group>
  );
}

// ══════════════════════════════════════════
// HAZARD STRIPES — yellow/black at top corners
// ══════════════════════════════════════════
function HazardStripes({ hazardMat, darkMat }) {
  const s = C.castSize;
  const positions = [
    [HL + 0.01, HH + 0.015, HW + 0.01],
    [HL + 0.01, HH + 0.015, -HW - 0.01],
    [-HL - 0.01, HH + 0.015, HW + 0.01],
    [-HL - 0.01, HH + 0.015, -HW - 0.01],
  ];
  return (
    <group>
      {positions.map((p, i) => (
        <group key={i}>
          <mesh position={p} rotation={[-Math.PI / 2, 0, 0]} material={hazardMat}>
            <planeGeometry args={[s * 0.85, s * 0.85]} />
          </mesh>
          <mesh position={[p[0], p[1] + 0.001, p[2]]} rotation={[-Math.PI / 2, 0, Math.PI / 4]} material={darkMat}>
            <planeGeometry args={[0.025, s * 1.1]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ══════════════════════════════════════════
// MAIN EXPORT
// Architecture: Sealed Inner Shell + External Skins
// The BoxGeometry inner shell has 6 sealed faces.
// Corrugated panels, rails, posts sit ON TOP.
// No interior visible from any angle.
// ══════════════════════════════════════════
export default function ContainerModel({ color = '#1E2A3A' }) {
  const m = useMats(color);

  return (
    <group>
      {/* LAYER 1: Sealed watertight inner shell */}
      <InnerShell mat={m.shell} />

      {/* LAYER 2: Corrugated skins on outside */}
      <CorrugatedSkins mat={m.wall} />

      {/* LAYER 3: Solid roof + bottom (overlap all edges) */}
      <Roof mat={m.roof} darkMat={m.dark} />
      <BottomPlate mat={m.frame} />

      {/* LAYER 4: Structural frame (overlaps shell + skins) */}
      <FrameRails mat={m.frame} />
      <CornerPosts mat={m.frame} />

      {/* LAYER 5: Door assembly covers front face */}
      <DoorAssembly mats={m} />

      {/* LAYER 6: Industrial Steel Reinforcements & Weld Seam Beads */}
      <SteelReinforcements mat={m.wall} frameMat={m.frame} />
      <WeldBeads mat={m.dark} />

      {/* LAYER 7: Corner castings */}
      <CornerCastings mat={m.casting} darkMat={m.dark} />

      {/* LAYER 8: Bottom cross-members */}
      <BottomFrame mat={m.frame} darkMat={m.dark} />

      {/* LAYER 9: Hazard details */}
      <HazardStripes hazardMat={m.hazard} darkMat={m.dark} />

      {/* LAYER 10: ISO 6346 Markings & Decals */}
      <ISOMarkings bumpTexture={m.wall.bumpMap} />
    </group>
  );
}
