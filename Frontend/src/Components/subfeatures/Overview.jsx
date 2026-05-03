import React, { useEffect, useState } from "react";
import { Clock, Layers, BookOpen, Target, Award, CheckCircle2, Users, Star } from "lucide-react";
import { motion } from "framer-motion";

function Overview() {
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("courseOverview");
    if (saved) {
      try {
        setOverview(JSON.parse(saved));
      } catch (err) {
        console.error("Invalid overview data");
      }
    }
  }, []);

  if (!overview) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 animate-pulse">
        <p className="text-lg font-medium">Loading course insights...</p>
      </div>
    );
  }

  // Animation Variants
  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVars = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVars}
      className="max-w-5xl mx-auto space-y-12 pb-10"
    >
      {/* HEADER SECTION */}
      <motion.div variants={itemVars} className="border-b border-white/10 pb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-red-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter">Featured Course</span>
          <div className="flex text-yellow-500 items-center gap-1">
            <Star size={12} fill="currentColor" />
            <span className="text-xs font-medium text-gray-300">4.9 Instructor Rating</span>
          </div>
        </div>
        <h2 className="text-4xl font-extrabold text-white tracking-tight mb-4">
          {overview.courseTitle}
        </h2>
        <p className="text-gray-400 text-lg leading-relaxed max-w-3xl">
          {overview.shortDescription}
        </p>
      </motion.div>

      {/* KEY STATS GRID */}
      <motion.div variants={itemVars} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Clock, label: "Duration", value: `${overview.totalHours} hrs`, color: "text-blue-400" },
          { icon: Layers, label: "Sections", value: overview.totalSections, color: "text-purple-400" },
          { icon: BookOpen, label: "Lectures", value: overview.totalLectures, color: "text-emerald-400" },
          { icon: Award, label: "Level", value: overview.level, color: "text-red-400" },
        ].map((stat, i) => (
          <div key={i} className="group bg-gradient-to-b from-white/[0.07] to-transparent p-5 rounded-2xl border border-white/10 hover:border-red-500/50 transition-all duration-300">
            <div className={`flex items-center ${stat.color} mb-3`}>
              <stat.icon size={20} className="mr-2" />
              <span className="text-[10px] uppercase tracking-widest font-bold opacity-80">
                {stat.label}
              </span>
            </div>
            <p className="text-2xl font-bold text-white group-hover:scale-105 transition-transform origin-left">
              {stat.value}
            </p>
          </div>
        ))}
      </motion.div>

      {/* CORE LEARNING OBJECTIVES */}
      <motion.div variants={itemVars} className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-red-600 rounded-full" />
            <h3 className="text-xl font-bold text-white italic">Learning Objectives</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {overview.whatYouWillLearn?.map((item, index) => (
              <motion.div 
                whileHover={{ x: 5 }}
                key={index} 
                className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5"
              >
                <CheckCircle2 size={18} className="text-red-500 mt-1 flex-shrink-0" />
                <span className="text-gray-300 text-sm leading-snug">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* SIDEBAR INFO */}
        <div className="space-y-8 bg-white/[0.03] p-6 rounded-2xl border border-white/5">
          <div>
            <div className="flex items-center gap-2 mb-4 text-red-500">
              <Users size={18} />
              <h3 className="text-sm uppercase tracking-widest font-bold">Audience</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {overview.targetAudience}
            </p>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-widest font-bold text-white mb-4">Mastered Skills</h3>
            <div className="flex flex-wrap gap-2">
              {overview.skillsCovered?.map((skill, index) => (
                <span
                  key={index}
                  className="text-[11px] font-medium bg-red-600/10 text-red-400 px-3 py-1 rounded-md border border-red-600/20 hover:bg-red-600 hover:text-white transition-colors cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Overview;