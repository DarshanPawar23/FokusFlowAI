import React, { useState } from "react";
import { ArrowLeft, Loader2, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { joinRoom } from "../../services/studyRoomApi";
import { socket } from "../../socket/socket";
import { useGroupStudy } from "../../hooks/useGroupStudy";

export default function JoinRoom({ onBack }) {
  const navigate = useNavigate();

  const {
    setRoomCode,
    setRoomId,
    setHostId,
    currentUser,
    setIsModalOpen,
  } = useGroupStudy();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = async (e) => {
    e.preventDefault();

    if (code.trim().length !== 6) {
      setError("Please enter a valid room code.");
      return;
    }

    const playlistId = Number(
      localStorage.getItem("currentPlaylistId")
    );

    if (!playlistId) {
      setError("Please open a course before joining a study room.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await joinRoom(
        code.trim().toUpperCase(),
        playlistId
      );

      setRoomCode(data.roomCode);
      setRoomId(data.roomId);
      setHostId(data.hostId);

      localStorage.setItem(
        "groupStudyRoom",
        JSON.stringify({
          roomId: data.roomId,
          roomCode: data.roomCode,
          hostId: data.hostId,
          playlistId: data.playlistId,
          maxMembers: data.maxMembers || 4,
        })
      );

      if (!socket.connected) {
        socket.connect();
      }

      socket.emit("join-room", {
        roomCode: data.roomCode,
        userId: currentUser?.id || data.userId,
        username:
          currentUser?.email ||
          currentUser?.name ||
          localStorage.getItem("email") ||
          "Student",
      });

      setIsModalOpen(false);

      navigate("/main");

    } catch (err) {
      setError(err.message || "Unable to join room.");
    } finally {
      setLoading(false);
    }
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

      <form
        onSubmit={handleJoin}
        className="flex flex-col flex-1"
      >

        <p className="text-gray-400 text-center leading-7 mb-8">
          Enter the 6-character room code shared by the host to join the synchronized study session.
        </p>

        <input
          type="text"
          value={code}
          onChange={(e) =>
            setCode(
              e.target.value
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, "")
            )
          }
          maxLength={6}
          placeholder="ENTER CODE"
          className="w-full bg-[#111111] border border-white/10 focus:border-blue-500 rounded-xl px-6 py-5 text-center text-3xl font-black tracking-[0.35em] uppercase outline-none transition-all placeholder:text-gray-700 mb-6"
        />

        {error && (
          <p className="text-red-500 text-sm text-center font-semibold mb-6">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || code.length !== 6}
          className="mt-auto w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:opacity-50 text-white py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all"
        >
          {loading ? (
            <>
              <Loader2
                size={20}
                className="animate-spin"
              />
              Joining...
            </>
          ) : (
            <>
              <LogIn size={18} />
              Join Session
            </>
          )}
        </button>

      </form>

    </div>
  );
}