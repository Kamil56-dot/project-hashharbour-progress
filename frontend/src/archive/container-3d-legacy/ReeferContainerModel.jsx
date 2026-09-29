import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';

// ─── ISO 20ft Refrigerated Container Dimensions (ISO 1496/2) ───
const C = {
  L: 6.058,
  W: 2.438,
  H: 2.591,
  castSize: 0.178,
  postW: 0.15,
  railH: 0.10,
  frameH: 0.14,
  corrDepth: 0.038, // Slightly shallower corrugation profile typical of insulated reefers
  corrCount: 20,
};

const HL = C.L / 2; // 3.029m
const HW = C.W / 2; // 1.219m
const HH = C.H / 2; // 1.2955m

// ─── Authentic Trapezoidal Corrugation Profile ───
function corrZ(t, d) {
  const f = ((t % 1) + 1) % 1;
  if (f < 0.22) return 0;
  if (f < 0.32) return (d * (f - 0.22)) / 0.10;
  if (f < 0.72) return d;
  if (f < 0.82) return (d * (0.82 - f)) / 0.10;
  return 0;
}

function makeCorrugatedGeo(w, h, n, d) {
  const sx = Math.round(n * 16);
  const geo = new THREE.PlaneGeometry(w, h, sx, 1);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const t = (pos.getX(i) / w + 0.5) * n;
    pos.setZ(i, corrZ(t, d));
  }
  geo.computeVertexNormals();
  return geo;
}

