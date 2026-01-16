"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

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
  const [showCreate, setShowCreate] = useState(false);
  const [editNews, setEditNews] = useState<NewsItem | null>(null);

  const [newNews, setNewNews] = useState<Partial<NewsItem>>({
    title: "",
    content: "",
    link_text: "",
    link_url: "",
  });

  const isAdmin = true;

  useEffect(() => {
    const fetchNews = async () => {
      if (!pageId) return;

      try {
        const res = await fetch(`${API_URL}`);
        if (!res.ok) throw new Error("Failed to fetch news");
        const response = await res.json();
        const data = Array.isArray(response) ? response : response.data || [];
        setNewsData(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNews();
  }, [pageId]);

  const handleSave = async () => {
    if (!newNews.title) return;

    try {
      let res: Response;
      if (editNews) {
        res = await fetch(`${API_URL}/${editNews.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newNews),
        });
      } else {
        res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...newNews,
            page_id: pageId || 2,
            published_at: new Date().toISOString(),
          }),
        });
      }

      if (!res.ok) return;

      const text = await res.text();
      const json = text ? JSON.parse(text) : null;
      const itemData = json?.data || json;

      if (editNews && itemData) {
        setNewsData((prev) =>
          prev.map((item) =>
            item.id === editNews.id ? { ...item, ...itemData } : item
          )
        );
      } else if (itemData) {
        setNewsData((prev) => [...prev, itemData]);
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

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) return;
      setNewsData((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (item: NewsItem) => {
    setEditNews(item);
    setNewNews({
      title: item.title || "",
      content: item.content || "",
      published_at: item.published_at || "",
      link_text: item.link_text || "",
      link_url: item.link_url || "",
    });
    setShowCreate(true);
  };

  return (
    <>
      <div className="space-y-4 w-full max-w-full">
        {newsData.map((item) => {
          const parts = item.link_text
            ? item.content?.split(item.link_text) || [item.content]
            : [item.content || ""];

          return (
            <div
              key={item.id}
              className="relative w-full max-w-6xl mx-auto bg-white rounded-xl shadow-md p-4 border text-left -ml-[1px]"
            >
              <div className="absolute top-0 left-0 h-full w-2 bg-gradient-to-b from-purple-700 to-purple-400 rounded-l-xl"></div>

              <div className="flex flex-col md:flex-row md:items-start pl-3">
                <div className="flex-1">
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

                  {item.content && /<[a-z][\s\S]*>/i.test(item.content) ? (
                    <div
                      className="text-gray-700"
                      dangerouslySetInnerHTML={{ __html: item.content || "" }}
                    />
                  ) : item.link_text ? (
                    <p className="text-gray-700">
                      {parts[0]}
                      <Link
                        href={item.link_url!}
                        className="text-purple-700 underline hover:text-purple-800 font-medium"
                      >
                        {item.link_text}
                      </Link>
                      {parts[1]}
                    </p>
                  ) : (
                    <p className="text-gray-700">{item.content}</p>
                  )}
                </div>

                {isAdmin && (
                  <div className="flex mt-3 md:mt-0 md:ml-4 gap-2 md:flex-col">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 rounded-full text-purple-700 hover:bg-purple-100 hover:text-purple-900 transition"
                      aria-label="Edit news"
                    >
                      <Pencil size={20} />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-full text-red-600 hover:bg-red-100 hover:text-red-700 transition"
                      aria-label="Delete news"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isAdmin && (
        <div className="flex justify-center mt-6 px-4">
          <button
            onClick={() => setShowCreate(true)}
            className="
              px-6 py-2 mt-4
              w-full sm:w-auto
              font-medium rounded-lg
              border-2 border-purple-300
              bg-white text-purple-950
              transition-all duration-300 ease-out
              hover:bg-purple-700 hover:text-white
              hover:-translate-y-1
              active:translate-y-0
              disabled:opacity-70
              disabled:cursor-not-allowed
            "
          >
            + Create News
          </button>
        </div>

      )}

      {/* Create / Edit Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-slideUp">
            <h2 className="text-xl font-semibold text-[#2A0845] mb-4">
              {editNews ? "Edit News" : "Create News"}
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Title"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                value={newNews.title}
                onChange={(e) =>
                  setNewNews({ ...newNews, title: e.target.value })
                }
              />
              <textarea
                rows={3}
                placeholder="Detail"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                value={newNews.content}
                onChange={(e) =>
                  setNewNews({ ...newNews, content: e.target.value })
                }
              ></textarea>
              <input
                type="text"
                placeholder="Link text (optional)"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                value={newNews.link_text || ""}
                onChange={(e) =>
                  setNewNews({ ...newNews, link_text: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Link URL (optional)"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                value={newNews.link_url || ""}
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
                className="px-5 py-2 bg-purple-700 text-white rounded-lg shadow hover:bg-purple-800 transition font-medium"
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
