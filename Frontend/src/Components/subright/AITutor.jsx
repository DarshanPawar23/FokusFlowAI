import React, { useState, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";
import RecommendedQuestions from "../RecommendedQuestions";

function AITutor() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [transcript, setTranscript] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadVideo = () => {
      const title = localStorage.getItem("currentVideoTitle");
      const transcript = localStorage.getItem("currentTranscript");

      console.log("Loaded video:", title, transcript);

      if (title) setVideoTitle(title);
      if (transcript) setTranscript(transcript);
    };

    loadVideo();

    window.addEventListener("courseUpdated", loadVideo);

    return () => {
      window.removeEventListener("courseUpdated", loadVideo);
    };
  }, []);

  const askTutor = async (customQuestion) => {
    const finalQuestion = customQuestion || input;
    if (!finalQuestion.trim()) return;

    try {
      setLoading(true);

      const res = await fetch("http://localhost:3000/api/users/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: finalQuestion,
          transcript,
          videoTitle
        }),
      });

      const data = await res.json();

      if (data.success) {
        setResponse(data.data);
        setInput("");
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6">

      {videoTitle && (
        <div className="mb-4 text-xs text-gray-400">
          {videoTitle}
        </div>
      )}

      <div className="flex-grow space-y-6 overflow-y-auto">

        <RecommendedQuestions
          transcript={transcript}
          videoTitle={videoTitle}
          onSelect={(q) => askTutor(q)}
        />

        {response && (
          <div className="bg-white/5 p-5 rounded-xl text-xs text-gray-300 space-y-4">
            <div>
              <p className="text-white font-bold mb-2 flex items-center gap-2">
                <Sparkles size={14} /> Explanation
              </p>
              <p>{response.explanation}</p>
            </div>

            <div>
              <p className="text-white font-bold mb-2">Key Points</p>
              <ul>
                {response.keyPoints?.map((p, i) => (
                  <li key={i}>• {p}</li>
                ))}
              </ul>
            </div>

            {response.followUpQuestions && (
              <div>
                <p className="text-white font-bold mb-2">Follow-up</p>
                <div className="flex flex-wrap gap-2">
                  {response.followUpQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => askTutor(q)}
                      className="px-3 py-1 bg-white/5 rounded hover:bg-red-600"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {loading && (
          <div className="text-center text-gray-500 text-sm">
            Thinking...
          </div>
        )}
      </div>

      <div className="mt-auto pt-4 relative">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-white/5 px-4 py-3 text-xs text-white"
        />

        <button
          onClick={() => askTutor()}
          className="absolute right-2 top-[22px] text-red-600"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

export default AITutor;