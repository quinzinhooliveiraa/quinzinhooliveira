import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

interface VisitPoint {
  lat: number;
  lng: number;
  country: string;
  city: string | null;
  count: number;
}

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function GlobePoints({ points }: { points: VisitPoint[] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const maxCount = useMemo(() => Math.max(...points.map((p) => p.count), 1), [points]);

  useMemo(() => {
    if (!meshRef.current) return;
    points.forEach((point, i) => {
      const pos = latLngToVector3(point.lat, point.lng, 1.01);
      dummy.position.copy(pos);
      dummy.lookAt(0, 0, 0);
      const scale = 0.02 + (point.count / maxCount) * 0.04;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [points, dummy, maxCount]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, points.length]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#FFCC00" transparent opacity={0.9} />
    </instancedMesh>
  );
}

function GlobePulse({ points }: { points: VisitPoint[] }) {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshBasicMaterial;
        material.opacity = 0.3 + Math.sin(Date.now() * 0.003 + i) * 0.3;
      });
    }
  });

  return (
    <group ref={ref}>
      {points.slice(0, 20).map((point, i) => {
        const pos = latLngToVector3(point.lat, point.lng, 1.02);
        return (
          <mesh key={i} position={pos}>
            <ringGeometry args={[0.02, 0.04, 16]} />
            <meshBasicMaterial color="#FFCC00" transparent opacity={0.5} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
    </group>
  );
}

function RotatingGlobe({ points }: { points: VisitPoint[] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Globe wireframe */}
      <Sphere args={[1, 48, 48]}>
        <meshBasicMaterial color="#1a1a2e" transparent opacity={0.9} />
      </Sphere>
      <Sphere args={[1.005, 48, 48]}>
        <meshBasicMaterial color="#2a2a4a" wireframe transparent opacity={0.3} />
      </Sphere>
      {/* Grid lines */}
      <Sphere args={[1.003, 24, 24]}>
        <meshBasicMaterial color="#333366" wireframe transparent opacity={0.15} />
      </Sphere>

      {points.length > 0 && (
        <>
          <GlobePoints points={points} />
          <GlobePulse points={points} />
        </>
      )}
    </group>
  );
}

export default function AnalyticsGlobe({ points }: { points: VisitPoint[] }) {
  return (
    <div className="w-full h-[350px] sm:h-[400px] rounded-2xl overflow-hidden bg-[hsl(0,0%,5%)]">
      <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <RotatingGlobe points={points} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
      </Canvas>
    </div>
  );
}
