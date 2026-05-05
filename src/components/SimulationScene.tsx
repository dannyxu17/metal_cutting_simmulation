import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Grid } from '@react-three/drei';
import { Workpiece } from './Workpiece';
import { CuttingTool } from './CuttingTool';
import { Chips } from './Chips';
import { ToolAngles, CuttingParams } from '../types';

interface SimulationSceneProps {
  angles: ToolAngles;
  params: CuttingParams;
  isCutting: boolean;
  showPlanes: boolean;
}

export const SimulationScene: React.FC<SimulationSceneProps> = ({ angles, params, isCutting, showPlanes }) => {
  const [toolZ, setToolZ] = useState(-2.2);

  return (
    <div className="w-full h-full bg-[#1a1a1a]">
      <Canvas shadows gl={{ localClippingEnabled: true }}>
        <PerspectiveCamera makeDefault position={[5, 3, 5]} fov={50} />
        <OrbitControls makeDefault minDistance={2} maxDistance={15} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        
        <Workpiece params={params} isCutting={isCutting} toolZ={toolZ} />
        <CuttingTool 
          angles={angles} 
          params={params} 
          isCutting={isCutting} 
          showPlanes={showPlanes} 
          onPositionUpdate={(z) => setToolZ(z)}
        />
        <Chips params={params} isCutting={isCutting} toolZ={toolZ} />

        <Grid 
          infiniteGrid 
          fadeDistance={20} 
          fadeStrength={5} 
          sectionSize={1} 
          sectionColor="#333"
          cellColor="#222"
        />
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};
