"use client";

import { useState } from "react";
import Link from "next/link";

interface DateItem {
  id: number;
  month: string;
  day: string;
  title: string;
}

interface Props {
  initialDates: DateItem[];
}

const API_URL = `${process.env.CLIENT_API_URL}/important-dates`;

export default function ImportantDates({ initialDates }: Props) {
  const [dates, setDates] = useState<DateItem[]>(initialDates);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Modal + form state
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [title, setTitle] = useState("");

  const isAdmin = false;

  /* ---------- Helpers ---------- */

  const buildDueDate = (month: string, day: string) => {
    const monthMap: Record<string, string> = {
      JAN: "01", FEB: "02", MAR: "03", APR: "04",
      MAY: "05", JUN: "06", JUL: "07", AUG: "08",
      SEP: "09", OCT: "10", NOV: "11", DEC: "12",
    };

    const m = monthMap[month.toUpperCase()] || month.padStart(2, "0");
    return `2025-${m}-${day.padStart(2, "0")}`;
  };

  /* ---------- Modal controls ---------- */

  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setMonth("");
    setDay("");
    setTitle("");
    setShowModal(true);
  };

  const openEditModal = (item: DateItem) => {
    setIsEditing(true);
    setEditingId(item.id);
    setMonth(item.month);
    setDay(item.day);
    setTitle(item.title);
    setShowModal(true);
  };

  /* ---------- CREATE / UPDATE ---------- */

  const handleSave = async () => {
    if (!month || !day || !title) return;

    const due_date = buildDueDate(month, day);

    try {
      const res = await fetch(
        isEditing ? `${API_URL}/${editingId}` : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            due_date,
            description: title,
          }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Save failed:", errorText);
        return;
      }

      // SAFE JSON PARSE
      const text = await res.text();
      const json = text ? JSON.parse(text) : null;

      if (isEditing) {
        setDates(prev =>
          prev.map(item =>
            item.id === editingId
              ? { ...item, month: month.toUpperCase(), day, title }
              : item
          )
        );
      } else if (json) {
        setDates(prev => [
          ...prev,
          {
            id: json.data.id,
            month: month.toUpperCase(),
            day,
            title,
          },
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
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Delete failed:", errorText);
        return;
      }

      // DO NOT parse JSON (204 No Content)
      setDates(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------- UI ---------- */

  return (
    <>
      <div className="w-full max-w-sm border rounded-xl p-6 shadow-sm bg-white ml-5 border-purple-800">
        <h2 className="text-xl font-bold text-[#2A0845]">IMPORTANT DATES</h2>

        <p className="text-sm text-gray-700 mt-3 leading-relaxed">
          All deadlines refer to 23:59 of the day in the Anywhere on Inhabited Earth (AOE).
          More details at{" "}
          <Link href="/calls" className="underline text-[#2A0845]">
            Calls
          </Link>.
        </p>

        <hr className="mt-5 mb-7 border-gray-300" />

        <div className="space-y-5">
          {dates.map((item) => {
            const expanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                className="flex items-start border rounded-lg shadow-sm"
              >
                {/* Date box */}
                <div
                  className="w-20 border-r text-center rounded-md p-5"
                  style={{ background: "rgba(253, 207, 250, 0.2667)" }}
                >
                  <p className="text-[#2A0845] font-bold">{item.month}</p>
                  <p className="text-[#2A0845] font-bold text-xl leading-none">
                    {item.day}
                  </p>
                </div>

                {/* Title */}
                <div className="pl-4 pr-2 flex-1">
                  <div
                    className={`cursor-pointer overflow-hidden transition-all duration-300 ease-in-out ${expanded ? "max-h-40 opacity-100" : "max-h-6 opacity-90"
                      }`}
                    onClick={() =>
                      setExpandedId(expanded ? null : item.id)
                    }
                  >
                    <p
                      onClick={() =>
                        setExpandedId(expandedId === item.id ? null : item.id)
                      }
                      className={`text-gray-900 text-sm text-left cursor-pointer transition-all ${expandedId === item.id
                          ? "block overflow-visible"
                          : "line-clamp-2 overflow-hidden"
                        }`}
                      title="Click to expand"
                    >
                      {item.title}
                    </p>

                  </div>

                  {/* Admin buttons */}
                  {isAdmin && (
                    <div
                      className="mt-2 flex gap-3 text-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="underline text-[#2A0845]"
                        onClick={() => openEditModal(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="underline text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {isAdmin && (
          <button
            onClick={openAddModal}
            className="mt-5 w-full bg-purple-800 text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-900"
          >
            + Add New Date
          </button>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] animate-slideUp">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
            <h3 className="text-xl font-bold text-[#2A0845] mb-4">
              {isEditing ? "Edit Date" : "Add New Date"}
            </h3>

            <div className="space-y-4">
              <input
                placeholder="Month (JAN or 10)"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full border rounded-md p-2"
              />
              <input
                placeholder="Day (e.g. 29)"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="w-full border rounded-md p-2"
              />
              <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded-md p-2"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-300"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-[#2A0845] text-white"
              >
                {isEditing ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation */}
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

