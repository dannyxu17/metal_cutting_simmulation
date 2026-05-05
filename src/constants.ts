import { ToolAngles, CuttingParams, StepConfig } from './types';

export const INITIAL_TOOL_ANGLES: ToolAngles = {
  rakeAngle: 15,
  reliefAngle: 8,
  wedgeAngle: 67 // 90 - 15 - 8
};

export const INITIAL_CUTTING_PARAMS: CuttingParams = {
  speed: 120,
  feed: 0.2,
  depthOfCut: 1.0
};

export const LEARNING_STEPS: StepConfig[] = [
  { id: 1, title: '刀具角度可视化', task: '识别并调节前角与后角，观察楔角变化' },
  { id: 2, title: '切削三要素调节', task: '调节切削速度、进给量与背吃刀量' },
  { id: 3, title: '原理动画与小测', task: '观察切屑形成过程并完成自测' }
];
