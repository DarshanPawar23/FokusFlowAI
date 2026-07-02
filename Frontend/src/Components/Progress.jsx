import React from "react";
import { CalendarClock, Sparkles, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ScheduleButton() {
  const navigate = useNavigate();

  return (
    <div className="relative group cursor-pointer">
      {/* 1. Animated Ambient Glow (Behind the button) */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 rounded-xl blur-[6px] opacity-40 group-hover:opacity-80 transition duration-500 animate-pulse" />

      <button 
        onClick={() => navigate("/schedule")}
        className="relative flex items-center gap-3 px-4 py-2 bg-[#0a0a0a] rounded-xl border border-white/10 
                   transition-all duration-200 ease-out
                   /* 3D Hover Lift & Shadow */
                   group-hover:-translate-y-[2px] group-hover:shadow-[0_8px_20px_rgba(220,38,38,0.25)]
                   /* 3D Click Press Down */
                   active:translate-y-[2px] active:shadow-[0_0px_0px_rgba(220,38,38,0)] active:duration-75
                   overflow-hidden focus:outline-none"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Icon Container with Inner Glow */}
        <div className="relative z-10 flex items-center justify-center p-1.5 bg-gradient-to-br from-red-500/20 to-orange-500/5 rounded-lg border border-red-500/20 group-hover:border-red-500/50 transition-colors duration-300">
          <CalendarClock size={18} className="text-red-500 group-hover:text-red-400 drop-shadow-lg transition-colors" />
        </div>
        
        {/* Text Details */}
        <div className="relative z-10 flex flex-col text-left leading-none pr-1">
          <span className="flex items-center gap-1.5 text-[9px] text-gray-300 uppercase font-black tracking-widest mb-1 group-hover:text-red-300 transition-colors">
            AI Agent <Sparkles size={10} className="text-yellow-500 animate-pulse" />
          </span>
          
          <span className="text-sm font-black text-white tracking-wide group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">
            My Schedule
          </span>
        </div>

        {/* Hover Slide-in Indicator */}
        <ChevronRight 
          size={16} 
          className="relative z-10 text-red-500 ml-[-8px] opacity-0 -translate-x-3 
                     group-hover:opacity-100 group-hover:translate-x-0 group-hover:ml-0 
                     transition-all duration-300 ease-out" 
        />
      </button>
    </div>
  );
}

export default ScheduleButton;