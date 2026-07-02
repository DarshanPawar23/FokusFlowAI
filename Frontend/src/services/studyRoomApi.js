
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/study-room`;

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
};

export const createRoom = async (playlistId) => {
    const res = await fetch(`${API_BASE_URL}/create`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ playlistId }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || "Failed to create room");
    return data;
};

export const joinRoom = async (roomCode, playlistId) => {
  const res = await fetch(`${API_BASE_URL}/join`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      roomCode,
      playlistId,
    }),
  });

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.message || "Failed to join room");
  }

  return data;
};

export const leaveRoom = async (roomCode) => {
    const res = await fetch(`${API_BASE_URL}/leave`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ roomCode }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || "Failed to leave room");
    return data;
};

export const closeRoom = async (roomCode) => {
    const res = await fetch(`${API_BASE_URL}/close/${roomCode}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || "Failed to close room");
    return data;
};

export const getRoomDetails = async (roomCode) => {
    const res = await fetch(`${API_BASE_URL}/${roomCode}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || "Failed to fetch room details");
    return data.room;
};

export const getRoomMessages = async (roomCode) => {
    const res = await fetch(`${API_BASE_URL}/messages/${roomCode}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || "Failed to fetch messages");
    return data.messages;
};