"use client";

import { useState } from "react";
import Link from "next/link";

const API_URL = `${process.env.CLIENT_API_URL}/news`;

interface NewsItem {
  id: number;
  title: string;
  content: string;
  published_at: string | null;
  link_text?: string | null;
  link_url?: string | null;
}

export default function NewsCard({initialNews}: {initialNews: NewsItem[];}) {

  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [visibleCount, setVisibleCount] = useState(5);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const isAdmin = true; 

  const [form, setForm] = useState({
    title: "",
    content: "",
    published_at: "",
    link_text: "",
    link_url: "",
  });

  /* ---------------- Helpers ---------------- */
  const formatDate = (date: string | null) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "";

  const openCreate = () => {
    setEditingId(null);
    setForm({
      title: "",
      content: "",
      published_at: "",
      link_text: "",
      link_url: "",
    });
    setShowModal(true);
  };

  const openEdit = (item: NewsItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      content: item.content,
      published_at: item.published_at ?? "",
      link_text: item.link_text ?? "",
      link_url: item.link_url ?? "",
    });
    setShowModal(true);
  };

  /* ---------------- Save (Create + Update) ---------------- */
  const handleSave = async () => {
    const isEdit = editingId !== null;

    const res = await fetch(
      isEdit ? `${API_URL}/${editingId}` : API_URL,
      {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page_id: 1,
          ...form,
        }),
      }
    );

    if (!res.ok) {
      alert("Save failed");
      return;
    }

    const saved = await res.json();

    setNews((prev) =>
      isEdit
        ? prev.map((n) => (n.id === saved.id ? saved : n))
        : [saved, ...prev]
    );

    setShowModal(false);
  };

  /* ---------------- Delete ---------------- */
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this news?")) return;

    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Delete failed");
      return;
    }

    setNews((prev) => prev.filter((n) => n.id !== id));
  };

  /* ---------------- Render ---------------- */
  return (
    <>
      <div className="space-y-4">
        {news.slice(0, visibleCount).map((item) => {
          const expanded = expandedId === item.id;
          const parts =
            item.link_text && item.link_url
              ? item.content.split(item.link_text)
              : [item.content];

          return (
            <div
              key={item.id}
              className="relative bg-white rounded-xl shadow-md p-4 border cursor-pointer"
              onClick={() =>
                setExpandedId(expanded ? null : item.id)
              }
            >
              <p className="text-sm text-gray-500 font-semibold mb-1">
                {formatDate(item.published_at)}
              </p>

              <h2 className="font-semibold text-lg mb-1">
                {item.title}
              </h2>

              <p
                className={`text-gray-700 transition-all ${
                  expanded ? "" : "line-clamp-1"
                }`}
              >
                {item.link_text ? (
                  <>
                    {parts[0]}
                    <Link
                      href={item.link_url!}
                      className="text-purple-600 underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {item.link_text}
                    </Link>
                    {parts[1]}
                  </>
                ) : (
                  item.content
                )}
              </p>

              {isAdmin && (
                <div
                  className="absolute top-3 right-3 flex gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="text-sm bg-green-600 text-white px-2 py-1 rounded"
                    onClick={() => openEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-sm bg-red-600 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Expand More */}
      {visibleCount < news.length && (
        <p
          className="mt-4 text-center cursor-pointer font-medium"
          style={{ color: "#5B00A4" }}
          onClick={() => setVisibleCount((c) => c + 5)}
        >
          Expand More
        </p>
      )}

      {/* Admin Create Button */}
      {isAdmin && (
        <div className="mt-6 text-center">
          <button
            onClick={openCreate}
            className="bg-purple-800 text-white px-6 py-2 rounded-lg"
          >
            + Create News
          </button>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md animate-slideUp">
            <h3 className="text-xl font-bold mb-4 text-[#2A0845]">
              {editingId ? "Edit News" : "Create News"}
            </h3>

            {[
              ["title", "Title"],
              ["content", "Detail"],
              ["published_at", "Date (YYYY-MM-DD)"],
              ["link_text", "Link text (optional)"],
              ["link_url", "Link URL (optional)"],
            ].map(([key, label]) => (
              <input
                key={key}
                className="w-full border rounded p-2 mb-3"
                placeholder={label}
                value={(form as any)[key]}
                onChange={(e) =>
                  setForm({ ...form, [key]: e.target.value })
                }
              />
            ))}

            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#2A0845] text-white rounded"
                onClick={handleSave}
              >
                Save
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
