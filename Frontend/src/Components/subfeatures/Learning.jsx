import React, { useEffect, useState } from "react";
import { FileText, ExternalLink } from "lucide-react";

function Learning() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const savedNotes = localStorage.getItem("courseNotes");

    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  if (!notes || notes.length === 0) {
    return (
      <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-center">
        <p className="text-gray-500 text-sm">
          No notes available for this course yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center text-white mb-2">
        <FileText size={18} className="mr-2 text-red-600" />
        <span className="font-bold uppercase tracking-widest text-[10px]">
          Recommended Study PDFs
        </span>
      </div>

      {notes.map((note, index) => (
        <a
          key={index}
          href={note.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-red-600/50 transition-all duration-300"
        >
          <div className="flex items-center space-x-3">
            <FileText size={18} className="text-red-600" />
            <span className="text-sm text-white group-hover:text-red-500 transition-colors line-clamp-1">
              {note.title}
            </span>
          </div>

          <ExternalLink
            size={16}
            className="text-gray-500 group-hover:text-white transition-colors"
          />
        </a>
      ))}
    </div>
  );
}

export default Learning;