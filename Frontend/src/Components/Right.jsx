import React, { useEffect, useState } from "react";
import CourseContent from "./subright/CourseContent";
import AITutor from "./subright/AITutor";

import {
  MessageSquare,
  List,
  Users,
} from "lucide-react";

import { useGroupStudy } from "../hooks/useGroupStudy";

import GroupSidebar from "./GroupStudy/GroupSidebar";
import RoomCodeCard from "./GroupStudy/RoomCodeCard";
import EmptyGroupState from "./GroupStudy/EmptyGroupState";

function Right() {
  const { roomCode } = useGroupStudy();

  const [activeTab, setActiveTab] = useState(
    roomCode ? "group" : "content"
  );

  useEffect(() => {
    if (roomCode) {
      setActiveTab("group");
    } else {
      setActiveTab((prev) =>
        prev === "group" ? "content" : prev
      );
    }
  }, [roomCode]);

  const tabs = [
    {
      id: "content",
      label: "Course Content",
      icon: List,
    },
    {
      id: "tutor",
      label: "AI Tutor",
      icon: MessageSquare,
    },
    {
      id: "group",
      label: "Group Study",
      icon: Users,
    },
  ];

  return (
    <div className="h-full flex flex-col bg-[#0d0d0d] border-l border-white/5 shadow-2xl overflow-hidden">

      <div className="relative flex bg-[#141414] border-b border-white/5">

        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-5 text-[11px] font-bold uppercase tracking-[0.22em] transition-all duration-300 ${
                isActive
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <Icon
                size={15}
                className={`transition-all duration-300 ${
                  isActive
                    ? "text-red-500 scale-110"
                    : "text-gray-600"
                }`}
              />

              <span>{tab.label}</span>
            </button>
          );
        })}

        <div
          className="absolute bottom-0 left-0 h-[3px] w-1/3 bg-gradient-to-r from-red-600 to-red-500 transition-all duration-500"
          style={{
            transform:
              activeTab === "content"
                ? "translateX(0%)"
                : activeTab === "tutor"
                ? "translateX(100%)"
                : "translateX(200%)",
          }}
        />

        <div
          className="absolute inset-y-0 left-0 w-1/3 bg-white/[0.02] transition-all duration-500 pointer-events-none"
          style={{
            transform:
              activeTab === "content"
                ? "translateX(0%)"
                : activeTab === "tutor"
                ? "translateX(100%)"
                : "translateX(200%)",
          }}
        />

      </div>

      <div className="flex-1 min-h-0 overflow-hidden">

        {activeTab === "content" && (
          <div className="h-full overflow-y-auto no-scrollbar bg-[#0a0a0a] animate-in fade-in duration-300">
            <CourseContent />
          </div>
        )}

        {activeTab === "tutor" && (
          <div className="h-full overflow-y-auto no-scrollbar bg-[#0b0b0b] animate-in fade-in duration-300">
            <AITutor />
          </div>
        )}

        {activeTab === "group" && (
          <div className="h-full overflow-hidden bg-[#0b0b0b] animate-in fade-in duration-300">

            {roomCode ? (
              <div className="h-full flex flex-col p-4 gap-4">

                <RoomCodeCard />

                <div className="flex-1 min-h-0 overflow-hidden">
                  <GroupSidebar />
                </div>

              </div>
            ) : (
              <EmptyGroupState />
            )}

          </div>
        )}

      </div>

    </div>
  );
}

export default Right;