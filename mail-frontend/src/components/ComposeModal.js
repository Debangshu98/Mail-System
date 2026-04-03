import React, { useState } from "react";
import { X, Send } from "lucide-react";

const ComposeModal = ({ onClose, onSuccess }) => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !user.id) {
      setError("User not logged in");
      return;
    }

    if (!token) {
      setError("No authentication token found");
      return;
    }

    setLoading(true);

    const mailData = {
      to,        // recipient's email address
      subject,
      body,
    };

    await sendMail(token, mailData);
  };

  const sendMail = async (token, mailData) => {
    try {
      const res = await fetch("http://localhost:8000/api/sendMail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(mailData),
      });

      const resData = await res.json();

      if (!res.ok) {
        setError(resData.message || "Something went wrong");
        return;
      }

      // ✅ Reset form
      setTo("");
      setSubject("");
      setBody("");
      setError("");

      onSuccess();
      onClose();

    } catch (err) {
      console.error("❌ ERROR:", err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-xl">
          <h3 className="font-bold text-gray-700">New Message</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X size={20} />
          </button>
        </div>

        {error && <p className="bg-red-100 text-red-600 p-3 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 p-4">
          <div className="mb-3">
            <input
              type="email"
              placeholder="To (recipient's email)"
              className="w-full border-b focus:border-blue-500 outline-none p-2"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              placeholder="Subject"
              className="w-full border-b focus:border-blue-500 outline-none p-2"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="flex-1">
            <textarea
              placeholder="Body"
              className="w-full h-64 outline-none p-2 resize-none"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end p-2 border-t mt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
            >
              {loading ? "Sending..." : "Send"}
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComposeModal;