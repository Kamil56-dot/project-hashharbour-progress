import React, { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Center, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import ContainerModel from '../../pages/ContainerSection/components/3d/ContainerModel';

/**
 * StaticServiceContainer — Orthographic 3D Container Render
 * 
 * Uses Orthographic Camera Projection (Parallel Rays):
 * - Eliminates all trapezoidal/asymmetric vanishing-point perspective distortion.
 * - Left and Right corners are 100% SYMMETRIC in size, height, and depth.
 * - Auto-fits camera zoom to container length (6.058m) so container edges touch 
 *   canvas boundaries perfectly with zero horizontal gap.
 */

function AutoFitCamera() {
  const { size, camera } = useThree();

  useEffect(() => {
    if (camera && camera.isOrthographicCamera && size.width > 0) {
      camera.zoom = size.width / 6.058;
      camera.updateProjectionMatrix();
    }
  }, [size.width, camera]);

  return null;
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#d1d5db" wireframe />
    </mesh>
  );
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.55} color="#F8FAFC" />
      <hemisphereLight skyColor="#FFFFFF" groundColor="#CBD5E1" intensity={0.4} />

      {/* Angled Studio Key Light (Casts rich shadows inside corrugated vertical troughs) */}
      <directionalLight position={[-8, 8, 7]} intensity={2.2} color="#FFFFFF" />

      {/* Front-Right Fill Light for surface specular gleam */}
      <directionalLight position={[6, 4, 6]} intensity={0.7} color="#F1F5F9" />

      {/* Top Rim Light for Rail Extrusion & Corner Post Definition */}
      <directionalLight position={[0, 10, -2]} intensity={0.6} color="#FFFFFF" />
    </>
  );
}

export default function StaticServiceContainer({
  color = '#1D3F6E',
  serviceNumber,
  serviceName,
  serviceDescription,
  className = '',
  style = {},
}) {
  return (
    <div
      className={`relative w-full h-full pointer-events-none select-none ${className}`}
      style={{ ...style }}
    >
      <Canvas
        orthographic
        frameloop="demand"
        shadows={false}
        dpr={[1, 2]}
        camera={{
          position: [0, 0, 10],
          near: 0.1,
          far: 100,
        }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        <AutoFitCamera />
        <Suspense fallback={<LoadingFallback />}>
          <SceneLighting />

          <Center>
            <ContainerModel
              color={color}
              serviceNumber={serviceNumber}
              serviceName={serviceName}
              serviceDescription={serviceDescription}
            />
          </Center>
        </Suspense>
      </Canvas>
    </div>
  );
}

