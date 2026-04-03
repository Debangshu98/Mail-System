import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import EmailList from "../components/EmailList";
import ComposeModal from "../components/ComposeModal";
import { ShowConversations } from "../components/ConversationList";

const Inbox = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);

  // ✅ Fetch Emails
  const fetchEmails = async () => {
    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.id) {
        console.error("❌ User not found in localStorage");
        setEmails([]);
        return;
      }

      const response = await fetch(
        `http://localhost:8000/api/inbox/${user.email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log("📩 Emails fetched:", data);

      setEmails(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setEmails([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  // ✅ Open Email
  const handleRead = (email) => {
    setSelectedEmail(email);
  };

  // ✅ Delete Email (frontend only for now)
  const handleDelete = (id) => {
    if (window.confirm("Delete this email?")) {
      setEmails((prev) => prev.filter((e) => e._id !== id));
      if (selectedEmail?._id === id) setSelectedEmail(null);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar onCompose={() => setShowCompose(true)} />

        <main className="flex-1 flex overflow-hidden">
          {/* 📩 Email List */}
          <div
            className={`flex-1 flex flex-col p-6 overflow-y-auto ${
              selectedEmail ? "hidden md:flex" : "flex"
            }`}
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Inbox</h2>

            {loading ? (
              <p>Loading emails...</p>
            ) : emails.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No emails found
              </p>
            ) : (
              <EmailList
                emails={emails}
                onRead={handleRead}
                onDelete={handleDelete}
                type="inbox"
              />
            )}
          </div>

          {/* 📖 Email Detail View */}
          {selectedEmail && (
            <div className="flex-1 flex flex-col p-6 bg-white border-l overflow-y-auto">
              <div className="flex justify-between items-start mb-6 pb-6 border-b">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {selectedEmail.subject}
                  </h2>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-bold text-gray-700">
                      {selectedEmail.from?.name || "Unknown"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedEmail(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  Close
                </button>
              </div>

              <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                {selectedEmail.message}
              </div>
            </div>
          )}
        </main>

        {/* 💬 Conversations Sidebar */}
        <ShowConversations />
      </div>

      {/* ✉️ Compose Modal */}
      {showCompose && (
        <ComposeModal
          onClose={() => setShowCompose(false)}
          onSuccess={fetchEmails}
        />
      )}
    </div>
  );
};

export default Inbox;