import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Left from "../Components/Left";
import Right from "../Components/Right";

import {
  BookOpen,
  Share2,
  Trophy,
  Users,
  Home 
} from "lucide-react";

import { GroupStudyProvider, useGroupStudy } from "../hooks/useGroupStudy";
import GroupStudyModal from "../Components/GroupStudy/GroupStudyModal";

function MainContent() {
  const navigate = useNavigate();
  const [courseTitle, setCourseTitle] = useState("Loading Course...");

  const {
    roomCode,
    setIsModalOpen
  } = useGroupStudy();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/current-course`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (data.success) {
          localStorage.setItem(
            "currentCourse",
            JSON.stringify(data.structured || [])
          );

          localStorage.setItem(
            "courseNotes",
            JSON.stringify(data.notes || [])
          );

          localStorage.setItem(
            "courseOverview",
            JSON.stringify(data.overview || null)
          );

          if (
            Array.isArray(data.structured) &&
            data.structured.length > 0
          ) {
            setCourseTitle(
              data.structured[0]?.sectionTitle ||
              data.structured[0]?.videos?.[0]?.title ||
              "My AI Academy"
            );
          } else {
            setCourseTitle("My AI Academy");
          }
        }
      } catch (err) {
        console.error("Failed to sync course data");
        setCourseTitle("My AI Academy");
      }
    };

    fetchCourse();
  }, []);

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-black font-sans text-white">
      <nav className="relative z-50 w-full bg-[#111111] border-b border-white/5 px-6 py-3 flex items-center justify-between shadow-2xl">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 border-r border-white/10 pr-6 font-black uppercase italic tracking-tighter text-lg">
            <div className="p-1.5 bg-red-600 rounded-lg">
              <BookOpen size={20} />
            </div>
            <span>Fokusflow AI</span>
          </div>

          <h2 className="text-sm font-bold text-gray-400 truncate max-w-md uppercase tracking-widest italic">
            {courseTitle}
          </h2>
        </div>

        <div className="flex items-center space-x-5">
          <div className="flex items-center space-x-3">
            <Trophy
              size={18}
              className="text-red-600"
            />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 leading-none">
                Curriculum Mastery
              </span>
              <span className="text-xs font-bold text-white">
                Syncing Progress...
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold uppercase text-[10px] tracking-widest border
            ${
              roomCode
                ? "bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20"
                : "bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
            }
            `}
          >
            <Users size={15} />
            {roomCode ? roomCode : "Group Study"}
          </button>

          {/* Go Back Home Button */}
          <button 
            onClick={() => navigate('/home')}
            title="Go Back Home"
            className="bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all border border-white/10"
          >
            <Home size={16} />
          </button>

          <button className="bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all border border-white/10">
            <Share2 size={16} />
          </button>
        </div>
      </nav>

      <div className="relative flex-grow flex overflow-hidden">
        <div className="w-[68%] h-full overflow-y-auto no-scrollbar border-r border-white/5">
          <Left />
        </div>
        <div className="w-[32%] h-full overflow-y-auto no-scrollbar bg-[#0a0a0a]">
          <Right />
        </div>
      </div>

      <GroupStudyModal />

      <style>{`
        .no-scrollbar::-webkit-scrollbar{
          display:none;
        }

        .no-scrollbar{
          -ms-overflow-style:none;
          scrollbar-width:none;
        }
      `}</style>
    </div>
  );
}

export default function Main() {
  return (
    <GroupStudyProvider>
      <MainContent />
    </GroupStudyProvider>
  );
}