import React, { useState } from "react";
import { X, Calendar, RefreshCw } from "lucide-react";

export function UpdatePlanModal({ isOpen, onClose, course, onUpdate }) {
  const [days, setDays] = useState(course?.studyPlan?.targetDays || 30);

  if (!isOpen) return null;

  const totalHours = course?.studyPlan?.estimatedHours || 0;
  const dailyHours = (totalHours / days).toFixed(1);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#111111] border border-white/10 w-full max-w-md rounded-3xl p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-black italic">UPDATE AI SCHEDULE</h2>
          <button onClick={onClose}><X size={20} className="text-gray-500" /></button>
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 p-4 rounded-2xl flex justify-between items-center">
            <span className="text-gray-400 text-xs font-bold uppercase">Finish in</span>
            <input 
              type="number" 
              value={days}
              onChange={(e) => setDays(Math.max(1, e.target.value))}
              className="w-16 bg-transparent text-right font-black text-2xl focus:outline-none text-red-500"
            />
            <span className="text-white font-bold ml-2">days</span>
          </div>

          <div className="flex justify-between text-sm font-bold">
            <span className="text-gray-500">Estimated Daily Study</span>
            <span className="text-white">{dailyHours} hrs/day</span>
          </div>

          <button 
            onClick={() => onUpdate(course.studyPlan.planId, days)}
            className="w-full py-4 bg-red-600 rounded-2xl font-black uppercase tracking-widest hover:bg-red-500 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} /> Update Plan
          </button>
        </div>
      </div>
    </div>
  );
}