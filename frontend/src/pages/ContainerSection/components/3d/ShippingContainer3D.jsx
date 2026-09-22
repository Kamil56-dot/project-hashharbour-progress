import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Center, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import ContainerModel from './ContainerModel';

// ─── Loading Overlay with Thin Progress Ring & Smooth Fade-Out ───
function ShowcaseLoadingOverlay() {
  const { progress, active } = useProgress();
  const [shouldRender, setShouldRender] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // If cached or finished loading
    if (!active || progress >= 100) {
      setFadeOut(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 500); // 500ms luxury fade-out duration
      return () => clearTimeout(timer);
    } else {
      setShouldRender(true);
      setFadeOut(false);
    }
  }, [active, progress]);

  if (!shouldRender) return null;

  return (
    <div
      className={`absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#060B14]/90 backdrop-blur-md transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Thin cyan circular progress ring */}
      <div className="relative w-12 h-12 flex items-center justify-center mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-[#00E5FF]/15" />
        <div className="absolute inset-0 rounded-full border-2 border-t-[#00E5FF] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] animate-pulse" />
      </div>

      <p className="text-[13px] font-medium text-white/85 tracking-wide mb-2">
        Preparing Container Showcase...
      </p>
      <div className="flex items-center gap-2.5">
        <div className="w-24 h-1 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-[#00E5FF] transition-all duration-200"
            style={{ width: `${Math.max(10, progress)}%` }}
          />
        </div>
        <span className="text-[10px] font-mono text-[#00E5FF]/80">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}

// ─── Loading fallback inside Canvas ───
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#00E5FF" wireframe />
    </mesh>
  );
}

// ─── Subtle Industrial Studio Blueprint Floor (Non-glossy, soft grid with radial edge fade) ───
function StudioBlueprintFloor() {
  const gridTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, 256, 256);

    // Fine blueprint grid lines
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 256; i += 16) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 256);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(256, i);
      ctx.stroke();
    }

    // Major grid accent lines
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.16)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i <= 256; i += 64) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 256);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(256, i);
      ctx.stroke();
    }

    // Radial edge vignette falloff to blend blueprint floor grid smoothly into studio background
    const imgData = ctx.getImageData(0, 0, 256, 256);
    const data = imgData.data;
    const center = 128;
    const maxRadius = 128;

    for (let y = 0; y < 256; y++) {
      for (let x = 0; x < 256; x++) {
        const dx = x - center;
        const dy = y - center;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const normDist = Math.min(1, dist / maxRadius);
        const falloff = 1 - normDist * normDist;
        const idx = (y * 256 + x) * 4 + 3;
        data[idx] = Math.round(data[idx] * falloff);
      }
    }
    ctx.putImageData(imgData, 0, 0);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, []);

  return (
    <mesh position={[0, -1.305, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[24, 24]} />
      <meshStandardMaterial
        map={gridTexture}
        transparent
        opacity={0.38}
        roughness={0.92}
        metalness={0.0}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── Phase 15 Premium Studio Lighting (Neutral Daylight 6-Point Setup — Zero External CDN) ───
function SceneLighting() {
  return (
    <>
      {/* 1. Neutral Ambient Studio Fill */}
      <ambientLight intensity={0.55} color="#F8FAFC" />

      {/* 2. Soft Sky/Ground Hemisphere Light (Replaces external HDRI CDN dependency) */}
      <hemisphereLight skyColor="#E2E8F0" groundColor="#060B14" intensity={0.35} />

      {/* 3. Primary Key Light — Top-Right Front (Reveals corrugation depth & structural details) */}
      <directionalLight
        position={[8, 10, 6]}
        intensity={1.75}
        color="#FFFFFF"
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-bias={-0.0001}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />

      {/* 4. Balanced Fill Light — Left Side (Softens harsh shadows) */}
      <directionalLight
        position={[-7, 5, -3]}
        intensity={0.65}
        color="#E2E8F0"
      />

      {/* 5. Subtle Rim Light — Back Top */}
      <directionalLight
        position={[-4, 7, -8]}
        intensity={0.55}
        color="#F1F5F9"
      />

      {/* 6. Soft Top Overhead Light */}
      <directionalLight
        position={[0, 12, 0]}
        intensity={0.45}
        color="#FFFFFF"
      />

      {/* 7. Subtle Under Fill Light */}
      <pointLight position={[0, -4, 0]} intensity={0.20} color="#0F172A" />
    </>
  );
}

// ─── Smooth Orbit Controls with Precision Configurator State Machine ───
function SmoothOrbitControls({
  baseSpeed = 0.70,
  isHovered,
  isDragging,
  setIsDragging,
}) {
  const controlsRef = useRef();
  const currentSpeed = useRef(baseSpeed);
  const targetSpeed = useRef(baseSpeed);
  const resumeTimer = useRef(null);
  const isWaitingResume = useRef(false);

  const hoverSpeed = 0.35;
  const idleSpeed = baseSpeed;

  // Handle interaction state transitions cleanly
  useEffect(() => {
    // 1. Mouse Down / Touch Start (Dragging)
    if (isDragging) {
      if (resumeTimer.current) {
        clearTimeout(resumeTimer.current);
        resumeTimer.current = null;
      }
      isWaitingResume.current = true;
      targetSpeed.current = 0;
      return;
    }

    // 2. Drag Release -> Start exact 1000ms resume timer
    if (isWaitingResume.current) {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      resumeTimer.current = setTimeout(() => {
        isWaitingResume.current = false;
        // Resume to hover speed if cursor is hovering, or idle speed if left
        targetSpeed.current = isHovered ? hoverSpeed : idleSpeed;
      }, 1000);
      return;
    }

    // 3. Normal Hover / Pointer Leave
    targetSpeed.current = isHovered ? hoverSpeed : idleSpeed;

    return () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, [isHovered, isDragging, idleSpeed]);

  // Smooth frame interpolation & Phase 14 Cinematic Breathing (Zero React re-renders)
  useFrame((state, delta) => {
    if (!controlsRef.current) return;

    // 1. Smooth auto-rotate speed lerp
    const isAcceleratingFromZero = currentSpeed.current < 0.05 && targetSpeed.current > 0;
    const lerpRate = isAcceleratingFromZero ? 5 : 10;
    const lerpFactor = 1 - Math.exp(-delta * lerpRate);

    currentSpeed.current += (targetSpeed.current - currentSpeed.current) * lerpFactor;
    controlsRef.current.autoRotateSpeed = currentSpeed.current;
    controlsRef.current.autoRotate = currentSpeed.current > 0.001;

    // 2. Phase 14 Luxury Camera Breathing (imperceptible micro-sway when idle)
    if (!isDragging) {
      const t = state.clock.getElapsedTime();
      const breatheY = Math.sin(t * 0.45) * 0.0025;
      const breatheX = Math.cos(t * 0.32) * 0.0018;
      state.camera.position.y += breatheY;
      state.camera.position.x += breatheX;
    }

    controlsRef.current.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      autoRotate={true}
      autoRotateSpeed={baseSpeed}
      enableDamping
      dampingFactor={0.06}
      minDistance={10}
      maxDistance={18}
      minPolarAngle={Math.PI * 0.1}
      maxPolarAngle={Math.PI * 0.85}
      enablePan={false}
      makeDefault
      onStart={() => setIsDragging(true)}
      onEnd={() => setIsDragging(false)}
    />
  );
}

// ─── Container Color Wrapper ───
function SmoothColorContainer({ targetHex }) {
  return <ContainerModel color={targetHex} />;
}

// ══════════════════════════════════════════
// MAIN EXPORT — ShippingContainer3D
// ══════════════════════════════════════════
export default function ShippingContainer3D({
  containerColor = '#1E2A3A',
  autoRotate = true,
  autoRotateSpeed = 0.70,
  showShadow = true,
  cameraPosition = [7.5, 3.2, 5.8],
  style = {},
  className = '',
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const cursorStyle = isDragging ? 'grabbing' : isHovered ? 'grab' : 'default';

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDragging(false);
      }}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => {
        setIsHovered(false);
        setIsDragging(false);
      }}
      style={{
        width: '100%',
        height: '100%',
        minHeight: 400,
        touchAction: 'none',
        cursor: cursorStyle,
        ...style,
      }}
    >
      {/* Premium Studio Loading Overlay */}
      <ShowcaseLoadingOverlay />

      {/* 3D Canvas Scene with instant display */}
      <div className="w-full h-full opacity-100">
        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{
            position: cameraPosition,
            fov: 40,
            near: 0.1,
            far: 100,
          }}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.1,
          }}
        >
          <Suspense fallback={<LoadingFallback />}>
            <SceneLighting />

            {/* Container model centered */}
            <Center>
              <SmoothColorContainer targetHex={containerColor} />
            </Center>

            {/* Soft industrial studio contact shadow beneath bottom corner castings */}
            {showShadow && (
              <ContactShadows
                position={[0, -1.30, 0]}
                opacity={0.45}
                scale={14}
                blur={2.4}
                far={5}
                resolution={256}
                color="#020813"
              />
            )}

            {/* Subtle Industrial Studio Ground Blueprint Grid (Non-glossy, soft response) */}
            <StudioBlueprintFloor />

            {/* Orbit controls with smooth auto-rotate deceleration & 1s resume */}
            <SmoothOrbitControls
              baseSpeed={autoRotate ? autoRotateSpeed : 0}
              isHovered={isHovered}
              isDragging={isDragging}
              setIsDragging={setIsDragging}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
