import React, { useState } from "react";
import {
  Copy,
  Check,
  Hash,
  Wifi,
  WifiOff,
  Crown,
  LogOut,
  ShieldAlert,
} from "lucide-react";

import { useGroupStudy } from "../../hooks/useGroupStudy";
import { leaveRoom, closeRoom } from "../../services/studyRoomApi";
import { socket } from "../../socket/socket";

export default function RoomCodeCard() {
  const {
    roomCode,
    connected,
    isHost,
    resetRoom,
  } = useGroupStudy();

  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!roomCode) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLeave = async () => {
    try {
      setLoading(true);

      if (isHost) {
        await closeRoom(roomCode);
        socket.emit("room-closed", roomCode);
      } else {
        await leaveRoom(roomCode);
        socket.emit("leave-room", roomCode);
      }

      socket.disconnect();

      localStorage.removeItem("studyRoom");

      resetRoom();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#111111] p-5">

      <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 hover:opacity-100" />

      <div className="relative z-10 flex items-center justify-between">

        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">
            Group Study
          </p>

          <div className="mt-2 flex items-center gap-2">

            <div
              className={`flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                connected
                  ? "border-green-500/30 bg-green-500/10 text-green-400"
                  : "border-red-500/30 bg-red-500/10 text-red-400"
              }`}
            >
              {connected ? (
                <Wifi size={12} />
              ) : (
                <WifiOff size={12} />
              )}

              {connected ? "Connected" : "Offline"}
            </div>

            {isHost && (
              <div className="flex items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-yellow-400">
                <Crown size={12} />
                Host
              </div>
            )}

          </div>
        </div>

      </div>

      <div className="relative z-10 mt-5">

        <div className="mb-3 flex items-center justify-between">

          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
            <Hash size={12} />
            Room Code
          </div>

          {copied && (
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-400">
              Copied
            </span>
          )}

        </div>

        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/50 px-4 py-4">

          <span className="font-mono text-3xl font-black tracking-[0.28em] text-white">
            {roomCode}
          </span>

          <button
            onClick={handleCopy}
            className={`rounded-lg p-2 transition-all ${
              copied
                ? "bg-green-500/20 text-green-400"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            {copied ? (
              <Check size={18} />
            ) : (
              <Copy size={18} />
            )}
          </button>

        </div>

      </div>

      <button
        onClick={handleLeave}
        disabled={loading}
        className={`relative z-10 mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-black uppercase tracking-[0.22em] transition-all ${
          isHost
            ? "bg-red-600 hover:bg-red-500 text-white"
            : "bg-white/5 hover:bg-red-500/20 border border-white/10 text-gray-300 hover:text-red-400"
        }`}
      >
        {isHost ? (
          <>
            <ShieldAlert size={16} />
            Close Room
          </>
        ) : (
          <>
            <LogOut size={16} />
            Leave Room
          </>
        )}
      </button>

    </div>
  );
}