// ─── Procedural Reefer Surface Textures (White Satin PBR) ───
let _cachedReeferTextures = null;
function getReeferTextures() {
  if (typeof document === 'undefined') return { bumpTex: null, decalTex: null, displayTex: null };
  if (!_cachedReeferTextures) {
    // 1. Micro-stipple bump texture (512 x 512)
    const bumpCanvas = document.createElement('canvas');
    bumpCanvas.width = 512;
    bumpCanvas.height = 512;
    const bCtx = bumpCanvas.getContext('2d');
    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, 512, 512);

    const imgData = bCtx.getImageData(0, 0, 512, 512);
    const data = imgData.data;
    for (let y = 0; y < 512; y++) {
      for (let x = 0; x < 512; x++) {
        const idx = (y * 512 + x) * 4;
        const n1 = Math.sin(x * 0.18 + y * 0.12) * Math.cos(y * 0.18 - x * 0.09) * 6;
        const n2 = (Math.random() - 0.5) * 8;
        const val = Math.min(255, Math.max(0, 128 + n1 + n2));
        data[idx] = val;
        data[idx + 1] = val;
        data[idx + 2] = val;
      }
    }
    bCtx.putImageData(imgData, 0, 0);

    const bumpTex = new THREE.CanvasTexture(bumpCanvas);
    bumpTex.wrapS = THREE.RepeatWrapping;
    bumpTex.wrapT = THREE.RepeatWrapping;
    bumpTex.repeat.set(6, 3);

    // 2. High-Res HashHarbour Reefer Decal Canvas (1024 x 512)
    const decalCanvas = document.createElement('canvas');
    decalCanvas.width = 1024;
    decalCanvas.height = 512;
    const dCtx = decalCanvas.getContext('2d');
    dCtx.clearRect(0, 0, 1024, 512);

    // Deep Marine Slate Branding for high contrast on white body
    dCtx.fillStyle = 'rgba(15, 23, 42, 0.90)';
    dCtx.textAlign = 'center';

    // Anchor emblem outline
    const cx = 512, cy = 180;
    dCtx.strokeStyle = 'rgba(15, 23, 42, 0.88)';
    dCtx.lineWidth = 5;
    dCtx.beginPath();
    dCtx.arc(cx, cy - 40, 22, 0, Math.PI * 2);
    dCtx.stroke();
    dCtx.strokeRect(cx - 3, cy - 20, 6, 80);
    dCtx.strokeRect(cx - 35, cy - 5, 70, 6);
    dCtx.beginPath();
    dCtx.arc(cx, cy + 25, 45, 0.15 * Math.PI, 0.85 * Math.PI, false);
    dCtx.stroke();

    // Brand Wordmark
    dCtx.font = '900 50px "Impact", "Bebas Neue", sans-serif';
    dCtx.letterSpacing = '6px';
    dCtx.fillText('#HASHHARBOUR', cx, cy + 115);

    // Sub-title
    dCtx.font = 'bold 18px monospace';
    dCtx.letterSpacing = '3px';
    dCtx.fillStyle = 'rgba(30, 41, 59, 0.85)';
    dCtx.fillText('COLD-CHAIN REEFER LOGISTICS · 28.3m³', cx, cy + 155);
    dCtx.fillText('HHXU  482109  7  //  22R1  ·  -30°C / +30°C', cx, cy + 185);

    // Spec Box on right
    dCtx.strokeStyle = 'rgba(51, 65, 85, 0.65)';
    dCtx.lineWidth = 2;
    dCtx.strokeRect(800, 120, 180, 110);
    dCtx.font = '11px monospace';
    dCtx.textAlign = 'left';
    dCtx.fillStyle = 'rgba(51, 65, 85, 0.85)';
    dCtx.fillText('MAX GROSS: 30,480 KG', 810, 145);
    dCtx.fillText('TARE WT:    4,780 KG', 810, 168);
    dCtx.fillText('MAX CARGO: 25,700 KG', 810, 191);
    dCtx.fillText('SET POINT:  -18.0 °C', 810, 214);

    const decalTex = new THREE.CanvasTexture(decalCanvas);
    decalTex.minFilter = THREE.LinearMipmapLinearFilter;
    decalTex.magFilter = THREE.LinearFilter;

    // 3. Digital LCD Control Display Texture (256 x 128)
    const dispCanvas = document.createElement('canvas');
    dispCanvas.width = 256;
    dispCanvas.height = 128;
    const dpCtx = dispCanvas.getContext('2d');
    dpCtx.fillStyle = '#06131F';
    dpCtx.fillRect(0, 0, 256, 128);

    // Glass reflection & inner bezel
    dpCtx.strokeStyle = 'rgba(0, 229, 255, 0.35)';
    dpCtx.lineWidth = 3;
    dpCtx.strokeRect(4, 4, 248, 120);

    // Digital LED Readout in bright neon cyan/green
    dpCtx.font = 'bold 38px monospace';
    dpCtx.fillStyle = '#00F0FF';
    dpCtx.shadowColor = '#00E5FF';
    dpCtx.shadowBlur = 8;
    dpCtx.fillText('-18.0°C', 24, 52);
    dpCtx.shadowBlur = 0;

    dpCtx.font = 'bold 12px monospace';
    dpCtx.fillStyle = '#10B981';
    dpCtx.fillText('● COMPRESSOR: ON', 24, 82);
    dpCtx.fillStyle = '#F59E0B';
    dpCtx.fillText('● SUPPLY AIR: -18.2°C', 24, 102);

    const displayTex = new THREE.CanvasTexture(dispCanvas);

    _cachedReeferTextures = { bumpTex, decalTex, displayTex };
  }
  return _cachedReeferTextures;
}

