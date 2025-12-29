"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface NewsItem {
  id: number;
  page_id?: number;
  title: string;
  content?: string;
  published_at?: string;
  link_text?: string;
  link_url?: string;
}

interface Props {
  pageId?: number;
}

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/news`;

export default function NewsCard({ pageId }: Props) {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editNews, setEditNews] = useState<NewsItem | null>(null);

  const [newNews, setNewNews] = useState<Partial<NewsItem>>({
    title: "",
    content: "",
    published_at: "",
    link_text: "",
    link_url: "",
  });

  const isAdmin = true; 

useEffect(() => {
  const fetchNews = async () => {
    if (!pageId) return; // do nothing if no pageId

    try {
      // Fetch all news for the page, no limit
      const res = await fetch(`${API_URL}`);
      if (!res.ok) throw new Error('Failed to fetch news');
      const data = await res.json();
      setNewsData(data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchNews();
}, [pageId]);


  /* CREATE / UPDATE */
  const handleSave = async () => {
    if (!newNews.title) return;

    try {
      let res: Response;
      if (editNews) {
        // UPDATE
        res = await fetch(`${API_URL}/${editNews.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newNews),
        });
      } else {
        // CREATE
        res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...newNews, page_id: pageId || 2 }),
        });
      }

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Save failed:", errorText);
        return;
      }

      const text = await res.text();
      const json = text ? JSON.parse(text) : null;

      if (editNews && json) {
        setNewsData((prev) =>
          prev.map((item) =>
            item.id === editNews.id ? { ...item, ...json } : item
          )
        );
      } else if (json) {
        setNewsData((prev) => [...prev, json]);
      }

      setShowCreate(false);
      setEditNews(null);
      setNewNews({
        title: "",
        content: "",
        published_at: "",
        link_text: "",
        link_url: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  /* DELETE */
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Delete failed:", errorText);
        return;
      }
      setNewsData((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  /* Open Edit Modal */
  const openEditModal = (item: NewsItem) => {
    setEditNews(item);
    setNewNews({
      title: item.title,
      content: item.content,
      published_at: item.published_at,
      link_text: item.link_text,
      link_url: item.link_url,
    });
    setShowCreate(true);
  };

  /* UI */
  return (
    <>
      <div className="space-y-4">
        {newsData.map((item) => {
          const expanded = expandedId === item.id;
          const parts = item.link_text
            ? item.content?.split(item.link_text) || [item.content]
            : [item.content || ""];

          return (
            <div
              key={item.id}
              className="relative w-auto bg-white rounded-xl shadow-md p-4 border text-left cursor-pointer ml-6"
              onClick={() => setExpandedId(expanded ? null : item.id)}
            >
              <div className="absolute top-0 left-0 h-full w-2 bg-gradient-to-b from-purple-700 to-purple-400 rounded-l-xl"></div>

              <div className="flex-1 pl-3">
                {item.published_at && (
                  <p className="text-gray-500 text-sm mb-1 font-semibold">
                    {new Date(item.published_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}

                <h2 className="font-semibold text-lg text-gray-900 mb-1">
                  {item.title}
                </h2>

                <p
                  className={`text-gray-700 transition-all duration-300 ${
                    expanded ? "line-clamp-none" : "line-clamp-1"
                  }`}
                >
                  {item.link_text ? (
                    <>
                      {parts[0]}
                      <Link
                        href={item.link_url!}
                        className="text-purple-700 underline hover:text-purple-800 font-medium"
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
              </div>

              {isAdmin && (
                <div
                  className="absolute top-3 right-3 flex gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                    onClick={() => openEditModal(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
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

      {isAdmin && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowCreate(true)}
            className="px-6 py-2 bg-purple-800 text-white rounded-lg shadow hover:bg-purple-900 transition font-medium"
          >
            + Create News
          </button>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl animate-slideUp">
            <h2 className="text-xl font-semibold text-[#2A0845] mb-4">
              {editNews ? "Edit News" : "Create News"}
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Title"
                className="w-full border border-purple-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                value={newNews.title}
                onChange={(e) =>
                  setNewNews({ ...newNews, title: e.target.value })
                }
              />
              <textarea
                rows={3}
                placeholder="Detail"
                className="w-full border border-purple-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                value={newNews.content}
                onChange={(e) =>
                  setNewNews({ ...newNews, content: e.target.value })
                }
              ></textarea>
              <input
                type="date"
                placeholder="Published date"
                className="w-full border border-purple-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                value={newNews.published_at?.slice(0, 10) || ""}
                onChange={(e) =>
                  setNewNews({ ...newNews, published_at: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Link text (optional)"
                className="w-full border border-purple-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                value={newNews.link_text}
                onChange={(e) =>
                  setNewNews({ ...newNews, link_text: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Link URL (optional)"
                className="w-full border border-purple-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                value={newNews.link_url}
                onChange={(e) =>
                  setNewNews({ ...newNews, link_url: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => {
                  setShowCreate(false);
                  setEditNews(null);
                  setNewNews({
                    title: "",
                    content: "",
                    published_at: "",
                    link_text: "",
                    link_url: "",
                  });
                }}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-purple-800 text-white rounded-lg shadow hover:bg-purple-900 transition"
              >
                {editNews ? "Update" : "Create"}
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
