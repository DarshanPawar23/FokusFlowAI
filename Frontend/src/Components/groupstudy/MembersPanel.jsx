import React, { useEffect, useState, useCallback } from "react";
import { Users, Crown, User } from "lucide-react";
import { useGroupStudy } from "../../hooks/useGroupStudy";
import { getRoomDetails } from "../../services/studyRoomApi";
import { socket } from "../../socket/socket";

export default function MembersPanel() {
  const {
    roomCode,
    hostId,
    members,
    setMembers,
    currentUser,
  } = useGroupStudy();

  const [loading, setLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    if (!roomCode) return;

    try {
      setLoading(true);

      const room = await getRoomDetails(roomCode);

      setMembers(room.members || []);
    } catch (err) {
      console.error("Failed to load members:", err);
    } finally {
      setLoading(false);
    }
  }, [roomCode, setMembers]);

  useEffect(() => {
    fetchMembers();

    socket.on("user-joined", fetchMembers);
    socket.on("user-left", fetchMembers);
    socket.on("room-closed", fetchMembers);

    return () => {
      socket.off("user-joined", fetchMembers);
      socket.off("user-left", fetchMembers);
      socket.off("room-closed", fetchMembers);
    };
  }, [fetchMembers]);

  return (
    <div className="bg-[#111111] border border-white/10 rounded-2xl p-4 flex flex-col flex-shrink-0 max-h-60 overflow-hidden">

      <div className="flex items-center justify-between mb-4">
        <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-gray-400">
          <Users size={14} />
          Participants
        </h3>

        <span className="text-xs font-bold text-white">
          {members.length}/4
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 no-scrollbar">

        {loading ? (
          <div className="flex justify-center py-8 text-sm text-gray-500">
            Loading...
          </div>
        ) : members.length === 0 ? (
          <div className="flex justify-center py-8 text-sm text-gray-500">
            No members joined.
          </div>
        ) : (
          members.map((member) => (
            <div
              key={member.user_id}
              className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 hover:border-red-500/20 transition-all"
            >

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center">
                  <User
                    size={15}
                    className="text-gray-400"
                  />
                </div>

                <div className="flex flex-col">

                  <span className="text-sm font-semibold text-white">
                    {member.email?.split("@")[0] ||
                      `User ${member.user_id}`}

                    {currentUser?.id === member.user_id &&
                      " (You)"}
                  </span>

                  {member.user_id === hostId && (
                    <span className="text-[10px] uppercase tracking-widest font-bold text-yellow-400">
                      Host
                    </span>
                  )}

                </div>

              </div>

              {member.user_id === hostId && (
                <Crown
                  size={16}
                  className="text-yellow-400"
                />
              )}

            </div>
          ))
        )}

      </div>

    </div>
  );
}