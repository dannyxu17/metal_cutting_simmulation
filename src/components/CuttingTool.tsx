import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cone, Cylinder, Text } from '@react-three/drei';
import * as THREE from 'three';
import { ToolAngles, CuttingParams } from '../types';

interface CuttingToolProps {
  angles: ToolAngles;
  params: CuttingParams;
  isCutting: boolean;
  showPlanes: boolean;
  onPositionUpdate?: (y: number) => void;
}

export const CuttingTool: React.FC<CuttingToolProps> = ({ angles, params, isCutting, showPlanes, onPositionUpdate }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Animation logic: moves along Z axis during cutting (Longitudinal feed)
  useFrame((state, delta) => {
    if (isCutting && groupRef.current) {
       // Feed movement usually along the axis of rotation (Z)
       groupRef.current.position.z += params.feed * delta * 2.0;
       if (groupRef.current.position.z > 2.2) groupRef.current.position.z = -2.2;
       
       onPositionUpdate?.(groupRef.current.position.z);
    }
  });

  // Derived rotations
  const rakeRad = (angles.rakeAngle * Math.PI) / 180;
  const reliefRad = (angles.reliefAngle * Math.PI) / 180;
  const leadRad = (45 * Math.PI) / 180; // Hardcoded 主偏角 for simulation

  // Tool position on X depends on depth of cut (ap)
  // Workpiece radius is 0.5. 
  // We scale ap (0.5 to 2.0) to a visual depth (0.025 to 0.1)
  const visualDepth = params.depthOfCut * 0.05;
  const toolTipX = 0.5 - visualDepth;
  
  // The tool head tip is at local x = -0.1 (relative to group)
  // So group x = toolTipX + 0.1
  const groupX = toolTipX + 0.1;

  return (
    <group ref={groupRef} position={[groupX, 0, -2.2]}>
      {/* Tool Shank - points away from center */}
      <Box args={[1.2, 0.2, 0.2]} position={[0.6, 0, 0]}>
        <meshStandardMaterial color="#222" metalness={0.7} roughness={0.3} />
      </Box>

      {/* Tool Head */}
      <group rotation={[0, -leadRad, 0]}>
        {/* Tilting the entire tool head by relief angle away from the workpiece */}
        <group rotation={[reliefRad, 0, -rakeRad]}>
          <Box args={[0.2, 0.15, 0.15]} position={[-0.1, 0, 0]}>
            <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
          </Box>
          {/* Main Cutting Edge */}
          <Box args={[0.01, 0.16, 0.01]} position={[-0.1, 0, 0.075]}>
            <meshStandardMaterial color={showPlanes ? "cyan" : "red"} emissive={showPlanes ? "cyan" : "red"} emissiveIntensity={1} />
          </Box>
          
          {/* Angle Markers (Symbols) */}
          {showPlanes && (
            <group position={[-0.1, 0, 0]}>
              <Text position={[0.1, 0.2, 0.1]} fontSize={0.06} color="yellow">γo (前角)</Text>
              <Text position={[-0.15, -0.2, 0.1]} fontSize={0.06} color="magenta">αo (后角)</Text>
              <Text position={[0.1, -0.05, 0.1]} fontSize={0.06} color="orange">βo (楔角)</Text>
              
              {/* Visualizing faces more clearly */}
              <Box args={[0.2, 0.01, 0.15]} position={[0.1, 0.08, 0.08]}>
                <meshBasicMaterial color="yellow" transparent opacity={0.3} />
              </Box>
              <Box args={[0.01, 0.2, 0.15]} position={[-0.01, -0.05, 0.08]}>
                <meshBasicMaterial color="magenta" transparent opacity={0.3} />
              </Box>
            </group>
          )}
        </group>
      </group>

      {/* Reference Planes */}
      {showPlanes && (
        <group scale={0.5}>
          {/* Pr: Base Plane (Horizontal, contains edge) */}
          <PlaneHelper label="Pr" color="blue" rotation={[Math.PI/2, 0, 0]} opacity={0.3} />
          {/* Ps: Cutting Plane (Contains edge, tangent to surface) */}
          <PlaneHelper label="Ps" color="green" rotation={[0, -leadRad, Math.PI/2]} opacity={0.3} />
          {/* Po: Orthogonal Plane (Perpendicular to Pr and Ps) */}
          <PlaneHelper label="Po" color="orange" rotation={[0, -leadRad + Math.PI/2, Math.PI/2]} opacity={0.3} />
        </group>
      )}
    </group>
  );
};

const PlaneHelper = ({ label, color, rotation, opacity }: any) => (
  <group rotation={rotation}>
    <mesh>
      <planeGeometry args={[0.8, 0.8]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} />
    </mesh>
    <Text position={[0.4, 0.4, 0]} fontSize={0.05} color="white">
      {label}
    </Text>
  </group>
);
