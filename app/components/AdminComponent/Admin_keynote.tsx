'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../lib/api';

interface Page {
  id: number;
  slug: string;
  title: string;
  content: string | null;
}

interface Keynote {
  id: number;
  page_id: number | null;
  name: string;
  photo_url: string | null;
  affiliation: string;
  title: string;
  bio: string;
  content: string;
  created_at: string;
  updated_at: string;
  date?: string;
  time?: string;
}

type AdminKeynoteProps = {
  pageSlug?: string;
  pageId?: number | null;
  className?: string;
};

export default function AdminKeynote({
  pageSlug = 'conference',
  pageId = null,
  className,
}: AdminKeynoteProps) {
  const [keynotes, setKeynotes] = useState<Keynote[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [currentPageId, setCurrentPageId] = useState<number | null>(pageId);

  const [form, setForm] = useState({
    name: '',
    title: '',
    photo_url: '',
    affiliation: '',
    bio: '',
    content: '',
    date: '',
    time: '',
  });

  /* ---------------------------------- FETCH --------------------------------- */

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const keynotesRes = await apiClient.get<Keynote[]>('/keynotes');
      setKeynotes(keynotesRes.data || []);

      if (!pageId) {
        const pagesRes = await apiClient.get<Page[]>('/pages');
        const page = pagesRes.data?.find(p => p.slug === pageSlug);
        if (page) setCurrentPageId(page.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------- OPEN CREATE / EDIT --------------------------- */

  const openModal = (keynote?: Keynote) => {
    if (keynote) {
      setEditingId(keynote.id);
      setForm({
        name: keynote.name,
        title: keynote.title,
        photo_url: keynote.photo_url ?? '',
        affiliation: keynote.affiliation,
        bio: keynote.bio,
        content: keynote.content,
        date: keynote.date ?? '',
        time: keynote.time ?? '',
      });
    } else {
      setEditingId(null);
      setForm({
        name: '',
        title: '',
        photo_url: '',
        affiliation: '',
        bio: '',
        content: '',
        date: '',
        time: '',
      });
    }

    setShowModal(true);
  };

  /* ------------------------------ CREATE / UPDATE ----------------------------- */

  const handleSave = async () => {
    if (!form.name.trim()) return;

    const payload = {
      page_id: currentPageId,
      ...form,
    };

    try {
      if (editingId) {
        await apiClient.put(`/keynotes/${editingId}`, payload);
      } else {
        await apiClient.post('/keynotes', payload);
      }

      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------------------------- DELETE --------------------------------- */

  const handleDelete = async (id: number) => {
    // try {
    //   await apiClient.delete(`/keynotes/${id}`);
    //   fetchData();
    // } catch (err) {
    //   console.error(err);
    // }

    try {
      // const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const res = await fetch(`http://localhost:8000/api/v1/keynotes/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Delete failed:", errorText);
        return;
      }
      setKeynotes((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------------------------- RENDER --------------------------------- */

  return (
    <div className={className}>
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-purple-900">Keynotes</h2>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : keynotes.length === 0 ? (
          <p className="text-center text-gray-500">No keynotes yet.</p>
        ) : (
          <div className="space-y-4">
            {keynotes.map(keynote => (
              <div
                key={keynote.id}
                className="border rounded-lg p-4 flex justify-between items-start"
              >
                <div>
                  <h3 className="font-semibold text-purple-900">
                    {keynote.name}
                  </h3>
                  <p className="text-gray-700">{keynote.title}</p>
                  <p className="text-sm text-gray-500">
                    {keynote.affiliation}
                  </p>
                  {(keynote.date || keynote.time) && (
                    <p className="text-sm text-gray-500 mt-1">
                      {keynote.date} {keynote.time}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(keynote)}
                    className="px-4 py-1 bg-blue-600 text-white rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(keynote.id)}
                    className="px-4 py-1 bg-red-600 text-white rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => openModal()}
            className="px-4 py-2 bg-purple-900 hover:bg-purple-800 text-white rounded-lg"
          >
            + Add Keynote
          </button>
        </div>
      </div>

      {/* ============================== MODAL ============================== */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-purple-900 mb-4">
                {editingId ? 'Edit Keynote' : 'Create Keynote'}
              </h2>

              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSave();
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      required
                      title="Name"
                      placeholder="Name"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />

                    <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">Title</label>
                    <input
                      title="Title"
                      placeholder="Title"
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                    <div className="border rounded-lg p-3 flex items-center gap-3">
                      <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                        {form.photo_url ? (
                          <img src={form.photo_url} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gray-400 text-xs">No image</span>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <input
                          type="file"
                          title="Upload Image"
                          accept="image/*"
                          onChange={e => {
                            const file = e.target.files?.[0] || null;
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                const dataUrl = typeof reader.result === 'string' ? reader.result : '';
                                // For now, set preview via data URL; optionally allow saving this as photo_url just use backend to post url
                                setForm(prev => ({ ...prev, photo_url: dataUrl }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                        <input
                          title="Image URL"
                          // placeholder removed
                          // value removed
                          // onChange removed
                          className="hidden"
                        />
                        
                      </div>
                    </div>
                  </div>
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-1">Affiliation</label>
                <input
                  title="Affiliation"
                  placeholder="Affiliation"
                  value={form.affiliation}
                  onChange={e =>
                    setForm({ ...form, affiliation: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />

                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  title="Content"
                  placeholder="Content"
                  rows={3}
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />


                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  title="Bio"
                  placeholder="Bio"
                  rows={3}
                  value={form.bio}
                  onChange={e => setForm({ ...form, bio: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={e => setForm({ ...form, date: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={e => setForm({ ...form, time: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 bg-gray-200 rounded-lg"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg"
                  >
                    {editingId ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
