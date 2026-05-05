import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CuttingParams } from '../types';

interface WorkpieceProps {
  params: CuttingParams;
  isCutting: boolean;
  toolZ: number;
}

export const Workpiece: React.FC<WorkpieceProps> = ({ params, isCutting, toolZ }) => {
  const meshRawRef = useRef<THREE.Mesh>(null);
  const meshCutRef = useRef<THREE.Mesh>(null);

  // Clipping planes to split the workpiece
  // PlaneRaw: Keep the part ahead of the tool (Z > toolZ)
  const planeRaw = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  // PlaneCut: Keep the part behind the tool (Z < toolZ)
  const planeCut = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, -1), 0), []);

  useFrame((state, delta) => {
    // Continuous rotation
    const rotationSpeed = isCutting ? (params.speed * 0.01) : 0.05;
    
    if (meshRawRef.current) meshRawRef.current.rotation.y += rotationSpeed;
    if (meshCutRef.current) meshCutRef.current.rotation.y += rotationSpeed;

    // Update plane positions based on tool Z
    // Plane equation: n·x + constant = 0.
    // For n=(0,0,1), keeping z > toolZ means z - toolZ > 0, so constant = -toolZ
    planeRaw.constant = -toolZ;
    // For n=(0,0,-1), keeping z < toolZ means -z + toolZ > 0, so constant = toolZ
    planeCut.constant = toolZ;
  });

  const rawRadius = 0.5;
  const cutRadius = Math.max(0.1, 0.5 - (params.depthOfCut * 0.05));

  return (
    <group>
      {/* 1. Raw Workpiece (Uncut part) */}
      <mesh ref={meshRawRef} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[rawRadius, rawRadius, 4, 64]} />
        <meshStandardMaterial 
          color="#333" 
          metalness={1.0} 
          roughness={0.1} 
          clippingPlanes={[planeRaw]}
          clipShadows
        />
      </mesh>

      {/* 2. Cut Workpiece (Finished part) */}
      <mesh ref={meshCutRef} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[cutRadius, cutRadius, 4, 64]} />
        <meshStandardMaterial 
          color="#555" 
          metalness={1.0} 
          roughness={0.05} 
          clippingPlanes={[planeCut]}
          clipShadows
        />
      </mesh>

      {/* Surface Pattern (Rotation visualizer) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.51, 0.51, 4, 32]} />
        <meshBasicMaterial color="white" wireframe transparent opacity={0.02} />
      </mesh>
    </group>
  );
};