// ─── PBR Materials for Reefer Container ───
function useReeferMats(bodyHex) {
  const { bumpTex, decalTex, displayTex } = useMemo(() => getReeferTextures(), []);
  const prevMatsRef = useRef(null);

  const materials = useMemo(() => {
    if (prevMatsRef.current) {
      Object.values(prevMatsRef.current).forEach(
        (m) => m && typeof m.dispose === 'function' && m.dispose()
      );
    }

    const baseColor = new THREE.Color(bodyHex || '#F1F5F9'); // Clean Insulated Reefer White
    const frameColor = baseColor.clone().multiplyScalar(0.92); // Slightly deeper structural framing white/gray
    const darkMachinery = new THREE.Color('#1B3E64'); // Authentic Carrier/Thermo King ocean blue machinery enclosure

    const mats = {
      // 1. Insulated White Corrugated Shell / Walls
      wall: new THREE.MeshPhysicalMaterial({
        color: baseColor,
        metalness: 0.08,
        roughness: 0.38,
        clearcoat: 0.08,
        clearcoatRoughness: 0.55,
        bumpMap: bumpTex,
        bumpScale: 0.0008,
        side: THREE.FrontSide,
      }),

      // 2. Watertight Inner Core Box
      shell: new THREE.MeshPhysicalMaterial({
        color: baseColor,
        metalness: 0.08,
        roughness: 0.42,
      }),

      // 3. Structural Frame Rails & Corner Posts
      frame: new THREE.MeshPhysicalMaterial({
        color: frameColor,
        metalness: 0.12,
        roughness: 0.46,
        clearcoat: 0.05,
      }),

      // 4. Corner Castings (Industrial Steel)
      casting: new THREE.MeshStandardMaterial({
        color: '#A0ABB8',
        metalness: 0.55,
        roughness: 0.40,
      }),

      // 5. Roof Panel (Insulated white with subtle ribs)
      roof: new THREE.MeshPhysicalMaterial({
        color: baseColor,
        metalness: 0.08,
        roughness: 0.44,
      }),

      // 6. Machinery Recessed Enclosure (Carrier/Thermo King dark charcoal)
      machineryBody: new THREE.MeshStandardMaterial({
        color: darkMachinery,
        metalness: 0.35,
        roughness: 0.55,
      }),

      // 7. Brushed Aluminum / Stainless Steel Condenser Grills & Flanges
      aluminum: new THREE.MeshStandardMaterial({
        color: '#D4DCDE',
        metalness: 0.85,
        roughness: 0.26,
      }),

      // 8. Copper & Brass Refrigerant Tubing
      copper: new THREE.MeshStandardMaterial({
        color: '#C87D55',
        metalness: 0.88,
        roughness: 0.28,
      }),

      // 9. Black Heavy-Duty Power Cable & Rubber Gaskets
      cable: new THREE.MeshStandardMaterial({
        color: '#0E1116',
        metalness: 0.05,
        roughness: 0.88,
      }),

      // 10. Hazard / Warning Yellow Triangle Accents
      hazard: new THREE.MeshStandardMaterial({
        color: '#EAB308',
        metalness: 0.12,
        roughness: 0.45,
      }),

      // 11. Dark Aperture Holes & Interior Depth
      dark: new THREE.MeshStandardMaterial({
        color: '#080C12',
        metalness: 0.05,
        roughness: 0.90,
      }),

      // 12. Micro-Processor Digital LCD Display
      display: new THREE.MeshBasicMaterial({
        map: displayTex,
      }),

      // 13. Subtle HashHarbour Branding Decal
      decal: new THREE.MeshStandardMaterial({
        map: decalTex,
        transparent: true,
        alphaTest: 0.02,
        roughness: 0.40,
        metalness: 0.20,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -1,
      }),
    };

    prevMatsRef.current = mats;
    return mats;
  }, [bodyHex, bumpTex, decalTex, displayTex]);

  useEffect(() => {
    return () => {
      if (prevMatsRef.current) {
        Object.values(prevMatsRef.current).forEach(
          (m) => m && typeof m.dispose === 'function' && m.dispose()
        );
        prevMatsRef.current = null;
      }
    };
  }, []);

  return materials;
}

