import React, { useEffect, useState } from "react";
import { BookOpen, CalendarDays, Loader2, Clock, CheckCircle2, PlayCircle, Settings, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { UpdatePlanModal } from "../Components/UpdatePlanModal";

function ScheduleDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateModal, setUpdateModal] = useState({ isOpen: false, course: null });
  const navigate = useNavigate();

  useEffect(() => { fetchAllCoursesAndSchedules(); }, []);

  const fetchAllCoursesAndSchedules = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/all-courses`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      const plans = await Promise.all(data.courses.map(async (c) => {
        const pRes = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${c.id}`, { headers: { Authorization: `Bearer ${token}` } });
        const pData = await pRes.json();
        return { ...c, studyPlan: pData.success ? pData.studyPlan : null };
      }));
      setCourses(plans);
      setLoading(false);
    } catch (err) { setLoading(false); }
  };

  const handleUpdate = async (planId, targetDays) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/study/reschedule/${planId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ targetDays })
    });
    if (res.ok) {
      setUpdateModal({ isOpen: false, course: null });
      fetchAllCoursesAndSchedules();
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-red-600" size={40} /></div>;

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white p-8 overflow-hidden">
      {/* Fancy Animated Header */}
      <motion.nav
        initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-16 flex items-center justify-between"
      >
        <h1 className="text-5xl font-black tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
          FOKUSFLOW<span className="text-red-600">.</span>AI
        </h1>
        <div className="px-6 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-bold uppercase tracking-widest">Dashboard</div>
      </motion.nav>

      <motion.div
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.2 } } }}
        initial="hidden" animate="show"
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {courses.map((course) => (
          <motion.div
            key={course.id}
            variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
            className="group relative bg-[#111111] border border-white/5 rounded-[2rem] overflow-hidden flex flex-col hover:border-red-500/30 transition-all duration-500 shadow-2xl"
          >
            {/* Animated Thumbnail */}
            <div className="h-48 overflow-hidden relative">
              <img
                src={course.thumbnail || `https://img.youtube.com/vi/${course.structured_data?.[0]?.videos?.[0]?.videoId}/hqdefault.jpg`}
                alt="Thumbnail"
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                onError={(e) => { e.target.src = "https://via.placeholder.com/480x270"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent" />
            </div>

            <div className="p-8 flex flex-col flex-grow">
              <h3 className="font-black text-xl mb-8 leading-snug">{course.studyPlan?.courseTitle || "Structured Course"}</h3>

              {course.studyPlan ? (
                <div className="flex flex-col gap-3 mt-auto">
                  <button
                    onClick={() => navigate('/main')}
                    className="flex items-center justify-between w-full py-4 px-6 bg-white/5 rounded-2xl text-xs font-bold uppercase hover:bg-white hover:text-black transition-all"
                  >
                    View Plan <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={() => setUpdateModal({ isOpen: true, course })}
                    className="flex items-center justify-between w-full py-4 px-6 bg-red-600 rounded-2xl text-xs font-black uppercase hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                  >
                    Update Schedule <Settings size={14} />
                  </button>
                </div>
              ) : (
                <button className="w-full py-5 bg-red-600 rounded-2xl font-black uppercase text-xs tracking-widest animate-pulse">Generate Plan</button>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <UpdatePlanModal
        isOpen={updateModal.isOpen}
        onClose={() => setUpdateModal({ isOpen: false, course: null })}
        course={updateModal.course}
        onUpdate={handleUpdate}
      />
    </div>
  );
}

export default ScheduleDashboard;