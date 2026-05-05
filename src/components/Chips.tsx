import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CuttingParams } from '../types';

interface ChipsProps {
  params: CuttingParams;
  isCutting: boolean;
  toolZ: number;
}

export const Chips: React.FC<ChipsProps> = ({ params, isCutting, toolZ }) => {
  const count = 5; // Very few, high-quality spiral chips
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  // Create a realistic spiral helical geometry
  const chipGeometry = useMemo(() => {
    const points = [];
    const radius = 0.05;
    const height = 0.5;
    const turns = 6;
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      const angle = t * Math.PI * 2 * turns;
      points.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        t * height,
        Math.sin(angle) * radius
      ));
    }
    const curve = new THREE.CatmullRomCurve3(points);
    return new THREE.TubeGeometry(curve, 64, 0.008, 8, false);
  }, []);

  const particles = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      pos: new THREE.Vector3(0, 0, 0),
      vel: new THREE.Vector3(0, 0, 0),
      rot: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0),
      life: Math.random(),
      size: 0.6 + params.depthOfCut * 0.2
    }));
  }, [params.depthOfCut]);

  const dummy = new THREE.Object3D();

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    particles.forEach((p, i) => {
      if (isCutting) {
        p.life -= delta * (0.6 + params.speed * 0.003);
        if (p.life <= 0) {
          p.life = 1.0;
          const toolTipX = 0.5 - (params.depthOfCut * 0.05);
          p.pos.set(toolTipX, 0, toolZ); 
          p.vel.set(
            0.3 + Math.random() * 0.3, // Eject away from part (X)
            0.8 + Math.random() * 0.4, // High ejection (Y)
            -(params.feed * 5.0)       // Motion back (Z)
          ).multiplyScalar(0.5 + params.speed * 0.005);
          p.rot.set(Math.random() * 2, Math.random() * 2, 0);
        }

        p.pos.add(p.vel.clone().multiplyScalar(delta));
        p.rot.x += delta * 1.5;
        p.rot.y += delta * 2.5;
        
        // Gravity and Drag
        p.vel.y -= delta * 1.2;
        p.vel.x -= delta * 0.2;
      } else {
        p.life = -1;
      }

      dummy.position.copy(p.pos);
      dummy.rotation.copy(p.rot);
      dummy.scale.setScalar(p.life > 0 ? p.size : 0);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[chipGeometry, undefined, count]}>
      <meshStandardMaterial color="#cccccc" metalness={0.9} roughness={0.1} />
    </instancedMesh>
  );
};
