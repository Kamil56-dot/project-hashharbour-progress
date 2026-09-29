import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';

// ─── ISO 20ft Tank Container Dimensions (Standard ISO 1496/3) ───
const C = {
  L: 6.058,
  W: 2.438,
  H: 2.591,
  castSize: 0.178,
  postW: 0.12,
  railH: 0.10,
  tankR: 1.10, // Tank vessel radius (2.20m diameter)
  tankL: 5.65, // Tank vessel cylindrical length
};

const HL = C.L / 2; // 3.029m
const HW = C.W / 2; // 1.219m
const HH = C.H / 2; // 1.2955m

// ─── Procedural Brushed Stainless Steel Normal & Roughness Texture ───
let _cachedTankTextures = null;
function getTankTextures() {
  if (!_cachedTankTextures) {
    // 1. Brushed Stainless Steel Texture (512x512 with fine horizontal micro-brush lines)
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base satin metallic gray
    ctx.fillStyle = '#C0C6CE';
    ctx.fillRect(0, 0, 512, 512);

    // Fine circumferential/horizontal brush grain
    for (let y = 0; y < 512; y++) {
      const grain = (Math.random() - 0.5) * 18;
      const val = Math.min(255, Math.max(0, 192 + grain));
      ctx.fillStyle = `rgba(${val}, ${val}, ${val}, 0.22)`;
      ctx.fillRect(0, y, 512, 1);
    }

    // Subtle micro-scratches & handling specular variance
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.10)';
    ctx.lineWidth = 0.75;
    for (let i = 0; i < 40; i++) {
      const sx = Math.random() * 512;
      const sy = Math.random() * 512;
      const len = 30 + Math.random() * 80;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + len, sy + (Math.random() - 0.5) * 4);
      ctx.stroke();
    }

    const brushedTex = new THREE.CanvasTexture(canvas);
    brushedTex.wrapS = THREE.RepeatWrapping;
    brushedTex.wrapT = THREE.RepeatWrapping;
    brushedTex.repeat.set(4, 2);
    brushedTex.minFilter = THREE.LinearMipmapLinearFilter;
    brushedTex.magFilter = THREE.LinearFilter;

    // 2. Subtle Tank Decal Canvas (Anchor Logo + Stencil Spec Text)
    const decalCanvas = document.createElement('canvas');
    decalCanvas.width = 1024;
    decalCanvas.height = 512;
    const dCtx = decalCanvas.getContext('2d');
    dCtx.clearRect(0, 0, 1024, 512);

    // Subtle dark slate / navy technical stencil text
    dCtx.fillStyle = 'rgba(30, 41, 59, 0.85)';
    dCtx.textAlign = 'center';

    // Anchor emblem outline
    dCtx.strokeStyle = 'rgba(30, 41, 59, 0.80)';
    dCtx.lineWidth = 5;
    const cx = 512, cy = 180;
    dCtx.beginPath();
    dCtx.arc(cx, cy - 40, 22, 0, Math.PI * 2);
    dCtx.stroke();
    dCtx.strokeRect(cx - 3, cy - 20, 6, 80);
    dCtx.strokeRect(cx - 35, cy - 5, 70, 6);
    dCtx.beginPath();
    dCtx.arc(cx, cy + 25, 45, 0.15 * Math.PI, 0.85 * Math.PI, false);
    dCtx.stroke();

    // Brand Wordmark
    dCtx.font = '900 48px "Impact", "Bebas Neue", sans-serif';
    dCtx.letterSpacing = '6px';
    dCtx.fillText('#HASHHARBOUR', cx, cy + 115);

    dCtx.font = 'bold 18px monospace';
    dCtx.letterSpacing = '3px';
    dCtx.fillStyle = 'rgba(51, 65, 85, 0.80)';
    dCtx.fillText('UN PORTABLE TANK T11 · 26,000L', cx, cy + 155);
    dCtx.fillText('HHXU  928301  2  //  22T6', cx, cy + 185);

    const decalTex = new THREE.CanvasTexture(decalCanvas);
    decalTex.minFilter = THREE.LinearMipmapLinearFilter;
    decalTex.magFilter = THREE.LinearFilter;

    _cachedTankTextures = { brushedTex, decalTex };
  }
  return _cachedTankTextures;
}

