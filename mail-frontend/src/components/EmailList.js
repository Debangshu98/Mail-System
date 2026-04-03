import React from "react";
import {useState, useEffect} from "react";
import { Trash2, Mail } from "lucide-react";


const EmailList = ({ emails, onRead, onDelete, type = "inbox" }) => {
  
  const [mails, setMails] = useState([]);

  if (emails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <Mail size={48} className="mb-2" />
        <p>No messages here</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {emails.map((email) => (
        <div
          key={email._id}
          onClick={() => onRead(email)}
          className={`flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border hover:bg-gray-50 cursor-pointer transition ${
            !email.read && type === "inbox" ? "font-bold border-l-4 border-l-blue-500" : ""
          }`}
        >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-gray-800">
                  {type === "inbox" ? email.from?.name || "Unknown" : `To: ${email.to?.map(u => u.name).join(", ") || "Unknown"}`}
                </span>
                <span className="text-xs text-gray-400 font-normal">
                  {new Date(email.createdAt).toLocaleString()}
                </span>
              </div>
              <h4 className="text-sm text-gray-700 truncate">{email.subject}</h4>
              <p className="text-sm text-gray-500 truncate">{email.body?.replace(/<[^>]*>?/gm, '')}</p>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(email._id);
              }}
              className="p-2 text-gray-400 hover:text-red-500 transition"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
        </div>
      ))}
    </div>
  );
};

export default EmailList;
