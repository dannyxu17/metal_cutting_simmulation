export interface ToolAngles {
  rakeAngle: number;    // gamma_o: 前角
  reliefAngle: number;  // alpha_o: 后角
  wedgeAngle: number;   // beta_o: 楔角 (alpha + beta + gamma = 90)
}

export interface CuttingParams {
  speed: number;        // v_c: 切削速度 (m/min)
  feed: number;         // f: 进给量 (mm/r)
  depthOfCut: number;   // a_p: 背吃刀量 (mm)
}

export type LearningStep = 1 | 2 | 3;

export interface StepConfig {
  id: LearningStep;
  title: string;
  task: string;
}
