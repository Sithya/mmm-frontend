"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; 
import { useAuth } from "../../AuthProvider";

interface DateItem {
  id: number;
  due_date: string; 
  title: string;
}

interface Props {
  initialDates: DateItem[];
}

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/important-dates`;

export default function ImportantDates({ initialDates }: Props) {
  const { user } = useAuth();
  const isAdmin = user?.is_admin === true;

  const [dates, setDates] = useState<DateItem[]>(
    [...initialDates].sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
  );
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [title, setTitle] = useState("");
  const [dateError, setDateError] = useState("");
  const [titleError, setTitleError] = useState("");

  // New state for delete confirmation
  const [confirmDelete, setConfirmDelete] = useState<DateItem | null>(null);

  const formatDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      month: date.toLocaleString("en-US", { month: "short" }).toUpperCase(),
      day: String(date.getDate()),
    };
  };

  const validateForm = () => {
    let valid = true;
    setDateError("");
    setTitleError("");

    if (!selectedDate) {
      setDateError("Please select a date.");
      valid = false;
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate <= today) {
        setDateError("Date must be in the future.");
        valid = false;
      }
    }

    if (!title.trim()) {
      setTitleError("Please enter a title.");
      valid = false;
    }

    return valid;
  };

  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setSelectedDate(null);
    setTitle("");
    setShowModal(true);
  };

  const openEditModal = (item: DateItem) => {
    setIsEditing(true);
    setEditingId(item.id);
    setSelectedDate(new Date(item.due_date));
    setTitle(item.title);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const due_date = selectedDate?.toISOString().split("T")[0];

    try {
      const res = await fetch(
        isEditing ? `${API_URL}/${editingId}` : API_URL,
        {
          method: isEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ due_date, description: title }),
        }
      );

      if (!res.ok) return;

      const text = await res.text();
      const json = text ? JSON.parse(text) : null;

      if (isEditing) {
        setDates(prev =>
          [...prev.map(item =>
            item.id === editingId
              ? { ...item, due_date: due_date!, title }
              : item
          )].sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
        );
      } else if (json) {
        setDates(prev =>
          [...prev, { id: json.data.id, due_date: due_date!, title }]
            .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
        );
      }

      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) return;
      setDates(prev =>
        prev.filter(item => item.id !== id)
          .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
      );
      setConfirmDelete(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* IMPORTANT DATES CARD */}
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto border rounded-xl p-4 sm:p-6 shadow-sm bg-white border-purple-800 text-center mt-8 text-gray-900">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#2A0845]">IMPORTANT DATES</h2>

        <p className="text-xs sm:text-sm md:text-base text-gray-700 mt-3 leading-relaxed">
          All deadlines refer to 23:59 of the day in the Anywhere on Inhabited Earth (AOE).{" "}
          More details at{" "}
          <Link href="/calls" className="underline text-[#2A0845]">Calls</Link>.
        </p>

        <hr className="mt-5 mb-6 border-gray-300" />

        <div className="space-y-3 sm:space-y-4">
          {dates.map(item => {
            const expanded = expandedId === item.id;
            const { month, day } = formatDateDisplay(item.due_date);

            return (
              <div
                key={item.id}
                onClick={() => setExpandedId(expanded ? null : item.id)}
                className="cursor-pointer border rounded-xl overflow-hidden transition-all duration-300 min-h-[70px] bg-white"
              >
                <div className="flex flex-col sm:flex-row items-stretch">
                  <div className="w-full sm:w-24 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r min-h-[70px] bg-[rgba(253,207,250,0.27)]">
                    <p className="text-[#2A0845] font-bold text-xs sm:text-sm">{month}</p>
                    <p className="text-[#2A0845] font-bold text-lg sm:text-xl leading-none">{day}</p>
                  </div>

                  <div
                    className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 transition-all duration-300 ${
                      expanded ? "flex flex-col justify-start" : "flex items-center"
                    }`}
                  >
                    <p className={`text-sm sm:text-base md:text-base text-left mr-2 ${expanded ? "" : "line-clamp-1"}`}>
                      {item.title}
                    </p>

                    {isAdmin && (
                      <div
                        className="ml-auto flex gap-1 text-xs sm:text-sm shrink-0 mt-1 sm:mt-0"
                        onClick={e => e.stopPropagation()}
                      >
                        <button
                          className="underline text-[#2A0845] hover:text-purple-900"
                          onClick={() => openEditModal(item)}
                        >
                          <Pencil className="inline-block mr-1" size={14} />
                        </button>
                        <button
                          className="underline text-red-600 hover:text-red-700"
                          onClick={() => setConfirmDelete(item)}
                        >
                          <Trash2 className="inline-block mr-1" size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {isAdmin && (
          <button
            onClick={openAddModal}
            className="mt-5 w-full bg-purple-700 text-white py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 ease-out
              hover:bg-purple-800 hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            + Add New Date
          </button>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 sm:p-6">
          <div className="bg-white rounded-xl w-full max-w-sm sm:max-w-md p-4 sm:p-6 shadow-lg animate-slideUp">
            <h3 className="text-lg sm:text-xl font-bold text-[#2A0845] mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <strong>{confirmDelete.title}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg bg-gray-300 w-full sm:w-auto"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 rounded-lg bg-red-600 text-white w-full sm:w-auto"
                onClick={() => handleDelete(confirmDelete.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 sm:p-6">
          <div className="bg-white rounded-xl w-full max-w-md sm:max-w-lg p-4 sm:p-6 shadow-lg animate-slideUp">
            <h3 className="text-lg sm:text-xl font-bold text-[#2A0845] mb-4">
              {isEditing ? "Edit Date" : "Add New Date"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Select Date</label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date | null) => { setSelectedDate(date); setDateError(""); }}
                  minDate={new Date()}
                  className="w-full max-w-[400px] border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 transition"
                  placeholderText="Select a date"
                  dateFormat="yyyy-MM-dd"
                />
                {dateError && <p className="text-xs sm:text-sm text-red-600 mt-1">{dateError}</p>}
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Title</label>
                <input
                  placeholder="Title"
                  value={title}
                  onChange={e => { setTitle(e.target.value); setTitleError(""); }}
                  className="w-full border rounded-lg p-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 transition"
                />
                {titleError && <p className="text-xs sm:text-sm text-red-600 mt-1">{titleError}</p>}
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg bg-gray-300 w-full sm:w-auto"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-purple-700 text-white font-medium w-full sm:w-auto"
                onClick={handleSave}
              >
                {isEditing ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          .animate-slideUp {
            animation: slideUp 0.25s ease-out;
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </>
  );
}