// ─── PBR Materials for Tank Container ───
function useTankMats(frameHex) {
  const { brushedTex, decalTex } = useMemo(() => getTankTextures(), []);
  const prevMatsRef = useRef(null);

  const materials = useMemo(() => {
    if (prevMatsRef.current) {
      Object.values(prevMatsRef.current).forEach(m => m && typeof m.dispose === 'function' && m.dispose());
    }

    const frameBase = new THREE.Color(frameHex || '#D4581C'); // Exact Orange/Rust frame color matching reference
    const frameDark = frameBase.clone().multiplyScalar(0.70);

    const mats = {
      // 1. Orange/Rust Painted ISO Steel Frame (Corner posts, rails, cross-braces)
      frame: new THREE.MeshPhysicalMaterial({
        color: frameBase,
        metalness: 0.12,
        roughness: 0.46,
        clearcoat: 0.04,
        clearcoatRoughness: 0.70,
      }),

      // 2. Heavy Structural Frame Beams & Saddles (Slightly deeper rust/orange tone)
      frameDark: new THREE.MeshPhysicalMaterial({
        color: frameDark,
        metalness: 0.14,
        roughness: 0.50,
      }),

      // 3. Brushed Stainless Steel Tank Vessel (Grade 316 / Mirror Polish)
      tank: new THREE.MeshPhysicalMaterial({
        color: '#DCE4EC',
        metalness: 0.88,
        roughness: 0.28,
        clearcoat: 0.18,
        clearcoatRoughness: 0.25,
        bumpMap: brushedTex,
        bumpScale: 0.0008,
      }),

      // 4. Tank Reinforcement Circumferential Rings / Collars
      tankRing: new THREE.MeshStandardMaterial({
        color: '#B8C2CC',
        metalness: 0.82,
        roughness: 0.32,
      }),

      // 5. Galvanized Walkway Grating & Safety Handrails
      walkway: new THREE.MeshStandardMaterial({
        color: '#788696',
        metalness: 0.65,
        roughness: 0.45,
      }),

      // 6. Polished Steel Valve & Hardware Components
      hardware: new THREE.MeshStandardMaterial({
        color: '#A0ABB6',
        metalness: 0.86,
        roughness: 0.24,
      }),

      // 7. Corner Castings (Dark metallic cast iron)
      casting: new THREE.MeshStandardMaterial({
        color: frameBase.clone().multiplyScalar(0.40),
        metalness: 0.42,
        roughness: 0.52,
      }),

      // 8. Dark Rubber Gaskets & Cavity Holes
      dark: new THREE.MeshStandardMaterial({
        color: '#12161C',
        metalness: 0.05,
        roughness: 0.85,
      }),

      // 9. Hazard & Safety Decal Accents (Yellow warning triangles)
      hazard: new THREE.MeshStandardMaterial({
        color: '#EAB308',
        metalness: 0.10,
        roughness: 0.50,
      }),

      // 10. Subtle Tank Stencil Decal
      decal: new THREE.MeshStandardMaterial({
        map: decalTex,
        transparent: true,
        alphaTest: 0.02,
        roughness: 0.40,
        metalness: 0.30,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -1,
      }),
    };

    prevMatsRef.current = mats;
    return mats;
  }, [frameHex, brushedTex, decalTex]);

  useEffect(() => {
    return () => {
      if (prevMatsRef.current) {
        Object.values(prevMatsRef.current).forEach(m => m && typeof m.dispose === 'function' && m.dispose());
        prevMatsRef.current = null;
      }
    };
  }, []);

  return materials;
}

