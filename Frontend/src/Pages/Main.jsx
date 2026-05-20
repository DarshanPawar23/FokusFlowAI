import React, { useEffect, useState } from "react";
import Left from "../Components/Left";
import Right from "../Components/Right";
import { BookOpen, Share2, Trophy } from "lucide-react";

function Main() {
  const [courseTitle, setCourseTitle] = useState("Loading Course...");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:3000/api/users/current-course",
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

          if (Array.isArray(data.structured) && data.structured.length > 0) {
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

      {/* NAVBAR */}
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

        <div className="flex items-center space-x-8">

          <div className="flex items-center space-x-3">
            <Trophy size={18} className="text-red-600" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 leading-none">
                Curriculum Mastery
              </span>
              <span className="text-xs font-bold text-white">
                Syncing Progress...
              </span>
            </div>
          </div>

          <button className="bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all border border-white/10">
            <Share2 size={16} />
          </button>

        </div>
      </nav>

      {/* CONTENT */}
      <div className="relative flex-grow flex overflow-hidden z-10">
        <div className="w-[68%] h-full overflow-y-auto no-scrollbar border-r border-white/5">
          <Left />
        </div>
        <div className="w-[32%] h-full overflow-y-auto no-scrollbar bg-[#0a0a0a]">
          <Right />
        </div>
      </div>

      <style>{`
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`}</style>

    </div>
  );
}
export default Main;
