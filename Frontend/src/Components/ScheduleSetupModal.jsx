import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Sparkles, Clock, PlayCircle } from "lucide-react";

const ScheduleSetupModal = ({ isOpen, onClose, playlistId, estimatedHours, totalVideos, courseTitle }) => {
  const navigate = useNavigate();
  const [targetDays, setTargetDays] = useState(30);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleAction = async (doGenerate) => {
    if (!doGenerate) {
      onClose();
      navigate("/main");
      return;
    }

    setIsGenerating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/creaty`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ playlistId, targetDays: parseInt(targetDays, 10) }),
      });

      if ((await res.json()).success) {
        onClose();
        navigate("/main");
      }
    } catch (error) {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      
      {/* Container with Animated Glow Border */}
      <div className="relative w-full max-w-md p-[1px] rounded-[2.5rem] bg-gradient-to-br from-red-600 via-transparent to-orange-600 animate-gradient-xy">
        
        {/* 3D Glass Card */}
        <div className="bg-[#0a0a0a] rounded-[2.4rem] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
          
          {/* Header */}
          <div className="p-8 pb-4 text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-600 to-orange-600 rounded-3xl flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(220,38,38,0.4)]">
              <Sparkles className="text-white animate-pulse" size={32} />
            </div>
            <h2 className="text-2xl font-black text-white mb-1 tracking-tight">Schedule Ready</h2>
            <p className="text-sm text-gray-400 font-medium px-4 line-clamp-1">{courseTitle}</p>
          </div>

          {/* Stats Grid */}
          <div className="px-8 grid grid-cols-2 gap-3 mb-8">
            <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5 text-center">
              <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-1">Total Videos</p>
              <p className="text-lg font-black text-red-500">{totalVideos}</p>
            </div>
            <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5 text-center">
              <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-1">Est. Hours</p>
              <p className="text-lg font-black text-red-500">{estimatedHours}h</p>
            </div>
          </div>

          {/* Input */}
          <div className="px-8 mb-8">
            <label className="block text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
              Finish in how many days?
            </label>
            <div className="flex justify-center items-center">
              <input
                type="number"
                value={targetDays}
                onChange={(e) => setTargetDays(e.target.value)}
                className="w-28 bg-white/[0.05] border border-white/10 rounded-2xl py-5 text-center text-4xl font-black outline-none focus:border-red-500 transition-all focus:ring-4 focus:ring-red-500/10"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="p-8 pt-0 space-y-3">
            <button
              onClick={() => handleAction(true)}
              disabled={isGenerating}
              className="w-full bg-white text-black font-black py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              {isGenerating ? <Loader2 className="animate-spin" size={18} /> : "Generate AI Schedule"}
            </button>
            <button
              onClick={() => handleAction(false)}
              className="w-full text-gray-600 hover:text-white font-bold py-3 uppercase tracking-widest text-[10px] transition-colors"
            >
              Create Later
            </button>
          </div>
        </div>
      </div>

      {/* Add this style for the gradient border animation */}
      <style>{`
        @keyframes gradient-xy {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-xy {
          background-size: 200% 200%;
          animation: gradient-xy 5s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default ScheduleSetupModal;