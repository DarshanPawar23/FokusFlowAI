import React, { useEffect, useState, useRef, useCallback } from "react";
import { MessageSquare, Send } from "lucide-react";
import { useGroupStudy } from "../../hooks/useGroupStudy";
import { getRoomMessages } from "../../services/studyRoomApi";
import { socket } from "../../socket/socket";

export default function ChatPanel() {
  const {
    roomCode,
    messages,
    setMessages,
    currentUser,
  } = useGroupStudy();

  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  const myEmail =
    currentUser?.email || localStorage.getItem("email");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const fetchHistory = useCallback(async () => {
    if (!roomCode) return;

    try {
      const history = await getRoomMessages(roomCode);
      setMessages(history || []);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  }, [roomCode, setMessages]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  useEffect(() => {
    const handleNewMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.off("new-message");
    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, [setMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();

    if (!inputText.trim()) return;

    const message = {
      roomCode,
      user_id: currentUser?.id,
      email: myEmail,
      username:
        currentUser?.name ||
        localStorage.getItem("username") ||
        myEmail?.split("@")[0] ||
        "Student",
      message: inputText.trim(),
      created_at: new Date().toISOString(),
    };

    socket.emit("chat-message", message);

    setInputText("");
  };

  return (
    <div className="bg-[#111111] border border-white/10 rounded-2xl flex-1 flex flex-col overflow-hidden min-h-[280px]">

      <div className="p-4 border-b border-white/10">
        <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-gray-400">
          <MessageSquare size={14} />
          Live Discussion
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">

        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-600 text-xs uppercase tracking-[0.25em] font-bold">
            No Messages Yet
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe =
              msg.email === myEmail ||
              msg.user_id === currentUser?.id;

            return (
              <div
                key={msg.id || `${msg.created_at}-${index}`}
                className={`flex flex-col ${
                  isMe ? "items-end" : "items-start"
                }`}
              >
                <span className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider">
                  {isMe
                    ? "You"
                    : msg.username ||
                      msg.email?.split("@")[0] ||
                      "Student"}
                </span>

                <div
                  className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm break-words ${
                    isMe
                      ? "bg-red-600 text-white rounded-tr-sm"
                      : "bg-white/10 text-gray-200 rounded-tl-sm"
                  }`}
                >
                  {msg.message}
                </div>

                <span className="text-[9px] text-gray-600 mt-1">
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            );
          })
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="p-3 border-t border-white/10 bg-black/40 flex items-center gap-3"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-red-500 transition-all"
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-3 rounded-xl bg-red-600 hover:bg-red-500 disabled:bg-gray-700 disabled:opacity-50 transition-all"
        >
          <Send size={16} className="text-white" />
        </button>
      </form>

    </div>
  );
}