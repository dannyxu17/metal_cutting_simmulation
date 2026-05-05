import { useState, useEffect } from 'react';
import { StepNavigation } from './components/StepNavigation';
import { KnowledgeCard } from './components/KnowledgeCard';
import { SimulationScene } from './components/SimulationScene';
import { QuizSection } from './components/QuizSection';
import { ToolAngles, CuttingParams, LearningStep } from './types';
import { INITIAL_TOOL_ANGLES, INITIAL_CUTTING_PARAMS, LEARNING_STEPS } from './constants';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Play, Square, Eye, EyeOff } from 'lucide-react';

export default function App() {
  const [angles, setAngles] = useState<ToolAngles>(INITIAL_TOOL_ANGLES);
  const [params, setParams] = useState<CuttingParams>(INITIAL_CUTTING_PARAMS);
  const [currentStep, setCurrentStep] = useState<LearningStep>(1);
  const [completedSteps, setCompletedSteps] = useState<LearningStep[]>([]);
  const [isCutting, setIsCutting] = useState(false);
  const [showPlanes, setShowPlanes] = useState(false);

  // Wedge angle auto-calculation
  const updateAngle = (key: keyof ToolAngles, val: number) => {
    const next = { ...angles, [key]: val };
    if (key === 'rakeAngle') {
      next.wedgeAngle = 90 - val - next.reliefAngle;
    } else if (key === 'reliefAngle') {
      next.wedgeAngle = 90 - val - next.rakeAngle;
    }
    setAngles(next);
  };

  const currentStepConfig = LEARNING_STEPS.find(s => s.id === currentStep)!;

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (currentStep < 3) setCurrentStep((currentStep + 1) as LearningStep);
  };

  return (
    <div className="flex h-screen w-screen bg-[#050505] text-white overflow-hidden selection:bg-blue-500/30">
      {/* 1. Top Header (Progress) */}
      <header className="absolute top-0 left-0 right-0 h-16 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl z-50 flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">M</div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">机械制造基础：切削加工原理</h1>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-1 rounded-full transition-all ${i <= currentStep ? 'bg-blue-500 w-6' : 'bg-gray-800 w-2'}`} />
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">学习者</div>
            <div className="text-xs font-medium">大一机械工程系</div>
          </div>
        </div>
      </header>

      {/* 2. Left: Step Navigation */}
      <StepNavigation 
        currentStep={currentStep} 
        completedSteps={completedSteps} 
        onSetStep={setCurrentStep} 
      />

      {/* 3. Center: Interactive View */}
      <main className="flex-1 relative flex flex-col pt-16">
        {/* Guidance Bar */}
        <div className="absolute top-4 left-4 right-4 z-10 pointer-events-none">
          <motion.div 
            key={currentStep}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto bg-blue-600/10 border border-blue-500/30 p-4 rounded-2xl backdrop-blur-xl flex items-center justify-between pointer-events-auto"
          >
            <div className="flex items-center gap-4">
               <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold shrink-0">!</div>
               <p className="text-sm font-medium text-blue-200">{currentStepConfig.task}</p>
            </div>
          </motion.div>
        </div>

        {/* The 3D Scene */}
        <div className="flex-1 w-full bg-[#111] relative">
           <SimulationScene 
             angles={angles}
             params={params}
             isCutting={isCutting}
             showPlanes={showPlanes}
           />
           
           {/* Scene Controls Overlay */}
           <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end z-10 pointer-events-none">
              <div className="flex gap-2 pointer-events-auto">
                 <button 
                  onClick={() => setShowPlanes(!showPlanes)}
                  className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${showPlanes ? 'bg-blue-600 border-blue-400 text-white' : 'bg-[#1a1b1e]/80 border-white/5 text-gray-500 hover:text-gray-300'}`}
                 >
                   {showPlanes ? <Eye size={20} /> : <EyeOff size={20} />}
                   <span className="text-[8px] uppercase font-bold tracking-wider">辅助平面</span>
                 </button>
              </div>

              {/* Step Specific Controls */}
              <div className="pointer-events-auto w-full max-w-md mx-6">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1a1b1e]/80 backdrop-blur-xl border border-white/5 p-6 rounded-3xl space-y-4">
                      <Slider label={`前角 γo: ${angles.rakeAngle}°`} value={angles.rakeAngle} onChange={v => updateAngle('rakeAngle', v)} min={-10} max={25} />
                      <Slider label={`后角 αo: ${angles.reliefAngle}°`} value={angles.reliefAngle} onChange={v => updateAngle('reliefAngle', v)} min={2} max={15} />
                      <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono">
                        <span>αo + βo + γo = 90</span>
                        <span className="text-blue-400 font-bold">楔角 βo = {angles.wedgeAngle}°</span>
                      </div>
                    </motion.div>
                  )}
                  {currentStep === 2 && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1a1b1e]/80 backdrop-blur-xl border border-white/5 p-6 rounded-3xl space-y-4">
                      <Slider color="accent-orange-500" label={`切削速度 vc: ${params.speed}`} value={params.speed} onChange={v => setParams({...params, speed: v})} min={60} max={240} />
                      <Slider color="accent-orange-500" label={`进给量 f: ${params.feed.toFixed(2)}`} value={params.feed} onChange={v => setParams({...params, feed: v})} min={0.1} max={0.4} step={0.01} />
                      <Slider color="accent-orange-500" label={`背吃刀量 ap: ${params.depthOfCut.toFixed(1)}`} value={params.depthOfCut} onChange={v => setParams({...params, depthOfCut: v})} min={0.5} max={2.0} step={0.1} />
                      <button 
                        onClick={() => setIsCutting(!isCutting)}
                        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isCutting ? 'bg-red-600/20 text-red-500 border border-red-500/50' : 'bg-orange-600 text-white shadow-xl shadow-orange-600/20'}`}
                      >
                        {isCutting ? <><Square size={20} fill="currentColor" /> 停止模拟</> : <><Play size={20} fill="currentColor" /> 开始切削</>}
                      </button>
                    </motion.div>
                  )}
                  {currentStep === 3 && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1a1b1e]/80 backdrop-blur-xl border border-white/5 p-6 rounded-3xl">
                       <QuizSection />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button 
                onClick={handleNext}
                className="pointer-events-auto p-4 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-blue-600/20 transition-all border border-blue-400/50"
              >
                下一步 <ChevronRight size={18} />
              </button>
           </div>
        </div>
      </main>

      {/* 4. Right: Knowledge Card */}
      <KnowledgeCard step={currentStep} angles={angles} params={params} />
    </div>
  );
}

const Slider = ({ label, value, onChange, min, max, step = 1, color = "accent-blue-500" }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider font-mono">{label}</label>
      <span className="text-[10px] text-gray-700 font-mono italic">MIN {min} / MAX {max}</span>
    </div>
    <input 
      type="range" min={min} max={max} step={step} value={value} 
      onChange={(e) => onChange(Number(e.target.value))}
      className={`w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer ${color}`}
    />
  </div>
);

