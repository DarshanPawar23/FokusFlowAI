import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, RotateCcw } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import CertificateButton from "../CertificateButton";

function Certificate() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const playlistId = localStorage.getItem("currentPlaylistId");

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:3000/api/users/progress", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();

        if (data.success) {
          const current = data.data.find(
            (p) => String(p.playlistId) === String(playlistId)
          );
          setProgress(current);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [playlistId]); // Added dependency

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] text-gray-400">
        Loading...
      </div>
    );
  }

  if (!progress || !progress.examId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-white space-y-6">
        <h2 className="text-2xl font-bold">No Exam Attempt Yet</h2>

        <button
          onClick={() => navigate("/exam")}
          className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest"
        >
          Take Exam
        </button>
      </div>
    );
  }

  const passed = progress.percentage >= 60;


  const confettiVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: i => ({
      scale: [0, 1.2, 1, 0],
      opacity: [0, 1, 1, 0],
      x: [0, (i * 20 - 60), (i * 30 - 90)],
      y: [0, (-40 - i * 15), (-60 - i * 20)],
      rotate: [0, 360],
      transition: {
        duration: 1.5,
        delay: i * 0.05 + 0.3,
        ease: "easeOut",
      }
    })
  };

  function ScoreCounter({ finalValue }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (shouldReduceMotion) {
        setCount(finalValue);
        return;
      }

      let start = 0;
      const duration = 1500;
      const interval = Math.floor(duration / finalValue);

      if (finalValue === 0) return;

      const counter = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === finalValue) {
          clearInterval(counter);
        }
      }, interval);

      return () => clearInterval(counter);
    }, [finalValue, shouldReduceMotion]);

    return (
      <motion.h1
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "backOut" }}
        className="text-7xl font-black tracking-tight"
      >
        {count}%
      </motion.h1>
    );
  }

  const pulseVariants = {
    initial: { opacity: 0.7, scale: 1 },
    animate: {
      opacity: [0.7, 1, 0.7],
      scale: [1, 1.03, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };


  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-white">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{ scale: 1.01, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)" }}
        className="bg-gradient-to-br from-[#121217] to-black border border-white/5 rounded-3xl p-10 w-full max-w-xl text-center shadow-3xl relative overflow-hidden"
      >

        <div className="relative mx-auto w-24 h-24 flex items-center justify-center mb-8">
          <div className={`absolute inset-0 rounded-2xl ${passed ? "bg-green-600/10" : "bg-red-600/10"
            }`} />

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: "backOut" }}
          >
            <Trophy
              size={48}
              className={passed ? "text-green-400" : "text-red-400"}
            />
          </motion.div>

          {passed && (
            <div className="absolute inset-0 flex items-center justify-center">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={confettiVariants}
                  initial="initial"
                  animate="animate"
                  className={`absolute w-3 h-1.5 rounded-full ${i % 3 === 0 ? "bg-green-400" : i % 2 === 0 ? "bg-yellow-400" : "bg-white"
                    }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* --- 3. Animated Score Counter --- */}
        <ScoreCounter finalValue={progress.percentage} />

        <p className="mt-4 text-gray-400 text-sm font-medium">
          Score {progress.score} / Attempts {progress.attempts}
        </p>

        {/* Status text with entry animation */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className={`mt-6 text-xl font-bold ${passed ? "text-green-400" : "text-red-400"
            }`}>
          {passed ? "You Passed 🎉" : "Minimum 60% Required"}
        </motion.p>

        {/* --- 4. Call to Action / Status Pill --- */}
        <div className="mt-10">

          {!passed && (
            <motion.button
              variants={pulseVariants}
              initial="initial"
              animate="animate"
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate("/exam")}
              className="flex items-center justify-center gap-2 mx-auto px-10 py-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-sm uppercase tracking-widest rounded-2xl transition duration-200"
            >
              <RotateCcw size={18} className="animate-spin-slow" />
              Retake Exam
            </motion.button>
          )}

          {passed && (
            <div className="flex flex-col items-center gap-6">

              <div className="px-8 py-4 bg-green-950/40 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-widest rounded-xl inline-flex items-center gap-2 shadow-inner">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Course Completed
              </div>

              <CertificateButton playlistId={playlistId} />

            </div>
          )}

        </div>

      </motion.div>

    </div>
  );
}

export default Certificate;