import React, { useState, useEffect, useRef } from "react";

function VideoDisplay() {
  const [sections, setSections] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [currentSection, setCurrentSection] = useState("");
  const iframeRef = useRef(null);

  // Load course
  useEffect(() => {
    loadCourse();
    window.addEventListener("courseUpdated", loadCourse);

    return () => {
      window.removeEventListener("courseUpdated", loadCourse);
    };
  }, []);

  const loadCourse = () => {
    const saved = JSON.parse(localStorage.getItem("currentCourse"));

    if (!Array.isArray(saved)) return;

    setSections(saved);

    saved.forEach(section => {
      section.videos.forEach(video => {
        if (video.status === "playing") {
          setCurrentVideo(video);
          setCurrentSection(section.sectionTitle);
        }
      });
    });
  };

  // Auto Move to Next
  const moveToNextVideo = () => {
    const updated = [...sections];

    for (let s = 0; s < updated.length; s++) {
      for (let v = 0; v < updated[s].videos.length; v++) {
        if (updated[s].videos[v].status === "playing") {
          updated[s].videos[v].status = "completed";

          // next video in same section
          if (v < updated[s].videos.length - 1) {
            updated[s].videos[v + 1].status = "playing";
          } 
          // next section
          else if (s < updated.length - 1) {
            updated[s + 1].videos[0].status = "playing";
          }

          localStorage.setItem("currentCourse", JSON.stringify(updated));
          window.dispatchEvent(new Event("courseUpdated"));
          return;
        }
      }
    }
  };

  if (!currentVideo)
    return <div className="aspect-video bg-black rounded-3xl animate-pulse" />;

  return (
    <div className="w-full space-y-6">
      <div className="aspect-video bg-black rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <iframe
          ref={iframeRef}
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${currentVideo.videoId}?enablejsapi=1`}
          title={currentVideo.title}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          onLoad={() => {
            // Detect end via postMessage
            window.addEventListener("message", function (event) {
              if (event.data === '{"event":"onStateChange","info":0}') {
                moveToNextVideo();
              }
            });
          }}
        />
      </div>

      <div className="space-y-2">
        <h2 className="text-3xl font-black text-white tracking-tight">
          {currentVideo.title}
        </h2>

        <span className="px-3 py-1 bg-red-600/10 text-red-500 border border-red-600/20 text-[10px] font-black uppercase tracking-[0.3em] rounded-full">
          {currentSection}
        </span>
      </div>
    </div>
  );
}

export default VideoDisplay;


