import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Inbox, Send, Trash2, PenTool } from "lucide-react";

const Sidebar = ({ onCompose }) => {
  const location = useLocation();

  const navItems = [
    { name: "Inbox", path: "/inbox", icon: Inbox },
  ];

  return (
    <div className="w-64 h-full bg-gray-50 border-r flex flex-col p-4">
      <button
        onClick={onCompose}
        className="flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg p-3 font-bold hover:bg-blue-700 transition mb-6 shadow-sm"
      >
        <PenTool size={20} />
        Compose
      </button>

      <nav className="flex-1">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-lg transition ${
                    isActive ? "bg-blue-100 text-blue-700" : "hover:bg-gray-200"
                  }`}
                >
                  <Icon size={20} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;