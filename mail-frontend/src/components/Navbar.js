import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 text-white p-2 rounded-lg font-bold text-xl">M</div>
        <h1 className="text-xl font-bold text-black">MailSystem</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
          <User size={18} className="text-gray-600" />
          <span className="text-sm font-medium text-black">{user?.name}</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-gray-600 hover:text-red-500 transition p-2"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;