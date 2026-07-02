import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, Search, Sparkles, GraduationCap, Zap, 
  ShieldCheck, Layout, Trophy, ArrowRight
} from "lucide-react";

import Progress from "../Components/Progress";
import CourseProgress from "../Components/CourseProgress";
import ScheduleSetupModal from "../Components/ScheduleSetupModal"
import youtubeLogo from "../assets/youtube.png";

const Home = () => {
  const navigate = useNavigate();
  const [playlistLink, setPlaylistLink] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  
  // State to trigger and populate the Modal
  const [modalData, setModalData] = useState(null);

  const handleConvert = async (e) => {
    e.preventDefault();
    if (!playlistLink || !playlistLink.includes("list=")) {
      alert("Please enter a valid YouTube playlist link.");
      return;
    }

    setIsConverting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/add-playlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          link: playlistLink,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem("currentCourse", JSON.stringify(data.structured));
        localStorage.setItem("currentPlaylistId", data.playlistId);
        
        setIsConverting(false);
        setModalData({
           playlistId: data.playlistId,
           totalVideos: data.totalVideos, 
           estimatedHours: data.estimatedHours,
           courseTitle: data.overview?.courseTitle || data.overview?.title || "Structured Course"
        });

      } else {
        alert(data.message || "Failed to process playlist");
        setIsConverting(false);
      }
    } catch (error) {
      console.error("Conversion failed", error);
      setIsConverting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-x-hidden bg-[#050505] font-sans text-white selection:bg-red-500/30">

      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#3d0000,transparent_50%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black to-black" />
      </div>
   
      <nav className="relative z-50 w-full max-w-7xl mx-auto px-4 pt-6">
        <div className="flex items-center justify-between bg-white/[0.03] backdrop-blur-2xl border border-white/10 px-6 py-3 rounded-full shadow-2xl">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="p-2.5 bg-red-600 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.4)] group-hover:scale-110 transition-transform duration-300">
              <BookOpen size={20} strokeWidth={2.5} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight leading-none">FOKUSFLOW <span className="text-red-600">AI</span></span>
              <span className="text-[7px] text-gray-500 font-bold uppercase tracking-[0.3em]">The Learning Engine</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-10 text-[11px] font-bold uppercase tracking-widest text-gray-400">
            <a href="#" className="text-white border-b-2 border-red-600 pb-0.5">Home</a>
            <a href="#" className="hover:text-white transition-colors">Platform</a>
            <a href="#" className="hover:text-white transition-colors">Resources</a>
            <a href="#" className="hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="flex items-center space-x-5">
            <Progress />
            <div className="h-10 w-10 rounded-full border border-white/10 bg-gradient-to-br from-neutral-800 to-black flex items-center justify-center font-bold text-red-500 hover:border-red-600/50 transition-all cursor-pointer">
              D
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-6 pt-20 pb-32">
        <div className="text-center space-y-8 max-w-4xl animate-slideUp">
          <div className="inline-flex items-center space-x-2 bg-red-600/10 border border-red-600/20 px-4 py-1.5 rounded-full text-red-500 text-[10px] font-bold uppercase tracking-[0.2em]">
            <Sparkles size={12} fill="currentColor" />
            <span>Next-Gen Academic Structuring</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.95]">
            Master Any Subject <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
              In Record Time.
            </span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            We turn chaotic YouTube playlists into <span className="text-white">curated courses</span> with AI quizzes, scheduling, and progress tracking.
          </p>
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleConvert}
          className="mt-16 w-full max-w-3xl relative animate-slideUp"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="relative flex flex-col md:flex-row items-center bg-[#0d0d0d]/80 backdrop-blur-md border border-white/10 p-2 rounded-3xl md:rounded-full group-focus-within:border-red-600/40 transition-all shadow-2xl">
            <div className="flex flex-1 items-center w-full px-4">
              <Search size={20} className="text-gray-500" />
              <input
                type="text"
                value={playlistLink}
                onChange={(e) => setPlaylistLink(e.target.value)}
                placeholder="Paste YouTube Playlist URL..."
                className="w-full bg-transparent border-none outline-none px-4 py-4 text-white placeholder:text-gray-600 font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={isConverting}
              className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl md:rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-[0_10px_20px_rgba(220,38,38,0.2)] disabled:opacity-50"
            >
              <span>{isConverting ? "Analyzing..." : "Generate Course"}</span>
              {!isConverting && <Zap size={16} fill="currentColor" />}
            </button>
          </div>

          <div className="mt-4 flex justify-center space-x-6 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><Layout size={12} /> Auto-Modules</span>
            <span className="flex items-center gap-1.5"><Trophy size={12} /> AI Assessments</span>
            <span className="flex items-center gap-1.5"><ArrowRight size={12} /> PDF Notes</span>
          </div>
        </form>

        <div className="mt-20 w-full max-w-5xl animate-slideUp" style={{ animationDelay: "0.4s" }}>
          <CourseProgress />
        </div>
      </main>

      {/* Loading Modal */}
      {isConverting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl">
          <div className="text-center animate-pulse">
            <div className="relative mb-8 flex justify-center">
              <div className="w-20 h-20 border-2 border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
              <BookOpen className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" size={24} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Structuring Knowledge</h2>
            <p className="text-gray-500 text-[10px] uppercase tracking-[0.4em] font-bold">Synthesizing transcripts into modules...</p>
          </div>
        </div>
      )}

      {/* AI Schedule Setup Modal */}
      <ScheduleSetupModal 
        isOpen={modalData !== null}
        onClose={() => setModalData(null)}
        playlistId={modalData?.playlistId}
        estimatedHours={modalData?.estimatedHours}
        totalVideos={modalData?.totalVideos}
        courseTitle={modalData?.courseTitle}
      />

    </div>
  );
};

export default Home;