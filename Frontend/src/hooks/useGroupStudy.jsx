import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { socket } from "../socket/socket";

const GroupStudyContext = createContext();

export const GroupStudyProvider = ({ children }) => {
  const [roomId, setRoomId] = useState(null);
  const [roomCode, setRoomCode] = useState(null);
  const [playlistId, setPlaylistId] = useState(null);
  const [hostId, setHostId] = useState(null);
  const [maxMembers, setMaxMembers] = useState(4);
  const [roomStatus, setRoomStatus] = useState("inactive");

  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);

  const [connected, setConnected] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState(() => ({
    id: Number(localStorage.getItem("userId")),
    email: localStorage.getItem("email"),
    name:
      localStorage.getItem("username") ||
      localStorage.getItem("email") ||
      "Student",
  }));

  const isHost = currentUser?.id === hostId;


  useEffect(() => {
    const savedRoom = localStorage.getItem("groupStudyRoom");

    if (!savedRoom) return;

    try {
      const room = JSON.parse(savedRoom);

      setRoomId(room.roomId);
      setRoomCode(room.roomCode);
      setPlaylistId(room.playlistId);
      setHostId(room.hostId);
      setMaxMembers(room.maxMembers || 4);
      setRoomStatus("active");
    } catch (err) {
      console.error(err);
      localStorage.removeItem("groupStudyRoom");
    }
  }, []);


  useEffect(() => {
    if (!roomCode || !currentUser?.id) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join-room", {
      roomCode,
      userId: currentUser.id,
      username: currentUser.name,
      reconnect: true,
    });
  }, [roomCode, currentUser]);


  useEffect(() => {
    const onConnect = () => setConnected(true);

    const onDisconnect = () => setConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    if (socket.connected) {
      setConnected(true);
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() => {
    if (!roomCode) return;

    localStorage.setItem(
      "groupStudyRoom",
      JSON.stringify({
        roomId,
        roomCode,
        playlistId,
        hostId,
        maxMembers,
      })
    );
  }, [
    roomId,
    roomCode,
    playlistId,
    hostId,
    maxMembers,
  ]);


  const resetRoom = () => {
    localStorage.removeItem("groupStudyRoom");

    if (socket.connected) {
      socket.emit("leave-room", {
        roomCode,
        userId: currentUser?.id,
      });

      socket.disconnect();
    }

    setRoomId(null);
    setRoomCode(null);
    setPlaylistId(null);
    setHostId(null);
    setMaxMembers(4);

    setRoomStatus("inactive");

    setMembers([]);
    setMessages([]);

    setLoading(false);
    setError(null);

    setConnected(false);
  };

  return (
    <GroupStudyContext.Provider
      value={{
        roomId,
        setRoomId,

        roomCode,
        setRoomCode,

        playlistId,
        setPlaylistId,

        hostId,
        setHostId,

        maxMembers,
        setMaxMembers,

        roomStatus,
        setRoomStatus,

        members,
        setMembers,

        messages,
        setMessages,

        connected,

        loading,
        setLoading,

        error,
        setError,

        currentUser,
        setCurrentUser,

        isHost,

        isModalOpen,
        setIsModalOpen,

        resetRoom,
      }}
    >
      {children}
    </GroupStudyContext.Provider>
  );
};

export const useGroupStudy = () => {
  const context = useContext(GroupStudyContext);

  if (!context) {
    throw new Error(
      "useGroupStudy must be used inside GroupStudyProvider"
    );
  }

  return context;
};