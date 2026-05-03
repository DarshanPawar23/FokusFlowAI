import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlayCircle, Clock } from "lucide-react";
import youtubeLogo from "../assets/youtube.png";

function CourseProgress() {
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();
    console.log("CourseProgress mounted");
    useEffect(() => {
        fetchCourses();
    }, []);
    useEffect(() => {
    console.log("COURSES FROM API ", courses);
}, [courses]);

    const fetchCourses = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) return;

            const res = await fetch("http://localhost:3000/api/users/all-courses", {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await res.json();

            if (data.success) {
                setCourses(data.courses);
            }
        } catch (err) {
            console.error("Fetch courses error:", err);
        }
    };

    const handleDelete = async (playlistId) => {
        const token = localStorage.getItem("token");

        await fetch(
            `http://localhost:3000/api/users/delete-playlist/${playlistId}`,
            {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        fetchCourses(); // refresh after delete
    };

    return (
        <div
            className="mt-20 w-full max-w-4xl px-6 animate-slideUp"
            style={{ animationDelay: "0.4s" }}
        >
            <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center">
                <PlayCircle size={14} className="mr-2 text-red-600" />
                Current Course Progress
            </h3>

            <div className="space-y-4">
                {courses.length === 0 && (
                    <p className="text-gray-500 text-sm">No courses yet</p>
                )}

                {courses.map((course) => (
                    <div
                        key={course.id}
                        className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] flex items-center justify-between group hover:bg-white/[0.04] transition-all"
                    >

                        <div
                            onClick={() => {
                                localStorage.setItem("currentPlaylistId", course.id);
                                localStorage.setItem(
                                    "currentCourse",
                                    JSON.stringify(course.structured_data)
                                );

                                navigate("/Main");
                            }}
                            className="flex items-center space-x-6 cursor-pointer"
                        >
                            <div className="w-24 h-14 bg-gradient-to-br from-gray-800 to-black rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
                                <img
                                    src={
                                        course.thumbnail ||
                                        `https://img.youtube.com/vi/${course.structured_data?.[0]?.videos?.[0]?.videoId}/hqdefault.jpg`
                                    }
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"
                                    alt="course"
                                />
                            </div>

                            <div>
                                <h4 className="font-bold text-lg text-white group-hover:text-red-500 transition-colors">
                                    {course.structured_data?.[0]?.sectionTitle || "Course"}
                                </h4>

                                <div className="flex items-center space-x-4 mt-1 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                    <span className="flex items-center">
                                        <Clock size={12} className="mr-1" />
                                        Ongoing Session
                                    </span>
                                    <span className="text-red-500">View Roadmap</span>
                                </div>
                            </div>
                        </div>


                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => {
                                    localStorage.setItem("currentPlaylistId", course.id);
                                    localStorage.setItem(
                                        "currentCourse",
                                        JSON.stringify(course.structured_data)
                                    );

                                    navigate("/Main");
                                }}
                                className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                            >
                                Resume
                            </button>

                            {/* DELETE */}
                            <button
                                onClick={() => handleDelete(course.id)}
                                className="px-3 py-3 bg-red-600/20 border border-red-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CourseProgress;