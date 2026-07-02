import React, { useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";
import { socket } from "../socket/socket";
import { useGroupStudy } from "../hooks/useGroupStudy";

const PLAYER_STATE = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
};

function VideoDisplay() {
  const { roomCode, isHost } = useGroupStudy();

  const [sections, setSections] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [currentSection, setCurrentSection] = useState("");

  const playerRef = useRef(null);
  const ignorePlayerEvent = useRef(false);

  useEffect(() => {
    loadCourse();

    const handleCourseUpdate = () => loadCourse();
    window.addEventListener("courseUpdated", handleCourseUpdate);

    return () => {
      window.removeEventListener("courseUpdated", handleCourseUpdate);
    };
  }, []);

  const loadCourse = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("currentCourse"));
      if (!Array.isArray(saved)) return;

      setSections(saved);

      for (const section of saved) {
        const playing = section.videos.find((v) => v.status === "playing");

        if (playing) {
          setCurrentVideo(playing);
          setCurrentSection(section.sectionTitle);
          break;
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const youtubeOptions = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 1,
      rel: 0,
      modestbranding: 1,
      controls: 1,
      disablekb: roomCode && !isHost ? 1 : 0,
    },
  };

  const onReady = (event) => {
    playerRef.current = event.target;
  };

  const moveToNextVideo = () => {
    if (roomCode && !isHost) return;

    const saved = JSON.parse(localStorage.getItem("currentCourse"));
    if (!Array.isArray(saved)) return;

    let nextVideo = null;

    outerLoop: for (let s = 0; s < saved.length; s++) {
      for (let v = 0; v < saved[s].videos.length; v++) {
        if (saved[s].videos[v].status === "playing") {
          saved[s].videos[v].status = "completed";

          if (v < saved[s].videos.length - 1) {
            saved[s].videos[v + 1].status = "playing";
            nextVideo = saved[s].videos[v + 1];
          } else if (s < saved.length - 1) {
            saved[s + 1].videos[0].status = "playing";
            nextVideo = saved[s + 1].videos[0];
          }

          break outerLoop;
        }
      }
    }

    localStorage.setItem("currentCourse", JSON.stringify(saved));
    window.dispatchEvent(new Event("courseUpdated"));

    if (roomCode && nextVideo) {
      socket.emit("change-video", {
        roomCode,
        videoId: nextVideo.videoId,
      });
    }
  };

  const onPlay = () => {
    if (!roomCode) return;
    if (ignorePlayerEvent.current) return;

    if (!isHost) return;

    socket.emit("play", {
      roomCode,
    });
  };

  const onPause = () => {
    if (!roomCode) return;
    if (ignorePlayerEvent.current) return;

    if (!isHost) return;

    socket.emit("pause", {
      roomCode,
    });
  };

  const onStateChange = (event) => {

    switch (event.data) {
      case PLAYER_STATE.ENDED:
        moveToNextVideo();
        break;
      case PLAYER_STATE.PLAYING:
        onPlay();
        break;
      case PLAYER_STATE.PAUSED:
        onPause();
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    if (!roomCode || !isHost) return;

    const interval = setInterval(() => {
      if (!playerRef.current) return;

      const state = playerRef.current.getPlayerState();

      if (state === PLAYER_STATE.PLAYING) {
        socket.emit("seek", {
          roomCode,
          time: playerRef.current.getCurrentTime(),
        });
      }
    }, 2000);

    return () => clearInterval(interval);

  }, [roomCode, isHost]);

  useEffect(() => {
    if (!roomCode) return;

    const handlePlay = () => {
      if (isHost || !playerRef.current) return;
      ignorePlayerEvent.current = true;
      playerRef.current.playVideo();
      setTimeout(() => {
        ignorePlayerEvent.current = false;
      }, 300);
    };

    const handlePause = () => {
      if (isHost || !playerRef.current) return;
      ignorePlayerEvent.current = true;
      playerRef.current.pauseVideo();
      setTimeout(() => {
        ignorePlayerEvent.current = false;
      }, 300);
    };

    const handleSeek = ({ time }) => {
      if (isHost || !playerRef.current) return;

      ignorePlayerEvent.current = true;

      const currentTime = playerRef.current.getCurrentTime();

      if (Math.abs(currentTime - time) > 2) {
        playerRef.current.seekTo(time, true);
      }

      setTimeout(() => {
        ignorePlayerEvent.current = false;
      }, 300);
    };
    const handleVideoChange = ({ videoId }) => {
      if (isHost) return;

      const saved = JSON.parse(localStorage.getItem("currentCourse"));
      if (!Array.isArray(saved)) return;

      saved.forEach((section) => {
        section.videos.forEach((video) => {
          if (video.videoId === videoId) {
            video.status = "playing";
          } else if (video.status === "playing") {
            video.status = "completed";
          }
        });
      });

      localStorage.setItem("currentCourse", JSON.stringify(saved));
      window.dispatchEvent(new Event("courseUpdated"));
    };

    socket.on("play", handlePlay);
    socket.on("pause", handlePause);
    socket.on("seek", handleSeek);
    socket.on("change-video", handleVideoChange);

    return () => {
      socket.off("play", handlePlay);
      socket.off("pause", handlePause);
      socket.off("seek", handleSeek);
      socket.off("change-video", handleVideoChange);
    };
  }, [roomCode, isHost]);

  if (!currentVideo) {
    return (
      <div className="w-full aspect-video bg-[#0a0a0a] rounded-3xl border border-white/5 shadow-2xl animate-pulse flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="relative aspect-video bg-black rounded-3xl border border-white/10 overflow-hidden shadow-2xl group">
        <div
          className={`absolute inset-0 w-full h-full ${roomCode && !isHost ? "pointer-events-none" : ""
            }`}
        >
          <YouTube
            videoId={currentVideo.videoId}
            opts={youtubeOptions}
            onReady={onReady}
            onStateChange={onStateChange}
            className="w-full h-full"
            iframeClassName="w-full h-full"
          />
        </div>
      </div>

      <div className="space-y-3 px-2">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
          {currentVideo.title}
        </h2>
        <div className="inline-flex">
          <span className="px-4 py-1.5 bg-red-600/10 text-red-500 border border-red-600/20 text-[10px] font-black uppercase tracking-[0.3em] rounded-full">
            {currentSection}
          </span>
        </div>
      </div>
    </div>
  );
}

export default VideoDisplay;