// ══════════════════════════════════════════
// 1. RECTANGULAR OPEN SUPPORT FRAME (ISO Structure)
// ══════════════════════════════════════════
function TankSupportFrame({ mats }) {
  const p = C.postW;
  const s = C.castSize;

  return (
    <group>
      {/* ── 4 Vertical Corner Posts ── */}
      {[1, -1].map((xSign, i) =>
        [1, -1].map((zSign, j) => (
          <mesh
            key={`post-${i}-${j}`}
            position={[xSign * (HL - p / 2 - 0.02), 0, zSign * (HW - p / 2 - 0.02)]}
            material={mats.frame}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[p, C.H - s * 1.5, p]} />
          </mesh>
        ))
      )}

      {/* ── 2 Bottom Longitudinal Side Rails ── */}
      {[1, -1].map((zSign, idx) => (
        <mesh
          key={`bot-side-rail-${idx}`}
          position={[0, -HH + C.railH / 2 + 0.015, zSign * (HW - p / 2 - 0.02)]}
          material={mats.frame}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[C.L - s * 2, C.railH, p]} />
        </mesh>
      ))}

      {/* ── 2 Top Longitudinal Side Rails ── */}
      {[1, -1].map((zSign, idx) => (
        <mesh
          key={`top-side-rail-${idx}`}
          position={[0, HH - C.railH / 2 - 0.015, zSign * (HW - p / 2 - 0.02)]}
          material={mats.frame}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[C.L - s * 2, C.railH, p]} />
        </mesh>
      ))}

      {/* ── 2 Bottom Transverse End Rails ── */}
      {[1, -1].map((xSign, idx) => (
        <mesh
          key={`bot-end-rail-${idx}`}
          position={[xSign * (HL - p / 2 - 0.02), -HH + C.railH / 2 + 0.015, 0]}
          material={mats.frame}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[p, C.railH, C.W - s * 2]} />
        </mesh>
      ))}

      {/* ── 2 Top Transverse End Rails ── */}
      {[1, -1].map((xSign, idx) => (
        <mesh
          key={`top-end-rail-${idx}`}
          position={[xSign * (HL - p / 2 - 0.02), HH - C.railH / 2 - 0.015, 0]}
          material={mats.frame}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[p, C.railH, C.W - s * 2]} />
        </mesh>
      ))}

      {/* ── Side Diagonal Truss Bracing (Diagonal struts connecting posts to bottom rails) ── */}
      {[1, -1].map((zSign, idx) => (
        <group key={`side-truss-group-${idx}`}>
          {[1, -1].map((xSign, sIdx) => (
            <group key={`side-strut-${sIdx}`}>
              {/* Lower corner diagonal brace */}
              <mesh
                position={[xSign * (HL - 0.70), -HH + 0.38, zSign * (HW - p / 2 - 0.02)]}
                rotation={[0, 0, xSign * 0.58]}
                material={mats.frame}
                castShadow
              >
                <cylinderGeometry args={[0.034, 0.034, 1.05, 12]} />
              </mesh>
              {/* Upper corner diagonal brace */}
              <mesh
                position={[xSign * (HL - 0.70), HH - 0.38, zSign * (HW - p / 2 - 0.02)]}
                rotation={[0, 0, -xSign * 0.58]}
                material={mats.frame}
                castShadow
              >
                <cylinderGeometry args={[0.034, 0.034, 1.05, 12]} />
              </mesh>
              {/* Full side X-cross brace */}
              <mesh
                position={[xSign * (HL - 0.70), 0, zSign * (HW - p / 2 - 0.02)]}
                rotation={[0, 0, xSign * 0.70]}
                material={mats.frame}
                castShadow
              >
                <cylinderGeometry args={[0.028, 0.028, 1.85, 12]} />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* ── End Face Diagonal Frame Bracing (Framing the circular tank head) ── */}
      {[1, -1].map((xSign, idx) => (
        <group key={`end-brace-${idx}`} position={[xSign * (HL - 0.08), 0, 0]}>
          {[1, -1].map((zSign, sIdx) => (
            <group key={`end-strut-pair-${sIdx}`}>
              {/* Lower corner strut */}
              <mesh
                position={[0, -0.65, zSign * 0.75]}
                rotation={[zSign * 0.72, 0, 0]}
                material={mats.frame}
                castShadow
              >
                <boxGeometry args={[0.045, 0.045, 0.65]} />
              </mesh>
              {/* Upper corner strut */}
              <mesh
                position={[0, 0.65, zSign * 0.75]}
                rotation={[-zSign * 0.72, 0, 0]}
                material={mats.frame}
                castShadow
              >
                <boxGeometry args={[0.045, 0.045, 0.65]} />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* ── 8 ISO 1161 Corner Castings ── */}
      {[1, -1].map((xSign, i) =>
        [1, -1].map((ySign, j) =>
          [1, -1].map((zSign, k) => (
            <group
              key={`casting-${i}-${j}-${k}`}
              position={[
                xSign * (HL - s / 2),
                ySign * (HH - s / 2),
                zSign * (HW - s / 2),
              ]}
            >
              {/* Solid casting block */}
              <mesh material={mats.casting} castShadow receiveShadow>
                <boxGeometry args={[s, s, s]} />
              </mesh>
              {/* Outer aperture hole indications */}
              <mesh position={[0, ySign * (s / 2 + 0.001), 0]} rotation={[-ySign * Math.PI / 2, 0, 0]} material={mats.dark}>
                <planeGeometry args={[0.062, 0.115]} />
              </mesh>
              <mesh position={[xSign * (s / 2 + 0.001), 0, 0]} rotation={[0, xSign * Math.PI / 2, 0]} material={mats.dark}>
                <planeGeometry args={[0.095, 0.052]} />
              </mesh>
              <mesh position={[0, 0, zSign * (s / 2 + 0.001)]} material={mats.dark}>
                <planeGeometry args={[0.095, 0.052]} />
              </mesh>
            </group>
          ))
        )
      )}
    </group>
  );
}

// ══════════════════════════════════════════
// 2. LARGE BRUSHED-METAL CYLINDRICAL TANK VESSEL
// ══════════════════════════════════════════
function CylindricalTankVessel({ mats }) {
  const r = C.tankR;
  const barrelL = C.tankL - 0.55;

  // Mathematically exact elliptical domed end cap (Lathe of revolution)
  const dishHeadGeo = useMemo(() => {
    const points = [];
    const N = 20;
    const depth = 0.28;
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * (Math.PI / 2);
      const px = r * Math.sin(t);
      const py = depth * Math.cos(t);
      points.push(new THREE.Vector2(px, py));
    }
    const geo = new THREE.LatheGeometry(points, 48);
    geo.computeVertexNormals();
    return geo;
  }, [r]);

  useEffect(() => {
    return () => {
      dishHeadGeo.dispose();
    };
  }, [dishHeadGeo]);

  return (
    <group>
      {/* ── Main Horizontal Cylindrical Tank Body ── */}
      <mesh
        rotation={[0, 0, Math.PI / 2]}
        material={mats.tank}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[r, r, barrelL, 56, 1, false]} />
      </mesh>

      {/* ── Front Domed Dish Head (+X End) ── */}
      <group position={[barrelL / 2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <mesh geometry={dishHeadGeo} material={mats.tank} castShadow receiveShadow />
        {/* Outer dish rim weld collar */}
        <mesh position={[0, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.tankRing}>
          <torusGeometry args={[r - 0.01, 0.02, 16, 48]} />
        </mesh>
      </group>

      {/* ── Rear Domed Dish Head (-X End) ── */}
      <group position={[-barrelL / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <mesh geometry={dishHeadGeo} material={mats.tank} castShadow receiveShadow />
        {/* Outer dish rim weld collar */}
        <mesh position={[0, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.tankRing}>
          <torusGeometry args={[r - 0.01, 0.02, 16, 48]} />
        </mesh>
      </group>

      {/* ── Circumferential Stiffening Rings (4 Radial Bands) ── */}
      {[-1.65, -0.55, 0.55, 1.65].map((rx, idx) => (
        <group key={`ring-${idx}`} position={[rx, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} material={mats.tankRing} castShadow>
            <cylinderGeometry args={[r + 0.018, r + 0.018, 0.065, 48]} />
          </mesh>
        </group>
      ))}

      {/* ── Heavy Bottom Tank Saddles / Support Cradles ── */}
      {[-1.65, 1.65].map((sx, idx) => (
        <group key={`saddle-${idx}`} position={[sx, -HH + 0.28, 0]}>
          {/* Transverse heavy cradle beam */}
          <mesh material={mats.frameDark} castShadow receiveShadow>
            <boxGeometry args={[0.26, 0.22, C.W - 0.28]} />
          </mesh>
          {/* Curved saddle flange plate */}
          <mesh position={[0, 0.12, 0]} material={mats.frame} castShadow>
            <boxGeometry args={[0.30, 0.04, C.W - 0.32]} />
          </mesh>
        </group>
      ))}

      {/* ── Subtle HashHarbour Tank Stencil Decal (Right Side +Z) ── */}
      <mesh position={[0, 0.12, r + 0.012]} material={mats.decal}>
        <planeGeometry args={[2.8, 1.35]} />
      </mesh>

      {/* ── Subtle HashHarbour Tank Stencil Decal (Left Side -Z) ── */}
      <mesh position={[0, 0.12, -r - 0.012]} rotation={[0, Math.PI, 0]} material={mats.decal}>
        <planeGeometry args={[2.8, 1.35]} />
      </mesh>
    </group>
  );
}

// ══════════════════════════════════════════
// 3. FRONT END CAP VALVE & MAINTENANCE DETAILS (+X)
// ══════════════════════════════════════════
function FrontEndCapDetails({ mats }) {
  // Front dish apex sits at barrelL / 2 + depth = 2.55 + 0.28 = 2.83m
  const frontX = 2.76;

  return (
    <group position={[frontX, 0, 0]}>
      {/* ── Central / Lower Liquid Discharge Valve Assembly ── */}
      <group position={[0.06, -0.48, 0]}>
        {/* Flanged pipe nozzle */}
        <mesh rotation={[0, 0, Math.PI / 2]} material={mats.hardware} castShadow>
          <cylinderGeometry args={[0.085, 0.095, 0.22, 24]} />
        </mesh>
        {/* Bolt circle flange */}
        <mesh position={[0.11, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.hardware} castShadow>
          <cylinderGeometry args={[0.13, 0.13, 0.035, 24]} />
        </mesh>
        {/* Butterfly valve lever handle */}
        <mesh position={[0.06, 0.12, 0.02]} rotation={[0.4, 0, 0.2]} material={mats.hazard} castShadow>
          <boxGeometry args={[0.022, 0.26, 0.035]} />
        </mesh>
        {/* Outlet end cap with retention lug */}
        <mesh position={[0.135, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.dark}>
          <cylinderGeometry args={[0.075, 0.075, 0.03, 20]} />
        </mesh>
      </group>

      {/* ── Front Inspection / Maintenance Manway Cover ── */}
      <group position={[0.03, 0.38, -0.05]}>
        {/* Raised manhole collar */}
        <mesh rotation={[0, 0, Math.PI / 2]} material={mats.hardware} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.08, 32]} />
        </mesh>
        {/* Domed bolted cover plate */}
        <mesh position={[0.042, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.tankRing} castShadow>
          <cylinderGeometry args={[0.24, 0.24, 0.025, 32]} />
        </mesh>
        {/* Swing hinge bracket */}
        <mesh position={[0.042, 0.22, 0]} material={mats.hardware} castShadow>
          <boxGeometry args={[0.04, 0.08, 0.06]} />
        </mesh>
        {/* 6 Peripheral Lug Bolts */}
        {[0, 60, 120, 180, 240, 300].map((deg, idx) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <mesh
              key={`manway-bolt-${idx}`}
              position={[0.056, Math.cos(rad) * 0.19, Math.sin(rad) * 0.19]}
              rotation={[0, 0, Math.PI / 2]}
              material={mats.hardware}
            >
              <cylinderGeometry args={[0.016, 0.016, 0.02, 6]} />
            </mesh>
          );
        })}
      </group>

      {/* ── Pressure Relief Safety Valve (Upper Right Quadrant) ── */}
      <group position={[0.04, 0.62, 0.42]}>
        {/* Valve neck */}
        <mesh rotation={[0, 0, Math.PI / 2]} material={mats.hardware} castShadow>
          <cylinderGeometry args={[0.045, 0.045, 0.12, 16]} />
        </mesh>
        {/* Spring casing dome */}
        <mesh position={[0.07, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.hardware} castShadow>
          <cylinderGeometry args={[0.065, 0.065, 0.09, 16]} />
        </mesh>
        {/* Rain cap / exhaust shroud */}
        <mesh position={[0.115, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.dark}>
          <cylinderGeometry args={[0.075, 0.055, 0.04, 16]} />
        </mesh>
      </group>

      {/* ── Stainless Steel Manifest Document Tube ── */}
      <mesh position={[0.07, -0.15, 0.45]} rotation={[0, 0, 0]} material={mats.hardware} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.45, 16]} />
      </mesh>

      {/* ── Yellow Hazard / IMDG Diamond Decal ── */}
      <group position={[0.15, -0.12, -0.42]} rotation={[0, 0, Math.PI / 4]}>
        <mesh material={mats.hazard}>
          <planeGeometry args={[0.18, 0.18]} />
        </mesh>
      </group>
    </group>
  );
}

// ══════════════════════════════════════════
// 4. TOP WALKWAY PLATFORM & ACCESS LADDER
// ══════════════════════════════════════════
function TopWalkwayAndLadder({ mats }) {
  const walkY = C.tankR + 0.04; // 1.14m
  const walkW = 0.52;
  const walkL = 4.4;

  return (
    <group>
      {/* ── Top Grated Walkway Spine ── */}
      <group position={[0, walkY, 0]}>
        {/* Walkway main grating sheet */}
        <mesh material={mats.walkway} castShadow receiveShadow>
          <boxGeometry args={[walkL, 0.024, walkW]} />
        </mesh>
        {/* Longitudinal support stringers */}
        {[-walkW / 2 + 0.03, walkW / 2 - 0.03].map((zPos, idx) => (
          <mesh key={`walk-stringer-${idx}`} position={[0, -0.025, zPos]} material={mats.walkway} castShadow>
            <boxGeometry args={[walkL, 0.035, 0.02]} />
          </mesh>
        ))}
      </group>

      {/* ── Top Spillbox / Manhole Coaming ── */}
      <group position={[0.1, walkY + 0.05, 0]}>
        <mesh material={mats.hardware} castShadow>
          <cylinderGeometry args={[0.32, 0.32, 0.08, 32]} />
        </mesh>
        <mesh position={[0, 0.045, 0]} material={mats.tankRing} castShadow>
          <cylinderGeometry args={[0.34, 0.34, 0.025, 32]} />
        </mesh>
      </group>

      {/* ── Top Safety Handrails (Collapsible in transit, flush with top rail) ── */}
      {[-walkW / 2 - 0.02, walkW / 2 + 0.02].map((railZ, sideIdx) => (
        <group key={`handrail-${sideIdx}`}>
          {/* Top rail bar */}
          <mesh position={[0, walkY + 0.13, railZ]} rotation={[0, 0, Math.PI / 2]} material={mats.hardware} castShadow>
            <cylinderGeometry args={[0.015, 0.015, walkL, 12]} />
          </mesh>
          {/* Intermediate knee rail bar */}
          <mesh position={[0, walkY + 0.065, railZ]} rotation={[0, 0, Math.PI / 2]} material={mats.hardware} castShadow>
            <cylinderGeometry args={[0.012, 0.012, walkL, 12]} />
          </mesh>
          {/* Vertical handrail stanchion posts */}
          {[-1.8, -0.9, 0, 0.9, 1.8].map((postX, pIdx) => (
            <mesh key={`stanchion-${pIdx}`} position={[postX, walkY + 0.065, railZ]} material={mats.hardware} castShadow>
              <cylinderGeometry args={[0.014, 0.014, 0.13, 10]} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ── Front Access Ladder (Right-front frame post at +X, +Z) ── */}
      <group position={[HL - C.postW / 2 - 0.02, 0, HW - 0.18]}>
        {/* Vertical stringer bars */}
        {[-0.14, 0.14].map((zStr, sIdx) => (
          <mesh key={`ladder-str-${sIdx}`} position={[0.08, 0, zStr]} material={mats.hardware} castShadow>
            <boxGeometry args={[0.025, C.H - 0.35, 0.025]} />
          </mesh>
        ))}
        {/* 7 Horizontal ladder rungs */}
        {[-0.95, -0.65, -0.35, -0.05, 0.25, 0.55, 0.85].map((rungY, rIdx) => (
          <mesh key={`ladder-rung-${rIdx}`} position={[0.08, rungY, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.hardware} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.28, 10]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ══════════════════════════════════════════
// MAIN EXPORT — TankContainerModel
// ══════════════════════════════════════════
export default function TankContainerModel({ frameColor = '#D4581C' }) {
  const mats = useTankMats(frameColor);

  return (
    <group>
      {/* LAYER 1: Rectangular Open Support Frame (Orange/Rust) */}
      <TankSupportFrame mats={mats} />

      {/* LAYER 2: Cylindrical Stainless Steel Tank Vessel */}
      <CylindricalTankVessel mats={mats} />

      {/* LAYER 3: Front End Cap Valve & Maintenance Details (+X) */}
      <FrontEndCapDetails mats={mats} />

      {/* LAYER 4: Top Walkway Platform & Front Access Ladder */}
      <TopWalkwayAndLadder mats={mats} />
    </group>
  );
}
