import React from "react";
import { useState, useEffect } from "react";
import { Users } from "lucide-react";

export const ShowConversations = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem("user"));
        console.log("Current user:", user);
        if (!user || !user.id) {
          console.error("No user found in localStorage");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost:8000/api/conversations/${user.id}`,
        );
        const data = await response.json();
        console.log("Fetched conversations:", data);

        // Ensure data is an array
        if (Array.isArray(data)) {
          setConversations(data);
        } else {
          console.error("Expected array but got:", data);
          setConversations([]);
        }
      } catch (err) {
        console.error("Error fetching conversations:", err);
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border-gray-300 p-8 h-full overflow-y-auto flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border-gray-300 p-8 h-full overflow-y-auto">
      <div className="flex items-center gap-10 mb-6 pb-4 border-b-2 border-gray-200">
        <Users className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Conversations</h1>
        {conversations.length > 0 && (
          <span className="ml-auto bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            {conversations.length} user{conversations.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>
      {conversations.map((conversation) => {
        const user = JSON.parse(localStorage.getItem("user"));

        const otherUser = conversation.members?.find(
          (member) => member._id !== user.id,
        );

        return (
          <div
            key={conversation._id}
            className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition"
          >
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                {(otherUser?.name || "U").charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-gray-800">
                  {otherUser?.name || "Unknown"}
                </span>
              </div>

              <p className="text-sm text-gray-600">
                {otherUser?.email || "Unknown"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
