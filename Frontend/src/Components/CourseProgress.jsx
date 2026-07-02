import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlayCircle, Clock, Trash2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function CourseProgress() {
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/all-courses`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setCourses(data.courses);
            }
        } catch (err) { console.error("Fetch courses error:", err); }
    };

    const handleDelete = async (playlistId) => {
        const token = localStorage.getItem("token");
        await fetch(`${import.meta.env.VITE_API_URL}/api/users/delete-playlist/${playlistId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchCourses(); 
    };

    return (
        <div className="mt-12 w-full max-w-5xl px-6">
            <motion.h3 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8 flex items-center"
            >
                <PlayCircle size={14} className="mr-2 text-red-600" />
                Current Course Progress
            </motion.h3>

            <div className="space-y-4">
                <AnimatePresence>
                    {courses.map((course) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#111111] border border-white/5 p-6 rounded-[2rem] flex items-center justify-between group hover:border-red-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-red-900/10"
                        >
                            <div className="flex items-center space-x-6">
                                {/* FIXED: Thumbnail rendering logic */}
                                <div className="w-24 h-14 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden bg-zinc-900">
                                    <img
                                        src={course.thumbnail || `https://img.youtube.com/vi/${course.structured_data?.[0]?.videos?.[0]?.videoId}/hqdefault.jpg`}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500"
                                        alt="Thumbnail"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                                    />
                                </div>

                                <div>
                                    <h4 className="font-bold text-lg text-white group-hover:text-red-400 transition-colors">
                                        {course.structured_data?.[0]?.sectionTitle || "Course Module"}
                                    </h4>
                                    <div className="flex items-center mt-1 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                        <Clock size={10} className="mr-1 text-orange-500" />
                                        Ongoing Session
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => {
                                        localStorage.setItem("currentPlaylistId", course.id);
                                        localStorage.setItem("currentCourse", JSON.stringify(course.structured_data));
                                        navigate("/Main");
                                    }}
                                    className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center gap-2"
                                >
                                    Resume <ArrowRight size={10} />
                                </button>

                                <button
                                    onClick={() => handleDelete(course.id)}
                                    className="p-3 bg-red-600/10 border border-red-500/20 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
export default CourseProgress;