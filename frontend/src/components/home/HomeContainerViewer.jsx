import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Center, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import ContainerModel from '../../pages/ContainerSection/components/3d/ContainerModel';

/**
 * HomeContainerViewer — Lightweight 3D container viewer for the home page.
 * Transparent background (no dark box/grid/frame), designed to sit on white.
 * Full interactivity: drag-to-rotate, scroll/pinch zoom, color swatch switching.
 */

/* ─── Light-Theme Loading Overlay ─── */
function HomeLoadingOverlay() {
  const { progress, active } = useProgress();
  const [shouldRender, setShouldRender] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!active || progress >= 100) {
      setFadeOut(true);
      const timer = setTimeout(() => setShouldRender(false), 400);
      return () => clearTimeout(timer);
    } else {
      setShouldRender(true);
      setFadeOut(false);
    }
  }, [active, progress]);

  if (!shouldRender) return null;

  return (
    <div
      className={`absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm transition-opacity duration-400 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-gray-900 animate-spin mb-3" />
      <p
        className="font-medium text-gray-400 tracking-wide"
        style={{ fontSize: 'clamp(11px, 0.8vw, 13px)' }}
      >
        Loading 3D Container...
      </p>
      <div className="flex items-center gap-2 mt-2">
        <div className="w-16 h-1 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full bg-gray-900 transition-all duration-200 rounded-full"
            style={{ width: `${Math.max(10, progress)}%` }}
          />
        </div>
        <span className="text-[10px] font-mono text-gray-400">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}

/* ─── Canvas Loading Fallback ─── */
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#d1d5db" wireframe />
    </mesh>
  );
}

/* ─── Premium Studio Lighting (neutral daylight, same quality as ContainerSection) ─── */
function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.6} color="#F8FAFC" />
      <hemisphereLight skyColor="#F0F4F8" groundColor="#E2E8F0" intensity={0.4} />

      {/* Primary Key Light */}
      <directionalLight
        position={[8, 10, 6]}
        intensity={1.8}
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

      {/* Balanced Fill Light */}
      <directionalLight position={[-7, 5, -3]} intensity={0.7} color="#E2E8F0" />

      {/* Subtle Rim Light */}
      <directionalLight position={[-4, 7, -8]} intensity={0.55} color="#F1F5F9" />

      {/* Top Overhead */}
      <directionalLight position={[0, 12, 0]} intensity={0.5} color="#FFFFFF" />
    </>
  );
}

/* ─── Smooth Orbit Controls with auto-rotate ─── */
function SmoothOrbitControls({ baseSpeed = 0.5, isHovered, isDragging, setIsDragging }) {
  const controlsRef = useRef();
  const currentSpeed = useRef(baseSpeed);
  const targetSpeed = useRef(baseSpeed);
  const resumeTimer = useRef(null);
  const isWaitingResume = useRef(false);

  const hoverSpeed = 0.25;
  const idleSpeed = baseSpeed;

  useEffect(() => {
    if (isDragging) {
      if (resumeTimer.current) {
        clearTimeout(resumeTimer.current);
        resumeTimer.current = null;
      }
      isWaitingResume.current = true;
      targetSpeed.current = 0;
      return;
    }

    if (isWaitingResume.current) {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      resumeTimer.current = setTimeout(() => {
        isWaitingResume.current = false;
        targetSpeed.current = isHovered ? hoverSpeed : idleSpeed;
      }, 1000);
      return;
    }

    targetSpeed.current = isHovered ? hoverSpeed : idleSpeed;

    return () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, [isHovered, isDragging, idleSpeed]);

  useFrame((state, delta) => {
    if (!controlsRef.current) return;

    const isAcceleratingFromZero = currentSpeed.current < 0.05 && targetSpeed.current > 0;
    const lerpRate = isAcceleratingFromZero ? 5 : 10;
    const lerpFactor = 1 - Math.exp(-delta * lerpRate);

    currentSpeed.current += (targetSpeed.current - currentSpeed.current) * lerpFactor;
    controlsRef.current.autoRotateSpeed = currentSpeed.current;
    controlsRef.current.autoRotate = currentSpeed.current > 0.001;

    // Subtle camera breathing
    if (!isDragging) {
      const t = state.clock.getElapsedTime();
      state.camera.position.y += Math.sin(t * 0.45) * 0.002;
      state.camera.position.x += Math.cos(t * 0.32) * 0.0015;
    }

    controlsRef.current.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      autoRotate
      autoRotateSpeed={baseSpeed}
      enableDamping
      dampingFactor={0.06}
      minDistance={8}
      maxDistance={24}
      minPolarAngle={Math.PI * 0.15}
      maxPolarAngle={Math.PI * 0.75}
      enablePan={false}
      makeDefault
      onStart={() => setIsDragging(true)}
      onEnd={() => setIsDragging(false)}
    />
  );
}

/* ─── Responsive Camera (adjusts camera distance based on aspect ratio) ─── */
function ResponsiveCamera() {
  const { size, camera } = useThree();

  useEffect(() => {
    if (!camera) return;
    const aspect = size.width / Math.max(size.height, 1);
    // At aspect < 1.3 (narrower screens, phones, tablets), scale camera distance inversely
    // so the container (6.06m long) stays within horizontal frustum without clipping.
    const targetDistance = aspect < 1.3 ? Math.max(9.5, 9.5 * (1.3 / aspect)) : 9.5;
    const basePos = new THREE.Vector3(7, 3, 5.5).normalize();
    camera.position.copy(basePos.multiplyScalar(targetDistance));
    camera.updateProjectionMatrix();
  }, [size.width, size.height, camera]);

  return null;
}

/* ═══════════════════════════════════════
   COLOR PRESETS (same as ContainerSection)
   ═══════════════════════════════════════ */
const COLOR_PRESETS = [
  { name: 'Marine Blue', hex: '#1D3F6E' },
  { name: 'Container Red', hex: '#8B2500' },
  { name: 'Evergreen Green', hex: '#2E5939' },
  { name: 'Slate Grey', hex: '#5A5F65' },
  { name: 'Industrial White', hex: '#C8C5B8' },
  { name: 'Safety Yellow', hex: '#C49B1A' },
  { name: 'Orange', hex: '#B35C1E' },
  { name: 'Dark Charcoal', hex: '#2A2A2A' },
];

/* ═══════════════════════════════════════
   MAIN EXPORT — HomeContainerViewer
   ═══════════════════════════════════════ */
export default function HomeContainerViewer() {
  const [containerColor, setContainerColor] = useState(COLOR_PRESETS[0].hex);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const activePreset =
    COLOR_PRESETS.find((c) => c.hex === containerColor) || COLOR_PRESETS[0];
  const cursorStyle = isDragging ? 'grabbing' : isHovered ? 'grab' : 'default';

  return (
    <div className="flex flex-col items-center w-full">
      {/* 3D Canvas — transparent background */}
      <div
        className="relative w-full select-none"
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
          aspectRatio: '4 / 3',
          minHeight: 'clamp(280px, 40vh, 500px)',
          touchAction: 'pan-y',
          cursor: cursorStyle,
        }}
      >
        <HomeLoadingOverlay />

        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{
            position: [7, 3, 5.5],
            fov: 40,
            near: 0.1,
            far: 100,
          }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.15,
          }}
          style={{ background: 'transparent' }}
        >
          <ResponsiveCamera />
          <Suspense fallback={<LoadingFallback />}>
            <SceneLighting />

            <Center>
              <ContainerModel color={containerColor} />
            </Center>

            {/* Soft contact shadow — visible on white background */}
            <ContactShadows
              position={[0, -1.30, 0]}
              opacity={0.3}
              scale={14}
              blur={2.8}
              far={5}
              resolution={256}
              color="#94a3b8"
            />

            <SmoothOrbitControls
              baseSpeed={0.5}
              isHovered={isHovered}
              isDragging={isDragging}
              setIsDragging={setIsDragging}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Color Swatch Picker — Light Theme */}
      <div
        className="flex items-center gap-3 mt-3"
        style={{
          padding: 'clamp(6px, 0.6vw, 10px) clamp(12px, 1.2vw, 20px)',
          borderRadius: 'clamp(20px, 2vw, 40px)',
          background: '#f9fafb',
          border: '1px solid rgba(0, 0, 0, 0.06)',
        }}
      >
        {/* Active color label */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            className="rounded-full border border-gray-300 transition-colors duration-300"
            style={{
              backgroundColor: activePreset.hex,
              width: 'clamp(12px, 1vw, 16px)',
              height: 'clamp(12px, 1vw, 16px)',
            }}
          />
          <span
            className="font-semibold text-gray-700 tracking-wide hidden sm:inline"
            style={{ fontSize: 'clamp(10px, 0.75vw, 12px)' }}
          >
            {activePreset.name}
          </span>
        </div>

        {/* Swatch divider */}
        <div
          className="w-px bg-gray-200 hidden sm:block"
          style={{ height: 'clamp(16px, 1.5vw, 24px)' }}
        />

        {/* Swatch buttons */}
        <div
          role="radiogroup"
          aria-label="Container color options"
          className="flex items-center"
          style={{ gap: 'clamp(4px, 0.4vw, 8px)' }}
        >
          {COLOR_PRESETS.map((preset, idx) => {
            const isActive = containerColor === preset.hex;
            return (
              <button
                key={preset.hex}
                type="button"
                role="radio"
                aria-checked={isActive}
                aria-label={`Select ${preset.name}`}
                title={preset.name}
                onClick={() => setContainerColor(preset.hex)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowRight') {
                    setContainerColor(COLOR_PRESETS[(idx + 1) % COLOR_PRESETS.length].hex);
                  } else if (e.key === 'ArrowLeft') {
                    setContainerColor(
                      COLOR_PRESETS[(idx - 1 + COLOR_PRESETS.length) % COLOR_PRESETS.length].hex
                    );
                  }
                }}
                className={`rounded-full border transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 focus-visible:outline-none ${
                  isActive
                    ? 'scale-115 border-gray-900 shadow-md ring-1 ring-gray-900/30'
                    : 'border-gray-300 opacity-60 hover:opacity-100 hover:scale-110 hover:border-gray-500'
                }`}
                style={{
                  backgroundColor: preset.hex,
                  width: 'clamp(18px, 1.4vw, 24px)',
                  height: 'clamp(18px, 1.4vw, 24px)',
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
