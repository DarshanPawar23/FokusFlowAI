// src/components/Progress.jsx

import React, { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";

function Progress() {
  const [progress, setProgress] = useState([]);
  const [avg, setAvg] = useState(0);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/api/users/progress", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setProgress(data.data);

        // 🔥 calculate average %
        const valid = data.data.filter(p => p.percentage !== null);

        if (valid.length > 0) {
          const total = valid.reduce((sum, p) => sum + p.percentage, 0);
          setAvg(Math.round(total / valid.length));
        }
      }
    } catch (err) {
      console.error("❌ Progress fetch error:", err);
    }
  };

  return (
    <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 px-4 py-2 rounded-xl backdrop-blur-xl">
      
      <BarChart3 size={18} className="text-blue-400" />

      <div className="flex flex-col leading-tight">
        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
          Progress
        </span>

        <span className="text-sm font-black text-white">
          {avg}% 
        </span>
      </div>

      <div className="h-6 w-[1px] bg-white/10" />

      <span className="text-xs text-gray-400 font-bold">
        {progress.length} courses
      </span>
    </div>
  );
}

export default Progress;