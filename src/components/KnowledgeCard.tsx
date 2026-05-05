import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, HelpCircle } from 'lucide-react';
import { LearningStep, ToolAngles, CuttingParams } from '../types';

interface KnowledgeCardProps {
  step: LearningStep;
  angles: ToolAngles;
  params: CuttingParams;
}

export const KnowledgeCard: React.FC<KnowledgeCardProps> = ({ step, angles, params }) => {
  return (
    <div className="w-80 h-full bg-[#111214] border-l border-white/5 p-6 flex flex-col gap-6 overflow-y-auto pt-20">
      <div className="flex items-center gap-2 text-blue-400">
        <Info size={16} />
        <h2 className="text-xs font-bold uppercase tracking-widest italic">Knowledge Base</h2>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="s1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <h3 className="text-white text-lg font-bold">刀具几何角度</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              刀具角度定义在正交平面 (Po) 内。前角、后角和楔角之间存在固定关系：
            </p>
            <div className="bg-blue-600/5 border border-blue-500/20 p-4 rounded-xl font-mono text-center text-blue-400 text-sm">
              α0 + β0 + γ0 = 90°
            </div>
            <div className="space-y-3 pt-2">
              <Point label="前角 γo" text="控制切屑变形程度，增大前角切削更轻快，但会削弱刀头强度。" />
              <Point label="后角 αo" text="减小后刀面与工件表面摩擦，由于需要保证刀头强度，通常取 6°-12°。" />
              <Point label="楔角 βo" text="决定了刀头的强度，随着前角或后角的增大而减小。" />
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="s2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <h3 className="text-white text-lg font-bold">切削三要素</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              调节参数观察其对加工状态的影响。这是一个趋势模型，重点关注变化规律。
            </p>
            <div className="space-y-3 pt-2">
              <Point label="切削速度 vc" text="主运动速度。速度越高，切屑流出越快，切削热越集中。" />
              <Point label="进给量 f" text="每转进给距离。增加进给量会显著增加切屑厚度，增大主切削力。" />
              <Point label="背吃刀量 ap" text="切削深度。影响切屑宽度和消耗功率的大小。" />
            </div>
            <div className="mt-4 p-4 bg-orange-600/10 border border-orange-500/20 rounded-xl text-[10px] text-orange-400">
               注意：进给量增大会使切屑厚度增加，从而使切削阻力显著上升。
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="s3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <h3 className="text-white text-lg font-bold">切屑形成机理</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              金属切削过程包括三个阶段：挤压变形、剪切滑移、摩擦流出。
            </p>
            <div className="space-y-3">
              <Point label="第一变形区" text="由于刀具挤压，材料产生强烈的塑性变形并发生剪切。" />
              <Point label="第二变形区" text="切屑沿前刀面流出时受到强烈摩擦和二次变形。" />
              <Point label="第三变形区" text="已加工表面受到后刀面的挤压与摩擦。" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Point = ({ label, text }: { label: string, text: string }) => (
  <div className="space-y-1">
    <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{label}</div>
    <div className="text-[11px] text-gray-500 leading-normal">{text}</div>
  </div>
);
