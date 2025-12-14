"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";


interface DateItem {
  id: number;
  month: string;
  day: string;
  title: string;
}

interface Props {
  initialDates: DateItem[];
}

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/important-dates`;

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

  const isAdmin = true;

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
              ? { ...item, month: month.toUpperCase(), day, title }
              : item
          )
        );
      } else if (json) {
        setDates(prev => [
          ...prev,
          { id: json.data.id, month: month.toUpperCase(), day, title },
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
      <div className="w-full max-w-sm border h-full rounded-xl p-6 shadow-sm bg-white ml-10 border-purple-800 h text-center mr-[90px]">
        <h2 className="text-xl font-bold text-[#2A0845]">IMPORTANT DATES</h2>

        <p className="text-sm text-gray-700 mt-3 leading-relaxed">
          All deadlines refer to 23:59 of the day in the Anywhere on Inhabited Earth (AOE).
          More details at{" "}
          <Link href="/calls" className="underline text-[#2A0845]">
            Calls
          </Link>.
        </p>

        <hr className="mt-5 mb-7 border-gray-300" />

        <div className="space-y-4">
          {dates.map(item => {
            const expanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                onClick={() =>
                  setExpandedId(expanded ? null : item.id)
                }
                className={`cursor-pointer border rounded-xl overflow-hidden transition-all duration-300 min-h-[70px] 
                  ${expanded
                    ? "shadow-sm"
                    : "bg-white hover:bg-purple-50/40"}
                `}
              >
                <div className="flex items-stretch">
                  {/* DATE BOX */}
                  <div
                    className={`w-20 flex flex-col items-center justify-center border-r transition-colors duration-300 min-h-[70px]
                      ${expanded
                        ? "bg-[rgba(253,207,250,0.27)]"
                        : "bg-[rgba(253,207,250,0.27)]"}
                    `}
                  >
                    <p className="text-[#2A0845] font-bold text-sm">
                      {item.month}
                    </p>
                    <p className="text-[#2A0845] font-bold text-xl leading-none">
                      {item.day}
                    </p>
                  </div>

                  {/* CONTENT */}
                  <div className={`flex-1 px-4 py-3 transition-all duration-300 ${expanded ? "py-3 flex flex-col justify-start" : "py-0 flex items-center"}`}>
                    <p
                      className={`text-sm text-gray-900 transition-all duration-300 text-left mr-2
                        ${expanded ? "" : "line-clamp-1"}
                      `}
                    >
                      {item.title}
                    </p>

                    {/* ADMIN ACTIONS */}
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
            className="mt-5 w-full bg-purple-800 text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-900"
          >
            + Add New Date
          </button>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
            <h3 className="text-xl font-bold text-[#2A0845] mb-4">
              {isEditing ? "Edit Date" : "Add New Date"}
            </h3>

            <div className="space-y-4">
              <input
                placeholder="Month (JAN or 10)"
                value={month}
                onChange={e => setMonth(e.target.value)}
                className="w-full border rounded-md p-2"
              />
              <input
                placeholder="Day (e.g. 29)"
                value={day}
                onChange={e => setDay(e.target.value)}
                className="w-full border rounded-md p-2"
              />
              <input
                placeholder="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
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
