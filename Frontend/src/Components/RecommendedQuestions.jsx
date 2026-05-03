import React, { useEffect, useState } from "react";

function RecommendedQuestions({ transcript, videoTitle, onSelect }) {
  const [questions, setQuestions] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/users/recommended-questions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ transcript, videoTitle })
        }
      );

      const data = await res.json();
      if (data.success) {
        setQuestions(data.questions);
      }

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-2 mt-4">
      <p className="text-[10px] text-gray-500 uppercase tracking-widest">
        Suggested Questions
      </p>

      <div className="flex flex-wrap gap-2">
        {questions.map((q, i) => (
          <button
            key={i}
            onClick={() => onSelect(q)}
            className="px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-lg hover:bg-red-600 hover:text-white transition-all"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

export default RecommendedQuestions;