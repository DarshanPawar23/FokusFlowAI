import React, { useState } from "react";
import { BookText, ListChecks, MessageSquare, Wrench } from "lucide-react"; 
import Learning from "./subfeatures/Learning";
import Notes from "./subfeatures/Notes";
import Overview from "./subfeatures/Overview";
import Certificate from "./subfeatures/Certificate";

function Features() {
  const [activeTab, setActiveTab] = useState("Overview");
  const tabs = ["Overview", "Notes","Exam"];

  return (
    <div className="w-full">
      <div className="flex space-x-8 border-b border-white/10 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all ${
              activeTab === tab ? "text-red-600 border-b-2 border-red-600" : "text-gray-500 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      
      <div className="text-gray-400 leading-relaxed min-h-[400px] animate-fadeIn">
       
       {activeTab === "Overview" && <Overview />}
      {activeTab === "Notes" && <Notes />}
       {/* {activeTab === "Learning Tools" && <Learning />} */}
       {activeTab === "Exam" && <Certificate />}
      </div>
    </div>
  );
}

export default Features;