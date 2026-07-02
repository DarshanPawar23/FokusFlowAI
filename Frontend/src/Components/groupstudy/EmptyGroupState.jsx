import React from "react";
import { Users, PlusCircle, LogIn } from "lucide-react";
import { useGroupStudy } from "../../hooks/useGroupStudy";

function EmptyGroupState() {
  const { setIsModalOpen } = useGroupStudy();

  return (
    <div className="h-full flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-[#111111] border border-white/10 rounded-3xl p-8 text-center">

        <div className="w-20 h-20 mx-auto rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center">
          <Users size={36} className="text-red-500" />
        </div>

        <h2 className="mt-6 text-2xl font-black uppercase tracking-wider text-white">
          Group Study
        </h2>

        <p className="mt-4 text-sm leading-7 text-gray-400">
          Study together in real time with synchronized video playback,
          live discussion and collaborative learning.
        </p>

        <div className="mt-8 space-y-3">

          <div className="flex items-center gap-3 bg-black/40 border border-white/5 rounded-xl p-4">
            <div className="w-10 h-10 rounded-lg bg-red-600/10 flex items-center justify-center">
              <PlusCircle size={20} className="text-red-500" />
            </div>

            <div className="text-left">
              <h3 className="text-sm font-bold text-white">
                Create Room
              </h3>
              <p className="text-xs text-gray-500">
                Become the host and invite friends.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-black/40 border border-white/5 rounded-xl p-4">
            <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center">
              <LogIn size={20} className="text-blue-500" />
            </div>

            <div className="text-left">
              <h3 className="text-sm font-bold text-white">
                Join Room
              </h3>
              <p className="text-xs text-gray-500">
                Enter a room code shared by your friend.
              </p>
            </div>
          </div>

        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-8 w-full py-4 rounded-xl bg-red-600 hover:bg-red-500 transition-all duration-300 font-black uppercase tracking-widest text-sm text-white shadow-lg shadow-red-600/20"
        >
          Create / Join Room
        </button>

      </div>

    </div>
  );
}

export default EmptyGroupState;