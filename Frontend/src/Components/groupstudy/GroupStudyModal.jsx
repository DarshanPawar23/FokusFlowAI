import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Users, X, PlusCircle, LogIn } from "lucide-react";
import { useGroupStudy } from "../../hooks/useGroupStudy";
import CreateRoom from "./CreateRoom";
import JoinRoom from "./JoinRoom";

export default function GroupStudyModal() {
  const { isModalOpen, setIsModalOpen } = useGroupStudy();
  const [view, setView] = useState("menu");

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  const handleClose = () => {
    setView("menu");
    setIsModalOpen(false);
  };

  if (!isModalOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0b] shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-red-600 p-2">
                <Users size={20} />
              </div>

              <div>
                <h2 className="text-lg font-black uppercase tracking-widest">
                  Group Study
                </h2>

                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Learn Together
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="rounded-full border border-white/10 bg-white/5 p-2 transition hover:bg-white/10"
            >
              <X size={16} />
            </button>
          </div>

          <div className="min-h-[320px] p-6">
            <AnimatePresence mode="wait">
              {view === "menu" && (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <button
                    onClick={() => setView("create")}
                    className="group w-full rounded-2xl border border-white/10 bg-[#111111] p-6 text-left transition-all duration-300 hover:border-red-500/40 hover:bg-white hover:text-black"
                  >
                    <div className="flex items-center gap-5">
                      <div className="rounded-xl bg-red-500/20 p-3 text-red-500 transition-all group-hover:bg-red-500 group-hover:text-white">
                        <PlusCircle size={24} />
                      </div>

                      <div>
                        <h3 className="text-lg font-black">
                          Create Room
                        </h3>

                        <p className="mt-1 text-sm font-medium opacity-70">
                          Host a synchronized study session
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setView("join")}
                    className="group w-full rounded-2xl border border-white/10 bg-[#111111] p-6 text-left transition-all duration-300 hover:border-blue-500/40 hover:bg-white hover:text-black"
                  >
                    <div className="flex items-center gap-5">
                      <div className="rounded-xl bg-blue-500/20 p-3 text-blue-500 transition-all group-hover:bg-blue-500 group-hover:text-white">
                        <LogIn size={24} />
                      </div>

                      <div>
                        <h3 className="text-lg font-black">
                          Join Room
                        </h3>

                        <p className="mt-1 text-sm font-medium opacity-70">
                          Enter a room code to study together
                        </p>
                      </div>
                    </div>
                  </button>
                </motion.div>
              )}

              {view === "create" && (
                <motion.div
                  key="create"
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -25 }}
                >
                  <CreateRoom onBack={() => setView("menu")} />
                </motion.div>
              )}

              {view === "join" && (
                <motion.div
                  key="join"
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -25 }}
                >
                  <JoinRoom onBack={() => setView("menu")} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}