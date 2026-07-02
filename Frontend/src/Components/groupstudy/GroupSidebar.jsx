import React from "react";
import { useGroupStudy } from "../../hooks/useGroupStudy";
import MembersPanel from "./MembersPanel";
import ChatPanel from "./ChatPanel";

export default function GroupSidebar() {
  const { roomCode } = useGroupStudy();

  if (!roomCode) return null;

  return (
    <div className="h-full flex flex-col gap-4">

      <MembersPanel />

      <div className="flex-1 min-h-0">
        <ChatPanel />
      </div>

    </div>
  );
}