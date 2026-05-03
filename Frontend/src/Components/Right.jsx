import React, { useState } from "react";
import CourseContent from "./subright/CourseContent";
import AITutor from "./subright/AITutor";
import { MessageSquare, List } from "lucide-react";

function Right() {
  const [activeTab, setActiveTab] = useState("content");

  const tabs = [
    { id: "content", label: "Course Content", icon: List },
    { id: "tutor", label: "AI Tutor", icon: MessageSquare },
  ];

  return (
    <div className="h-full flex flex-col bg-[#0d0d0d] border-l border-white/5 shadow-2xl overflow-hidden">

      {/* ===== HEADER TABS ===== */}
      <div className="relative flex bg-[#141414] border-b border-white/5 backdrop-blur-xl">

        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative z-10 flex-1 flex items-center justify-center space-x-2 py-5 text-[11px] font-bold uppercase tracking-[0.25em] transition-all duration-300
                ${isActive ? "text-white" : "text-gray-500 hover:text-gray-300"}
              `}
            >
              <Icon
                size={15}
                className={`transition-all duration-300 ${
                  isActive ? "text-red-500 scale-110" : "text-gray-600"
                }`}
              />
              <span>{tab.label}</span>
            </button>
          );
        })}

        {/* Sliding underline */}
        <div
          className="absolute bottom-0 h-[3px] w-1/2 bg-gradient-to-r from-red-600 to-red-500 transition-all duration-500 ease-out shadow-[0_0_15px_rgba(220,38,38,0.6)]"
          style={{
            transform:
              activeTab === "content"
                ? "translateX(0%)"
                : "translateX(100%)",
          }}
        />

        {/* Soft active background glow */}
        <div
          className="absolute inset-y-0 w-1/2 bg-white/[0.02] transition-all duration-500 pointer-events-none"
          style={{
            transform:
              activeTab === "content"
                ? "translateX(0%)"
                : "translateX(100%)",
          }}
        />
      </div>

      {/* ===== BODY ===== */}
      <div className="flex-grow relative overflow-hidden">

        <div
          className="flex h-full w-[200%] transition-transform duration-500 ease-out"
          style={{
            transform:
              activeTab === "content"
                ? "translateX(0%)"
                : "translateX(-50%)",
          }}
        >

          {/* COURSE CONTENT */}
          <div className="w-1/2 h-full overflow-y-auto no-scrollbar bg-[#0a0a0a]">
            <div
              className={`transition-all duration-500 ${
                activeTab === "content"
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <CourseContent />
            </div>
          </div>

          {/* AI TUTOR */}
          <div className="w-1/2 h-full overflow-y-auto no-scrollbar bg-[#0b0b0b] border-l border-white/5">
            <div
              className={`transition-all duration-500 ${
                activeTab === "tutor"
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <AITutor />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Right;
