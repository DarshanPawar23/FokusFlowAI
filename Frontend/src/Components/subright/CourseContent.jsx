import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, PlayCircle } from "lucide-react";

function CourseContent() {
  const [sections, setSections] = useState([]);
  const [openSection, setOpenSection] = useState(null);

  useEffect(() => {
    const savedCourse = localStorage.getItem("currentCourse");
    if (savedCourse) {
      setSections(JSON.parse(savedCourse));
    }
  }, []);

  const handleVideoClick = (sectionIndex, videoIndex) => {
    const updated = [...sections];

    updated.forEach(section =>
      section.videos.forEach(video => {
        if (video.status === "playing") {
          video.status = "completed";
        }
      })
    );

    const selectedVideo = updated[sectionIndex].videos[videoIndex];

    selectedVideo.status = "playing";

    setSections(updated);
    localStorage.setItem("currentCourse", JSON.stringify(updated));

    const playlistId = localStorage.getItem("currentPlaylistId");

    if (!playlistId) {
      console.error("Playlist ID missing at video click");
      return;
    }

    localStorage.setItem(
      "currentVideo",
      JSON.stringify({
        playlistId,
        videoId: selectedVideo.videoId,
        title: selectedVideo.title
      })
    );
    console.log("Saving video with playlistId:", playlistId);

    localStorage.setItem(
      "currentTranscript",
      `
This video is about: ${selectedVideo.title}

It teaches:
- Concepts explained in ${selectedVideo.title}
- Real examples and use cases
- Practical implementation
`
    );

    window.dispatchEvent(new Event("courseUpdated"));
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0b0f] border-l border-white/5">

      {/* HEADER */}
      <div className="p-6 border-b border-white/5 bg-[#111116]">
        <h3 className="text-[11px] font-bold text-red-600 uppercase tracking-widest">
          AI Generated Curriculum
        </h3>
        <h2 className="text-xl font-semibold text-white mt-1">
          Course Content
        </h2>
      </div>

      <div className="flex-grow overflow-y-auto">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="border-b border-white/5">
            <div
              onClick={() =>
                setOpenSection(
                  openSection === sectionIndex ? null : sectionIndex
                )
              }
              className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-white/[0.03] transition-all"
            >
              <div className="flex items-center space-x-3">
                {openSection === sectionIndex ? (
                  <ChevronDown size={18} className="text-red-500" />
                ) : (
                  <ChevronRight size={18} className="text-gray-500" />
                )}

                <h4 className="text-sm font-semibold text-white tracking-tight">
                  {section.sectionTitle}
                </h4>
              </div>

              <span className="text-xs text-gray-500">
                {section.videos.length} lectures
              </span>
            </div>

            {openSection === sectionIndex && (
              <div className="bg-[#0f0f14]">
                {section.videos.map((video, videoIndex) => (
                  <div
                    key={video.videoId}
                    onClick={() => handleVideoClick(sectionIndex, videoIndex)}
                    className={`flex items-center px-10 py-3 text-sm cursor-pointer transition-all ${video.status === "playing"
                      ? "bg-red-600/10 text-red-500"
                      : video.status === "completed"
                        ? "text-green-400"
                        : "text-gray-300 hover:bg-white/[0.04]"
                      }`}
                  >
                    <PlayCircle
                      size={16}
                      className={`mr-3 ${video.status === "playing"
                        ? "text-red-500"
                        : video.status === "completed"
                          ? "text-green-400"
                          : "text-gray-500"
                        }`}
                    />

                    <span className="truncate">
                      {video.title}
                    </span>
                  </div>
                ))}
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseContent;
