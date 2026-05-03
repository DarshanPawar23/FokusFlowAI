import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import youtubeLogo from "../assets/youtube.png";
import { BookOpen } from "lucide-react"; // Note: Install lucide-react or use an SVG

function Registration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const response = await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setTimeout(() => navigate("/login"), 1000);
      } else {
        setError(data.message);
      }
    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen w-full flex relative overflow-hidden bg-black font-sans">
      {/* Moving Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-red-950 to-black animate-gradient"></div>

      {/* Subtle YouTube Rain (Acknowledging the source material) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <img
            key={i}
            src={youtubeLogo}
            alt="yt-rain"
            className="absolute opacity-10 animate-rain"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 15 + 15}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 6 + 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative w-full flex h-screen z-10">
        
        <div className="w-1/2 flex flex-col p-16 justify-between text-white bg-gradient-to-r from-black/80 to-transparent">
          <div className="flex items-center space-x-4">
             <div className="p-3 bg-red-600 rounded-xl shadow-xl shadow-red-600/20">
                <BookOpen size={28} strokeWidth={2.5} />
             </div>
             <span className="text-3xl font-black tracking-tighter uppercase italic">Fokusflow AI</span>
          </div>

          <div className="max-w-xl animate-slide">
            <h1 className="text-6xl font-black mb-6 leading-tight">
              Mastery Through <br />
              <span className="text-red-600">Discipline.</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed font-light">
              We transform the world's largest video library into your private AI-powered academy. No distractions. Just pure learning.
            </p>
            <div className="mt-8 flex gap-4">
              <span className="px-4 py-2 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10">AI-Gated Progress</span>
              <span className="px-4 py-2 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10">Smart Tutors</span>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 uppercase tracking-[0.3em] font-semibold">Engineering Mastery © 2026</div>
        </div>

        <div className="w-1/2 flex items-center justify-center p-12 bg-white/[0.03] backdrop-blur-2xl border-l border-white/10">
          <div className="w-full max-w-md space-y-10">
            <div className="space-y-2">
              <h2 className="text-5xl font-bold text-white tracking-tight">Begin Your Journey</h2>
              <p className="text-gray-400 text-lg">Create an account to start your structured course.</p>
            </div>

            {message && <p className="p-4 bg-green-500/10 border border-green-500/50 text-green-400 rounded-xl text-sm animate-pulse">{message}</p>}
            {error && <p className="p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl text-sm">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="group space-y-2">
                <label className="text-sm uppercase text-gray-400 font-black tracking-widest group-focus-within:text-red-500 transition-colors">
                 Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@gmail.com"
                  className="w-full bg-transparent border-b-2 border-white/10 text-white py-4 outline-none focus:border-red-600 transition-all text-xl font-medium placeholder:text-white/20"
                />
              </div>

              <div className="group space-y-2">
                <label className="text-sm uppercase text-gray-400 font-black tracking-widest group-focus-within:text-red-500 transition-colors">
                  Access Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-transparent border-b-2 border-white/10 text-white py-4 outline-none focus:border-red-600 transition-all text-xl font-medium placeholder:text-white/20"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 py-5 rounded-2xl font-black text-white transition-all transform hover:scale-[1.01] active:scale-95 shadow-2xl shadow-red-600/40 text-lg tracking-widest uppercase"
              >
                Create My Academy
              </button>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full text-center text-gray-400 hover:text-white transition-colors font-medium"
              >
                Returning Student? <span className="text-red-500 font-bold border-b border-red-500/30 hover:border-red-500 pb-1">Login here</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes rain {
            0% { transform: translateY(-15vh) rotate(0deg); opacity: 0; }
            20% { opacity: 0.15; }
            80% { opacity: 0.15; }
            100% { transform: translateY(115vh) rotate(360deg); opacity: 0; }
          }
          @keyframes slide {
            0% { opacity: 0; transform: translateX(-30px); }
            100% { opacity: 1; transform: translateX(0); }
          }
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-rain { animation: rain linear infinite; }
          .animate-slide { animation: slide 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradientMove 12s ease infinite;
          }
        `}
      </style>
    </div>
  );
}

export default Registration;