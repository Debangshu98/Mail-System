import React from "react";
import { useState, useEffect } from "react";
import { Users, User, Mail } from "lucide-react";

export const ShowUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const responseData = await response.json();
        if (responseData.users) {
          setUsers(responseData.users);
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border-gray-300 p-8 h-full overflow-y-auto">
      <div className="flex items-center gap-10 mb-6 pb-4 border-b-2 border-gray-200">
        <Users className="text-blue-500" size={24} />
        <h2 className="text-xl font-bold text-gray-800">Registered Users</h2>
        <span className="ml-auto bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full">
          {users.length}
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <User size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="text-base">No users found</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {users.map((user, index) => (
            <li
              key={user._id || user.id || index}
              className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-blue-300 transition-all duration-150 group"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-base shadow-md">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate text-base">
                  {user.name || "Unnamed User"}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <Mail size={14} />
                  <span className="truncate">{user.email}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShowUsers;