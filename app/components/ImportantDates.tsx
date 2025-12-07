"use client";

import Link from "next/link";
import { useState } from "react";

interface DateItem {
  id: number;
  month: string;
  day: string;
  title: string;
}

export default function ImportantDates() {
  const [dates, setDates] = useState<DateItem[]>([
    { id: 1, month: "OCT", day: "29", title: "Demonstration Papers Acceptance Notification" },
    { id: 2, month: "OCT", day: "29", title: "Demonstration Papers Acceptance Notification" },
    { id: 3, month: "OCT", day: "29", title: "Demonstration Papers Acceptance Notification" },
    { id: 4, month: "OCT", day: "29", title: "Demonstration Papers Acceptance Notification" },
  ]);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [newMonth, setNewMonth] = useState("");
  const [newDay, setNewDay] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const isAdmin = false;

  const deleteDate = (id: number) => {
    setDates(prev => prev.filter(item => item.id !== id));
  };

  const handleAddDate = () => {
    if (!newMonth || !newDay || !newTitle) return;
    setDates(prev => [
      ...prev,
      {
        id: Date.now(),
        month: newMonth.toUpperCase(),
        day: newDay,
        title: newTitle
      }
    ]);
    setShowModal(false);
    setNewMonth("");
    setNewDay("");
    setNewTitle("");

  };

  return (
    <>
    <div className="w-full max-w-sm border rounded-xl p-6 shadow-sm bg-white ml-5 border-purple-800">

      <h2 className="text-xl font-bold text-[#2A0845]">IMPORTANT DATES</h2>

      <p className="text-sm text-gray-700 mt-3 leading-relaxed">
        All deadlines refer to 23:59 of the day in the Anywhere
        on Inhabited Earth (AOE). Further details about calls
        are available at <Link href="/calls" className="underline text-[#2A0845]">Calls</Link>.
      </p>

      <hr className="mt-5 mb-7 border-gray-300" /> 

      <div className="space-y-4">
        {dates.map(item => (
          <div key={item.id} className="flex items-center border rounded-lg shadow-sm">
            {/* Date Box */}
            <div className="w-20 border-r text-center rounded-md p-4" style={{ background: "rgba(253, 207, 250, 0.2667)" }}>
              <p className="text-[#2A0845] font-bold">{item.month}</p>
              <p className="text-[#2A0845] font-bold text-xl leading-none">{item.day}</p>
            </div>

            {/* Title */}
            <div className="pl-4 flex-1 text-left ml-1.5">
              <p className="text-gray-900 text-sm">{item.title}</p>

              {isAdmin && (
                <div className="mt-2 flex gap-3 text-xs text-[#2A0845]">
                  <button className="underline">Edit</button>
                  <button className="underline text-red-600" onClick={() => deleteDate(item.id)}>Delete</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isAdmin && (
        <>
          <button
            onClick={() => setShowModal(true)}
            className="mt-5 w-full bg-purple-800 text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-900"
          >
            + Add New Date
          </button>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] animate-slideUp">

              <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg relative">
                <h3 className="text-xl font-bold text-[#2A0845] mb-4">Add New Date</h3>

                <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Month (e.g., JAN)" 
                    className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    value={newMonth}
                    onChange={e => setNewMonth(e.target.value)}
                  />
                  <input 
                    type="text" 
                    placeholder="Day (e.g., 29)" 
                    className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    value={newDay}
                    onChange={e => setNewDay(e.target.value)}
                  />
                  <input 
                    type="text" 
                    placeholder="Title" 
                    className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                  />
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button 
                    className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-700"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="px-4 py-2 rounded-lg bg-[#2A0845] hover:bg-purple-700 text-white"
                    onClick={handleAddDate}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
    <style>
        {`
          .animate-slideUp {
            animation: slideUp 0.25s ease-out;
          }
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </>
  );
}
