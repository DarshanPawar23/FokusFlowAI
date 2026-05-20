import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, Award, ArrowRight, RefreshCcw, ClipboardCheck } from "lucide-react";

function Exam() {
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [examId, setExamId] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    generateExam();
  }, []);

  const generateExam = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/api/users/create-exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!data.success || !data.examId) {
        alert(data.message || "Failed to generate exam");
        setLoading(false);
        return;
      }

      setExamId(data.examId);

      const questionRes = await fetch(
        `http://localhost:3000/api/users/get-exam-questions/${data.examId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const questionData = await questionRes.json();
      if (questionData.success) {
        setQuestions(questionData.questions || []);
      } else {
        alert("Failed to load questions");
      }

      setLoading(false);
    } catch (err) {
      console.error("Exam generation error:", err);
      alert("Something went wrong while generating exam");
      setLoading(false);
    }
  };

  const parseOptions = (options) => {
    try {
      if (Array.isArray(options)) return options;
      if (typeof options === "string") return JSON.parse(options);
      return [];
    } catch {
      return [];
    }
  };

  const handleSelect = (qIndex, optionIndex) => {
    const updated = [...selected];
    updated[qIndex] = optionIndex;
    setSelected(updated);
  };

  const submitExam = async () => {
    if (!examId) {
      alert("Exam session expired. Please refresh.");
      return;
    }

    const answeredCount = selected.filter((v) => v !== undefined).length;
    if (answeredCount !== questions.length) {
      alert(`Please answer all ${questions.length} questions.`);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/users/submit-exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ examId, answers: selected }),
      });

      const data = await res.json();
      if (!data.success) {
        alert("Submission failed");
        return;
      }
      setResult(data);
    } catch (error) {
      console.error("Submit error:", error);
      alert("Error submitting exam");
    }
  };

  const answeredCount = selected.filter((v) => v !== undefined).length;
  const progress = (answeredCount / questions.length) * 100;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center text-white overflow-hidden">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="relative"
        >
          <div className="absolute inset-0 blur-2xl bg-blue-500/20 rounded-full" />
          <Loader2 size={80} className="text-blue-500 relative z-10" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <h2 className="text-2xl font-semibold tracking-tight">System Initialization</h2>
          <p className="text-slate-400 mt-2 font-mono text-sm uppercase tracking-[0.2em]">
            Generating AI Contextual Assessment...
          </p>
        </motion.div>
      </div>
    );
  }

  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-slate-950 flex items-center justify-center p-6 text-white z-[100]"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="max-w-md w-full bg-slate-900/50 border border-white/10 backdrop-blur-2xl p-8 rounded-[2.5rem] text-center shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]"
        >
          <div className="mb-6">
            {result.passed ? (
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 rounded-full mb-4">
                <CheckCircle2 size={48} className="text-green-400" />
              </div>
            ) : (
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/10 rounded-full mb-4">
                <XCircle size={48} className="text-red-400" />
              </div>
            )}
            <h2 className="text-3xl font-bold tracking-tight">Performance Summary</h2>
          </div>

          <div className="bg-white/5 rounded-3xl py-8 px-4 mb-8">
            <span className="text-sm uppercase tracking-widest text-slate-400 font-semibold">Final Score</span>
            <div className="text-7xl font-black mt-2 bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
              {Math.round(result.percentage)}%
            </div>
          </div>

          <p className={`text-xl font-medium mb-8 ${result.passed ? "text-green-400" : "text-red-400"}`}>
            {result.passed ? "Certification Criteria Met" : "Assessment Unsuccessful"}
          </p>

          <div className="space-y-4">
            {result.passed ? (
              <button
                onClick={() => navigate("/certificate")}
                className="w-full group bg-blue-600 hover:bg-blue-500 transition-all py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
              >
                <Award size={20} /> View Certificate
              </button>
            ) : (
              <button
                onClick={() => {
                  setSelected([]);
                  setResult(null);
                }}
                className="w-full bg-slate-800 hover:bg-slate-700 transition-all py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
              >
                <RefreshCcw size={20} /> Retake Assessment
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-24">
      {/* Sticky Modern Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="text-blue-500" size={24} />
            <span className="font-bold tracking-tight text-white">PROCTORED EXAM</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Progress</div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono text-blue-400 font-bold">
                {answeredCount}/{questions.length}
              </span>
              <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto p-6 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">
            Final Certification
          </h1>
          <p className="text-slate-400 text-lg">
            Ensure accuracy; your certification depends on these responses.
          </p>
        </motion.div>

        <div className="space-y-10">
          {questions.map((q, index) => (
            <motion.div
              key={q.id || index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              {/* Question Number Badge */}
              <div className="absolute -left-4 top-0 -translate-x-full h-full hidden lg:block">
                <span className="text-4xl font-black text-white/5 sticky top-28">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[2rem] hover:bg-white/[0.05] transition-colors shadow-sm">
                <p className="text-xl font-semibold text-white leading-relaxed mb-8">
                  {q.question_text}
                </p>

                <div className="grid gap-3">
                  {parseOptions(q.options).map((opt, i) => {
                    const isSelected = selected[index] === i;
                    return (
                      <button
                        key={i}
                        onClick={() => handleSelect(index, i)}
                        className={`group relative flex items-center justify-between w-full text-left px-6 py-4 rounded-2xl border transition-all duration-300 ${isSelected
                            ? "bg-blue-600 border-blue-400 shadow-[0_0_20px_-5px_rgba(59,130,246,0.4)] text-white"
                            : "bg-white/5 border-white/5 hover:border-white/20 text-slate-300 hover:bg-white/10"
                          }`}
                      >
                        <span className="font-medium pr-4">{opt}</span>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? "bg-white border-white" : "border-slate-600"
                            }`}
                        >
                          {isSelected && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-6 z-50"
        >
          <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 p-3 rounded-[2rem] shadow-2xl">
            <button
              onClick={submitExam}
              disabled={answeredCount !== questions.length}
              className={`w-full group py-4 rounded-[1.5rem] font-bold text-lg flex items-center justify-center gap-3 transition-all ${answeredCount === questions.length
                  ? "bg-white text-black hover:scale-[1.02] active:scale-95"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed opacity-50"
                }`}
            >
              {answeredCount === questions.length ? (
                <>
                  Complete Assessment <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              ) : (
                `Complete ${questions.length - answeredCount} more to submit`
              )}
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default Exam;