"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; 

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
  const [dates, setDates] = useState<DateItem[]>(initialDates);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [title, setTitle] = useState("");

  const [dateError, setDateError] = useState("");
  const [titleError, setTitleError] = useState("");

  const isAdmin = true;

  /* ---------- Helpers ---------- */

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

  /* ---------- Modal controls ---------- */

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

  /* ---------- CREATE / UPDATE ---------- */

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
          prev.map(item =>
            item.id === editingId
              ? { ...item, due_date: due_date!, title }
              : item
          )
        );
      } else if (json) {
        setDates(prev => [
          ...prev,
          { id: json.data.id, due_date: due_date!, title },
        ]);
      }

      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------- DELETE ---------- */

  const deleteDate = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) return;
      setDates(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------- UI ---------- */

  return (
    <>
      <div className="w-full max-w-sm border rounded-xl p-6 shadow-sm bg-white border-purple-800 text-center mt-8 text-gray-900">
        <h2 className="text-xl font-bold text-[#2A0845]">IMPORTANT DATES</h2>

        <p className="text-sm text-gray-700 mt-3 leading-relaxed">
          All deadlines refer to 23:59 of the day in the Anywhere on Inhabited Earth (AOE).{" "}
          More details at{" "}
          <Link href="/calls" className="underline text-[#2A0845]">
            Calls
          </Link>.
        </p>

        <hr className="mt-5 mb-7 border-gray-300" />

        <div className="space-y-4">
          {dates.map(item => {
            const expanded = expandedId === item.id;
            const { month, day } = formatDateDisplay(item.due_date);

            return (
              <div
                key={item.id}
                onClick={() => setExpandedId(expanded ? null : item.id)}
                className={`cursor-pointer border rounded-xl overflow-hidden transition-all duration-300 min-h-[70px] ${
                  expanded ? "bg-white" : " bg-white"
                }`}
              >
                <div className="flex items-stretch">
                  <div className="w-20 flex flex-col items-center justify-center border-r min-h-[70px] bg-[rgba(253,207,250,0.27)]">
                    <p className="text-[#2A0845] font-bold text-sm">{month}</p>
                    <p className="text-[#2A0845] font-bold text-xl leading-none">{day}</p>
                  </div>

                  <div
                    className={`flex-1 px-4 py-3 transition-all duration-300 ${
                      expanded ? "py-3 flex flex-col justify-start" : "py-0 flex items-center"
                    }`}
                  >
                    <p
                      className={`text-sm text-gray-900 transition-all duration-300 text-left mr-2 ${
                        expanded ? "" : "line-clamp-1"
                      }`}
                    >
                      {item.title}
                    </p>

                    {isAdmin && (
                      <div
                        className="ml-auto flex gap-1 text-xs shrink-0"
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
                          onClick={() => deleteDate(item.id)}
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
            className="mt-5 w-full bg-purple-700 text-white py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-out
              hover:bg-purple-800 hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            + Add New Date
          </button>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
            <h3 className="text-xl font-bold text-[#2A0845] mb-4">
              {isEditing ? "Edit Date" : "Add New Date"}
            </h3>

            <div className="space-y-4">
              <div >
                <label className="block text-base font-medium text-gray-700 mb-1">
                  Select Date
                </label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date | null) => {
                    setSelectedDate(date);
                    setDateError("");
                  }}
                  minDate={new Date()}
                  className="w-[400px] border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 transition"
                  placeholderText="Select a date"
                  dateFormat="yyyy-MM-dd"
                />
                {dateError && <p className="text-sm text-red-600 mt-1">{dateError}</p>}
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  placeholder="Title"
                  value={title}
                  onChange={e => {
                    setTitle(e.target.value);
                    setTitleError("");
                  }}
                  className="w-full border rounded-lg p-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 transition"
                />
                {titleError && <p className="text-sm text-red-600 mt-1">{titleError}</p>}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg bg-gray-300"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-purple-700 text-white font-medium"
                onClick={handleSave}
              >
                {isEditing ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
