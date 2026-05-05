import React, { useState } from 'react';
import { Play, RotateCcw, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const QuizSection = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const questions = [
    {
      q: "哪一个角度的大小直接影响切削刃的强度和散热条件？",
      a: ["前角 γo", "后角 αo", "楔角 βo", "主偏角 κr"],
      correct: 2
    },
    {
      q: "当进给量 f 增大时，切屑厚度会发生什么变化？",
      a: ["明显增加", "明显减小", "基本不变", "先增后减"],
      correct: 0
    },
    {
      q: "切屑形成过程中，材料发生滑移的主要区域是？",
      a: ["第一变形区", "第二变形区", "第三变形区", "已加工表面"],
      correct: 0
    }
  ];

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === questions[currentQuestion].correct) setScore(s => s + 1);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(c => c + 1);
        setSelected(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  if (showResult) {
    const finalScore = Math.round((score / questions.length) * 100);
    return (
      <div className="p-6 bg-blue-600/10 border border-blue-500/20 rounded-2xl text-center space-y-4">
        <div className="flex justify-center text-blue-400">
          <CheckCircle size={48} />
        </div>
        <h3 className="text-xl font-bold">学习任务完成</h3>
        <div className="text-3xl font-mono font-bold text-blue-400">{finalScore} 分</div>
        <p className="text-gray-400 text-xs text-left">
          {finalScore >= 80 ? '太棒了！你已基本掌握切削加工的基础概论。' : '仍有提升空间，建议返回第一步重新观察角度关系。'}
        </p>
        <button 
          onClick={() => {
            setCurrentQuestion(0);
            setSelected(null);
            setShowResult(false);
            setScore(0);
          }}
          className="w-full py-3 bg-blue-600 rounded-xl text-sm font-bold hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw size={16} /> 重新测试
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Question {currentQuestion + 1} / {questions.length}</span>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div key={i} className={`w-4 h-1 rounded-full ${i <= currentQuestion ? 'bg-blue-500' : 'bg-gray-800'}`} />
          ))}
        </div>
      </div>
      
      <h4 className="text-sm font-bold text-white leading-relaxed">{questions[currentQuestion].q}</h4>
      
      <div className="space-y-2">
        {questions[currentQuestion].a.map((opt, idx) => {
          const isCorrect = idx === questions[currentQuestion].correct;
          const isSelected = selected === idx;
          
          let btnClass = "bg-[#1c1d21] border-white/5 text-gray-400 hover:border-blue-500/30";
          if (selected !== null) {
             if (isCorrect) btnClass = "bg-green-600/20 border-green-500 text-green-400";
             else if (isSelected) btnClass = "bg-red-600/20 border-red-500 text-red-400";
          }

          return (
            <button
              key={opt}
              disabled={selected !== null}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left p-4 rounded-xl text-xs font-medium border transition-all ${btnClass}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};
