import React, { useEffect, useState } from "react";

function Notes() {
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState([]);
  const [filterType, setFilterType] = useState("current");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const currentVideo = JSON.parse(localStorage.getItem("currentVideo"));

  const playlistId = currentVideo?.playlistId;
  const videoId = currentVideo?.videoId;

  const fetchNotes = async () => {
    if (!playlistId) return;

    try {
      setLoading(true);

      let url = "";

      if (filterType === "current") {
        url = `http://localhost:3000/api/users/get-Notes?playlistId=${playlistId}&videoId=${videoId}&type=current`;
      } else {
        url = `http://localhost:3000/api/users/get-Notes?playlistId=${playlistId}`;
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setNotes(data.notes);
      }

    } catch (error) {
      console.error("Fetch notes error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [filterType, playlistId, videoId]);

  const handleAddNote = async () => {
    if (!noteText.trim() || !playlistId || !videoId) return;

    try {
      const res = await fetch(
        "http://localhost:3000/api/users/add-Note",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            playlistId,
            videoId,
            noteText: noteText,
            timestamp: 0
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setNoteText("");
        fetchNotes();
      }

    } catch (error) {
      console.error("Add note error:", error);
    }
  };

  return (
    <div className="space-y-6">

      <div className="bg-white/5 p-4 rounded-xl border border-white/10">
        <textarea
          placeholder="Create a new note..."
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          className="w-full bg-black/40 p-3 rounded-lg text-sm outline-none border border-white/10 focus:border-red-600"
        />

        <button
          onClick={handleAddNote}
          className="mt-3 bg-red-600 px-4 py-2 text-xs uppercase font-bold rounded-lg hover:bg-red-700 transition"
        >
          Save Note
        </button>
      </div>

      <div className="flex space-x-4 text-xs">
        <button
          onClick={() => setFilterType("current")}
          className={`px-3 py-1 rounded ${filterType === "current"
              ? "bg-red-600 text-white"
              : "bg-white/10 text-gray-400"
            }`}
        >
          Current Lecture
        </button>

        <button
          onClick={() => setFilterType("all")}
          className={`px-3 py-1 rounded ${filterType === "all"
              ? "bg-red-600 text-white"
              : "bg-white/10 text-gray-400"
            }`}
        >
          All Lectures
        </button>
      </div>

      <div className="space-y-4">

        {loading && (
          <p className="text-gray-500 text-sm animate-pulse">
            Loading notes...
          </p>
        )}

        {!loading && notes.length === 0 && (
          <p className="text-gray-500 text-sm">
            No notes available.
          </p>
        )}

        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-white/5 p-4 rounded-xl border border-white/10"
          >
            <p className="text-sm text-gray-200">
              {note.note_text}
            </p>

            <span className="text-xs text-gray-500 block mt-2">
              {new Date(note.created_at).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Notes;

