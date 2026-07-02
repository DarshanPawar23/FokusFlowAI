import React, { useState } from "react";
import { ArrowLeft, Loader2, Copy, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createRoom } from "../../services/studyRoomApi";
import { socket } from "../../socket/socket";
import { useGroupStudy } from "../../hooks/useGroupStudy";

export default function CreateRoom({ onBack }) {
  const navigate = useNavigate();

  const {
    setRoomCode,
    setRoomId,
    setHostId,
    currentUser,
    setIsModalOpen,
  } = useGroupStudy();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedData, setGeneratedData] = useState(null);

  const handleCreate = async () => {
    try {
      setLoading(true);
      setError("");

      const playlistId = localStorage.getItem("currentPlaylistId");

      if (!playlistId) {
        throw new Error("No active course found.");
      }

      const data = await createRoom(Number(playlistId));

      setGeneratedData(data);

      setRoomCode(data.roomCode);
      setRoomId(data.roomId);
      setHostId(data.hostId);

      localStorage.setItem("roomCode", data.roomCode);
      localStorage.setItem("roomId", data.roomId);
      localStorage.setItem("hostId", data.hostId);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartStudy = () => {
    if (!generatedData) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join-room", {
      roomCode: generatedData.roomCode,
      userId: generatedData.hostId,
      username:
        currentUser?.email ||
        currentUser?.name ||
        localStorage.getItem("email") ||
        "Student",
    });

    localStorage.setItem("groupStudyActive", "true");

    setIsModalOpen(false);

    navigate("/main");
  };

  return (
    <div className="flex flex-col h-full">
      <button
        onClick={onBack}
        className="w-fit flex items-center gap-2 mb-6 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {!generatedData ? (
        <div className="flex flex-col items-center justify-center flex-1 text-center">
          <p className="text-gray-400 mb-8 leading-7">
            Generate a secure room code and invite up to 4 members to study
            together in real-time with synchronized playback and live chat.
          </p>

          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 transition-all font-black uppercase tracking-widest flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Creating...
              </>
            ) : (
              "Generate Room"
            )}
          </button>

          {error && (
            <p className="mt-5 text-red-500 text-sm font-medium">{error}</p>
          )}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center flex-1 animate-in fade-in zoom-in duration-300">
          <p className="text-green-400 text-xs uppercase tracking-[0.25em] font-bold mb-4">
            Room Created Successfully
          </p>

          <div className="relative w-full bg-[#111111] border border-white/10 rounded-2xl py-8 mb-8 flex flex-col items-center">
            <h1 className="text-5xl font-black tracking-[0.35em] font-mono text-white">
              {generatedData.roomCode}
            </h1>

            <button
              onClick={() =>
                navigator.clipboard.writeText(generatedData.roomCode)
              }
              className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
            >
              <Copy size={16} />
            </button>
          </div>

          <div className="w-full space-y-3 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Room ID</span>
              <span className="font-semibold">{generatedData.roomId}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Members</span>
              <span className="font-semibold">
                {generatedData.currentMembers}/{generatedData.maxMembers}
              </span>
            </div>
          </div>

          <button
            onClick={handleStartStudy}
            className="w-full py-4 rounded-xl bg-white hover:bg-gray-200 text-black font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all"
          >
            <Play size={18} />
            Enter Room
          </button>
        </div>
      )}
    </div>
  );
}