import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { LEARNING_STEPS } from '../constants';
import { LearningStep } from '../types';

interface StepNavigationProps {
  currentStep: LearningStep;
  completedSteps: LearningStep[];
  onSetStep: (step: LearningStep) => void;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({ currentStep, completedSteps, onSetStep }) => {
  return (
    <div className="w-64 h-full bg-[#111214] border-r border-white/5 flex flex-col pt-20">
      <div className="px-6 mb-8 text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">学习进度</div>
      <div className="flex-1 px-4 space-y-2">
        {LEARNING_STEPS.map((step) => {
          const isActive = currentStep === step.id;
          const isCompleted = completedSteps.includes(step.id);
          
          return (
            <button
              key={step.id}
              onClick={() => onSetStep(step.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all text-left group ${
                isActive 
                  ? 'bg-blue-600/10 border border-blue-500/30 text-white' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <div className={`shrink-0 ${isActive ? 'text-blue-400' : isCompleted ? 'text-green-500' : 'text-gray-700'}`}>
                {isCompleted ? <CheckCircle2 size={18} /> : <Circle size={18} />}
              </div>
              <div className="flex flex-col">
                <span className={`text-[10px] uppercase font-bold tracking-wider ${isActive ? 'text-blue-400' : 'text-gray-600'}`}>
                  STEP 0{step.id}
                </span>
                <span className="text-sm font-medium">{step.title}</span>
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="p-6 border-t border-white/5 text-[10px] text-gray-600 uppercase tracking-widest leading-loose">
        工件材料: 中碳钢<br />
        刀具材料: 硬质合金
      </div>
    </div>
  );
};
