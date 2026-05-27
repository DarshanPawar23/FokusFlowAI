import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function CertificateButton({ playlistId }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!name.trim()) {
      alert("Enter full name");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/certificate/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          playlistId,
          fullName: name
        })
      });

      const data = await res.json();

      alert(data.message);

      setOpen(false);
      setName("");

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-10 py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-sm uppercase tracking-widest rounded-2xl transition"
      >
        Get Certificate
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#111116] border border-white/10 rounded-2xl p-8 w-full max-w-md text-white"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-xl font-bold mb-4">
                Enter Name for Certificate
              </h2>

              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-xl bg-black border border-white/10 mb-6 outline-none"
              />

              <div className="flex gap-4">
                <button
                  onClick={() => setOpen(false)}
                  className="w-full py-3 bg-gray-700 rounded-xl text-sm font-bold"
                >
                  Cancel
                </button>

                <button
                  onClick={handleGenerate}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-xl text-sm font-bold"
                >
                  {loading ? "Sending..." : "Send Certificate"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default CertificateButton;