// ══════════════════════════════════════════
// 1. REFRIGERATED CONTAINER BODY & CORRUGATION
// ══════════════════════════════════════════
function ReeferBody({ mats }) {
  const p = C.postW;
  const r = C.railH;

  const sideCorrugationGeo = useMemo(() => {
    return makeCorrugatedGeo(C.L - p * 2, C.H - r * 2, C.corrCount, C.corrDepth);
  }, [p, r]);

  useEffect(() => {
    return () => sideCorrugationGeo.dispose();
  }, [sideCorrugationGeo]);

  return (
    <group>
      {/* ── Watertight Core Shell ── */}
      <mesh material={mats.shell} castShadow receiveShadow>
        <boxGeometry args={[C.L - 0.04, C.H - 0.04, C.W - 0.04]} />
      </mesh>

      {/* ── Right Corrugated Side (+Z Face, facing camera) ── */}
      <mesh
        position={[0, 0, HW + 0.002]}
        geometry={sideCorrugationGeo}
        material={mats.wall}
        castShadow
        receiveShadow
      />

      {/* ── Left Corrugated Side (-Z Face) ── */}
      <mesh
        position={[0, 0, -HW - 0.002]}
        rotation={[0, Math.PI, 0]}
        geometry={sideCorrugationGeo}
        material={mats.wall}
        castShadow
      />

      {/* ── Rear Insulated End Wall (-X End with Door Hardware) ── */}
      <group position={[-HL - 0.002, 0, 0]}>
        {/* Door panel background */}
        <mesh rotation={[0, -Math.PI / 2, 0]} material={mats.wall} castShadow>
          <planeGeometry args={[C.W - p * 2, C.H - r * 2]} />
        </mesh>
        {/* Dual door vertical locking bars */}
        {[-0.55, -0.18, 0.18, 0.55].map((zPos, idx) => (
          <mesh key={`rear-bar-${idx}`} position={[-0.015, 0, zPos]} material={mats.aluminum} castShadow>
            <cylinderGeometry args={[0.014, 0.014, C.H - r * 2.2, 12]} />
          </mesh>
        ))}
        {/* Center door seal rubber gasket */}
        <mesh position={[-0.01, 0, 0]} material={mats.dark}>
          <boxGeometry args={[0.015, C.H - r * 2, 0.03]} />
        </mesh>
      </group>

      {/* ── Roof with Transverse Stiffening Ribs ── */}
      <mesh position={[0, HH - 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.roof} castShadow>
        <planeGeometry args={[C.L - p * 2, C.W - 0.1]} />
      </mesh>
      {[-2.2, -1.4, -0.6, 0.2, 1.0, 1.8].map((rx, idx) => (
        <mesh key={`roof-rib-${idx}`} position={[rx, HH + 0.005, 0]} material={mats.frame}>
          <boxGeometry args={[0.04, 0.015, C.W - 0.2]} />
        </mesh>
      ))}

      {/* ── Bottom Floor Plate ── */}
      <mesh position={[0, -HH + 0.02, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.frame}>
        <planeGeometry args={[C.L - 0.1, C.W - 0.1]} />
      </mesh>

      {/* ── Authentic Yellow Warning Hazard Triangle on Corrugated Side (matching reference) ── */}
      <group position={[1.35, 0.10, HW + C.corrDepth + 0.005]} rotation={[0, 0, Math.PI / 4]}>
        <mesh material={mats.hazard}>
          <planeGeometry args={[0.16, 0.16]} />
        </mesh>
      </group>
    </group>
  );
}

// ══════════════════════════════════════════
// 2. STRUCTURAL FRAME & CORNER CASTINGS
// ══════════════════════════════════════════
function ReeferFrame({ mats }) {
  const p = C.postW;
  const s = C.castSize;
  const r = C.railH;

  return (
    <group>
      {/* ── 4 Vertical Corner Posts ── */}
      {[1, -1].map((xSign, i) =>
        [1, -1].map((zSign, j) => (
          <mesh
            key={`post-${i}-${j}`}
            position={[xSign * (HL - p / 2), 0, zSign * (HW - p / 2)]}
            material={mats.frame}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[p, C.H - s * 1.6, p]} />
          </mesh>
        ))
      )}

      {/* ── Longitudinal Rails (Top and Bottom on +Z and -Z) ── */}
      {[1, -1].map((zSign, idx) => (
        <group key={`long-rails-${idx}`}>
          {/* Top rail */}
          <mesh
            position={[0, HH - r / 2, zSign * (HW - p / 2)]}
            material={mats.frame}
            castShadow
          >
            <boxGeometry args={[C.L - s * 2, r, p]} />
          </mesh>
          {/* Bottom rail */}
          <mesh
            position={[0, -HH + r / 2, zSign * (HW - p / 2)]}
            material={mats.frame}
            castShadow
          >
            <boxGeometry args={[C.L - s * 2, r, p]} />
          </mesh>
        </group>
      ))}

      {/* ── Transverse End Rails (Top and Bottom on +X and -X) ── */}
      {[1, -1].map((xSign, idx) => (
        <group key={`trans-rails-${idx}`}>
          {/* Top transverse rail */}
          <mesh
            position={[xSign * (HL - p / 2), HH - r / 2, 0]}
            material={mats.frame}
            castShadow
          >
            <boxGeometry args={[p, r, C.W - s * 2]} />
          </mesh>
          {/* Bottom transverse rail */}
          <mesh
            position={[xSign * (HL - p / 2), -HH + r / 2, 0]}
            material={mats.frame}
            castShadow
          >
            <boxGeometry args={[p, r, C.W - s * 2]} />
          </mesh>
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
              <mesh material={mats.casting} castShadow receiveShadow>
                <boxGeometry args={[s, s, s]} />
              </mesh>
              {/* Outer aperture cutouts */}
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
// 3. FRONT REFRIGERATION MACHINERY UNIT (+HL Face)
// ══════════════════════════════════════════
function RefrigerationUnit({ mats }) {
  const frontX = HL; // 3.029m

  return (
    <group position={[frontX, 0, 0]}>
      {/* ── Recessed Machinery Compartment Bulkhead (Lower Recess: Ocean Blue) ── */}
      <mesh position={[-0.12, -0.22, 0]} rotation={[0, Math.PI / 2, 0]} material={mats.machineryBody} castShadow receiveShadow>
        <boxGeometry args={[C.W - 0.38, 1.45, 0.22]} />
      </mesh>

      {/* ── Upper Insulated White Bulkhead Plate (matching reference photo) ── */}
      <mesh position={[-0.01, 0.58, 0]} rotation={[0, Math.PI / 2, 0]} material={mats.shell} castShadow receiveShadow>
        <boxGeometry args={[C.W - 0.40, 0.95, 0.08]} />
      </mesh>

      {/* Circular Inspection Port (upper left, matching reference) */}
      <group position={[0.04, 0.65, -0.32]} rotation={[0, Math.PI / 2, 0]}>
        <mesh material={mats.aluminum}>
          <ringGeometry args={[0.07, 0.12, 24]} />
        </mesh>
        <mesh position={[0, 0, -0.005]} material={mats.dark}>
          <circleGeometry args={[0.07, 24]} />
        </mesh>
        <mesh position={[0, 0, 0.01]} material={mats.aluminum}>
          <boxGeometry args={[0.11, 0.015, 0.02]} />
        </mesh>
      </group>

      {/* Rectangular Bolted Access Plate (upper right, matching reference) */}
      <group position={[0.04, 0.65, 0.32]} rotation={[0, Math.PI / 2, 0]}>
        <mesh material={mats.frame} castShadow>
          <planeGeometry args={[0.38, 0.28]} />
        </mesh>
        <mesh position={[0, 0, 0.005]} material={mats.aluminum}>
          <boxGeometry args={[0.40, 0.30, 0.01]} />
        </mesh>
      </group>

      {/* ── Lower Diagonal Protective Truss / Cross-Member (White frame, matching reference) ── */}
      <group position={[0.04, -0.62, 0]}>
        <mesh position={[0, 0.12, 0]} material={mats.frame} castShadow>
          <boxGeometry args={[0.035, 0.04, C.W - 0.46]} />
        </mesh>
        <mesh position={[0, -0.06, -0.34]} rotation={[0.46, 0, 0]} material={mats.frame} castShadow>
          <boxGeometry args={[0.035, 0.035, 0.44]} />
        </mesh>
        <mesh position={[0, -0.06, 0.34]} rotation={[-0.46, 0, 0]} material={mats.frame} castShadow>
          <boxGeometry args={[0.035, 0.035, 0.44]} />
        </mesh>
      </group>

      {/* ── Perimeter Mounting Flange & Frame Coaming ── */}
      <group position={[0.01, 0, 0]}>
        {/* Top/bottom coaming strips */}
        {[0.98, -0.98].map((yPos, idx) => (
          <mesh key={`flange-h-${idx}`} position={[0, yPos, 0]} material={mats.aluminum} castShadow>
            <boxGeometry args={[0.04, 0.05, C.W - 0.38]} />
          </mesh>
        ))}
        {/* Left/right coaming strips */}
        {[-(HW - 0.22), HW - 0.22].map((zPos, idx) => (
          <mesh key={`flange-v-${idx}`} position={[0, 0, zPos]} material={mats.aluminum} castShadow>
            <boxGeometry args={[0.04, 2.0, 0.05]} />
          </mesh>
        ))}
      </group>

      {/* ══════════════════════════════════════════ */}
      {/* UPPER SECTION: CONDENSER FANS & AIR VENTS  */}
      {/* ══════════════════════════════════════════ */}
      <group position={[0.02, 0.42, 0]}>
        {/* Dual Circular Condenser Fan Shrouds */}
        {[-0.46, 0.46].map((zFan, idx) => (
          <group key={`fan-shroud-${idx}`} position={[0, 0.16, zFan]}>
            {/* Dark inner plenum cavity */}
            <mesh rotation={[0, 0, Math.PI / 2]} material={mats.dark}>
              <cylinderGeometry args={[0.34, 0.34, 0.08, 32]} />
            </mesh>
            {/* Outer flared aluminum shroud collar */}
            <mesh position={[0.02, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.aluminum} castShadow>
              <cylinderGeometry args={[0.36, 0.38, 0.05, 32]} />
            </mesh>
            {/* Radial finger protection grill bars */}
            {[0, 45, 90, 135].map((deg, bIdx) => (
              <mesh
                key={`grill-bar-${bIdx}`}
                position={[0.046, 0, 0]}
                rotation={[deg * (Math.PI / 180), 0, 0]}
                material={mats.aluminum}
              >
                <boxGeometry args={[0.012, 0.68, 0.012]} />
              </mesh>
            ))}
            {/* Circular concentric guard ring */}
            <mesh position={[0.048, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={mats.aluminum}>
              <torusGeometry args={[0.22, 0.01, 12, 32]} />
            </mesh>
            {/* 4-Blade Fan Impeller visible inside */}
            <mesh position={[-0.015, 0, 0]} rotation={[0.4, 0, 0]} material={mats.dark}>
              <boxGeometry args={[0.01, 0.58, 0.06]} />
            </mesh>
            <mesh position={[-0.015, 0, 0]} rotation={[0.4, 0, Math.PI / 2]} material={mats.dark}>
              <boxGeometry args={[0.01, 0.58, 0.06]} />
            </mesh>
            {/* Fan motor hub */}
            <mesh position={[0.02, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.aluminum}>
              <cylinderGeometry args={[0.075, 0.075, 0.05, 20]} />
            </mesh>
          </group>
        ))}

        {/* Horizontal Condenser Intake Louver Slats (Lower Part of Upper Section) */}
        {[-0.20, -0.26, -0.32, -0.38].map((louverY, lIdx) => (
          <mesh
            key={`louver-${lIdx}`}
            position={[0.015, louverY, 0]}
            rotation={[0.35, 0, 0]}
            material={mats.aluminum}
            castShadow
          >
            <boxGeometry args={[0.025, 0.04, 1.48]} />
          </mesh>
        ))}
      </group>

      {/* ══════════════════════════════════════════ */}
      {/* MIDDLE SECTION: DIGITAL CONTROL PANEL      */}
      {/* ══════════════════════════════════════════ */}
      <group position={[0.04, -0.15, 0.44]}>
        {/* Weatherproof Control Box Housing */}
        <mesh material={mats.aluminum} castShadow>
          <boxGeometry args={[0.07, 0.36, 0.54]} />
        </mesh>
        {/* Hinged clear cover / bezel frame */}
        <mesh position={[0.036, 0, 0]} material={mats.machineryBody} castShadow>
          <boxGeometry args={[0.012, 0.34, 0.50]} />
        </mesh>
        {/* Active Digital LCD Display Screen with -18.0°C Readout */}
        <mesh position={[0.043, 0.04, 0]} rotation={[0, Math.PI / 2, 0]} material={mats.display}>
          <planeGeometry args={[0.38, 0.18]} />
        </mesh>
        {/* Membrane control buttons row */}
        {[-0.14, -0.05, 0.05, 0.14].map((btnZ, bIdx) => (
          <mesh key={`ctrl-btn-${bIdx}`} position={[0.043, -0.10, btnZ]} material={mats.hazard}>
            <boxGeometry args={[0.008, 0.035, 0.055]} />
          </mesh>
        ))}
      </group>

      {/* ══════════════════════════════════════════ */}
      {/* LOWER SECTION: COMPRESSOR & POWER CABLE    */}
      {/* ══════════════════════════════════════════ */}
      <group position={[0.02, -0.62, 0]}>
        {/* Heavy semi-hermetic compressor cylinder */}
        <group position={[0, 0.05, -0.38]}>
          <mesh rotation={[0, 0, Math.PI / 2]} material={mats.machineryBody} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.38, 24]} />
          </mesh>
          <mesh position={[0.19, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.aluminum}>
            <cylinderGeometry args={[0.12, 0.12, 0.04, 20]} />
          </mesh>
          {/* Suction & discharge shut-off valves */}
          <mesh position={[0.06, 0.18, 0.05]} material={mats.copper}>
            <boxGeometry args={[0.06, 0.08, 0.06]} />
          </mesh>
        </group>

        {/* Horizontal Liquid Receiver Tank */}
        <group position={[0, -0.22, 0.05]}>
          <mesh rotation={[0, 0, Math.PI / 2]} material={mats.machineryBody} castShadow>
            <cylinderGeometry args={[0.11, 0.11, 0.62, 24]} />
          </mesh>
          {/* Hemispherical tank ends */}
          {[-0.31, 0.31].map((capX, cIdx) => (
            <mesh key={`tank-cap-${cIdx}`} position={[capX, 0, 0]} rotation={[0, 0, cIdx === 0 ? -Math.PI / 2 : Math.PI / 2]} material={mats.machineryBody}>
              <sphereGeometry args={[0.11, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            </mesh>
          ))}
          {/* Liquid level sight glass */}
          <mesh position={[0.115, 0, 0]} material={mats.copper}>
            <cylinderGeometry args={[0.025, 0.025, 0.03, 12]} />
          </mesh>
        </group>

        {/* Copper Refrigeration Piping Runs */}
        <group position={[0.06, -0.05, -0.15]}>
          {/* Vertical suction line */}
          <mesh position={[0, 0.12, 0]} material={mats.copper}>
            <cylinderGeometry args={[0.016, 0.016, 0.28, 12]} />
          </mesh>
          {/* Filter drier canister */}
          <mesh position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]} material={mats.aluminum}>
            <cylinderGeometry args={[0.038, 0.038, 0.14, 16]} />
          </mesh>
        </group>

        {/* ── Electrical Power Cable Stowage Pocket & Coiled Cable ── */}
        <group position={[0.04, -0.05, 0.52]}>
          {/* Cable bin recess */}
          <mesh material={mats.machineryBody} castShadow>
            <boxGeometry args={[0.08, 0.38, 0.34]} />
          </mesh>
          {/* Heavy-Duty 460V 3-Phase Coiled Black Cable */}
          {[0.08, 0.01, -0.06].map((coilY, cIdx) => (
            <mesh
              key={`cable-coil-${cIdx}`}
              position={[0.04, coilY, 0]}
              rotation={[0, 0, Math.PI / 2]}
              material={mats.cable}
              castShadow
            >
              <torusGeometry args={[0.11, 0.022, 12, 24]} />
            </mesh>
          ))}
          {/* Yellow 460V high-voltage power plug head */}
          <mesh position={[0.06, -0.14, 0.04]} rotation={[0.2, 0.3, 0]} material={mats.hazard} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.12, 16]} />
          </mesh>
        </group>

        {/* ── Yellow High Voltage & IMDG Warning Diamond ── */}
        <group position={[0.06, 0.18, 0.02]} rotation={[0, 0, Math.PI / 4]}>
          <mesh material={mats.hazard}>
            <planeGeometry args={[0.15, 0.15]} />
          </mesh>
        </group>
        {/* Eco Refrigerant Label */}
        <mesh position={[0.06, 0.18, -0.32]} material={mats.aluminum}>
          <planeGeometry args={[0.18, 0.08]} />
        </mesh>
      </group>
    </group>
  );
}

// ══════════════════════════════════════════
// MAIN EXPORT — ReeferContainerModel
// ══════════════════════════════════════════
export default function ReeferContainerModel({ bodyColor = '#F1F5F9' }) {
  const mats = useReeferMats(bodyColor);

  return (
    <group>
      {/* LAYER 1: Insulated Reefer Body (White/Light-Gray Corrugated Steel) */}
      <ReeferBody mats={mats} />

      {/* LAYER 2: Structural ISO Frame & 8 Corner Castings */}
      <ReeferFrame mats={mats} />

      {/* LAYER 3: Front Refrigeration Machinery Unit (Compressor, Fans, Display) */}
      <RefrigerationUnit mats={mats} />
    </group>
  );
}
