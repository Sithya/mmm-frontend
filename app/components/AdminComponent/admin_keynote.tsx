'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '../../../lib/api';
import React from 'react';

interface Page {
  id: number;
  slug: string;
  title: string;
  content: string | null;
  json?: Record<string, any> | null;
  component?: string | null;
  created_at?: string;
  updated_at?: string;
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
  onChange?: (action: 'create' | 'update' | 'delete', payload: any) => void;
  className?: string;
};

export default function AdminKeynote({
  pageSlug: providedPageSlug = 'conference',
  pageId: providedPageId = null,
  onChange,
  className,
}: AdminKeynoteProps) {
  const [keynotes, setKeynotes] = useState<Keynote[]>([]);
  const [loading, setLoading] = useState(true);
  // Only keynote management on this page
  
  // Keynote form state
  const [showKeynoteModal, setShowKeynoteModal] = useState(false);
  const [editingKeynoteId, setEditingKeynoteId] = useState<number | null>(null);
  const [keynoteForm, setKeynoteForm] = useState({
    page_id: '',
    name: '',
    title: '',
    photo_url: '',
    affiliation: '',
    bio: '',
    content: '',
    date: '',
    time: '',
  });
  const [pageSlug] = useState(providedPageSlug);
  const [currentPageId, setCurrentPageId] = useState<number | null>(providedPageId);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const keynotesRes = await apiClient.get<Keynote[]>('/keynotes');
      setKeynotes(keynotesRes.data || []);
      if (!providedPageId) {
        const pagesRes = await apiClient.get<Page[]>('/pages');
        const conferencePage = pagesRes.data?.find((p: Page) => p.slug === pageSlug);
        if (conferencePage) setCurrentPageId(conferencePage.id);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Ensure we have a page_id for keynotes (auto-create conference page if missing)
  const ensureConferencePageId = async (): Promise<number | null> => {
    if (currentPageId) return currentPageId;
    try {
      if (providedPageId) {
        setCurrentPageId(providedPageId);
        return providedPageId;
      }
      const pagesRes = await apiClient.get<Page[]>('/pages');
      const conferencePage = pagesRes.data?.find((p: Page) => p.slug === pageSlug);
      if (conferencePage) {
        setCurrentPageId(conferencePage.id);
        return conferencePage.id;
      }
      // Auto-create only when a slug is provided and page is missing
      const createRes = await apiClient.post<Page>('/pages', {
        slug: pageSlug,
        title: 'Conference',
        content: '',
      });
      if (createRes.data?.id) {
        setCurrentPageId(createRes.data.id);
        return createRes.data.id;
      }
      return null;
    } catch (e) {
      console.error('Failed to ensure conference page exists:', e);
      return null;
    }
  };

  // Keynote CRUD operations
  const openKeynoteModal = (keynote?: Keynote) => {
    if (keynote) {
      setEditingKeynoteId(keynote.id);
      setKeynoteForm({
        page_id: String(keynote.page_id || currentPageId || ''),
        name: keynote.name,
        title: keynote.title,
        photo_url: keynote.photo_url || '',
        affiliation: keynote.affiliation,
        bio: keynote.bio,
        content: keynote.content,
        date: keynote.date || '',
        time: keynote.time || '',
      });
    } else {
      setEditingKeynoteId(null);
      setKeynoteForm({
        page_id: String(currentPageId || ''),
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
    setShowKeynoteModal(true);
  };

  const handleSaveKeynote = async () => {
    if (!keynoteForm.name.trim()) {
      alert('Please enter keynote name');
      return;
    }

    const pageId = await ensureConferencePageId();
    if (!pageId) {
      alert('Could not ensure conference page. Please try again.');
      return;
    }

    try {
      const payload = {
        page_id: pageId,
        name: keynoteForm.name,
        title: keynoteForm.title,
        photo_url: keynoteForm.photo_url,
        affiliation: keynoteForm.affiliation,
        bio: keynoteForm.bio,
        content: keynoteForm.content,
        date: keynoteForm.date,
        time: keynoteForm.time,
      };

      if (editingKeynoteId) {
        const res = await apiClient.put(`/keynotes/${editingKeynoteId}`, payload);
        alert('Keynote updated successfully!');
        onChange?.('update', { id: editingKeynoteId, ...payload });
      } else {
        const res = await apiClient.post('/keynotes', payload);
        alert('Keynote created successfully!');
        onChange?.('create', payload);
      }

      setShowKeynoteModal(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save keynote:', error);
      alert('Failed to save keynote. Please try again.');
    }
  };

  const handleDeleteKeynote = async (id: number) => {
    if (!confirm('Are you sure you want to delete this keynote?')) return;

    try {
      await apiClient.delete(`/keynotes/${id}`);
      alert('Keynote deleted successfully!');
      onChange?.('delete', { id });
      fetchData();
    } catch (error) {
      console.error('Failed to delete keynote:', error);
      alert('Failed to delete keynote. Please try again.');
    }
  };
  return (
    <div className={className}>
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-purple-900">Keynotes</h2>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-purple-700"></div>
            <p className="mt-2 text-gray-600 text-sm">Loading...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {keynotes.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No keynotes yet.</p>
            ) : (
              <div className="space-y-4">
                {keynotes.map((keynote) => (
                  <div key={keynote.id} className="border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-purple-900">{keynote.name}</h3>
                        <p className="text-gray-700 font-medium mt-1">{keynote.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{keynote.affiliation}</p>
                        {(keynote.date || keynote.time) && (
                          <div className="mt-2 text-sm text-gray-500">
                            {keynote.date && <span>📅 {keynote.date}</span>}
                            {keynote.time && <span className="ml-3">🕐 {keynote.time}</span>}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => openKeynoteModal(keynote)}
                          className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteKeynote(keynote.id)}
                          className="px-4 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-center pt-4">
              <button
                onClick={() => openKeynoteModal()}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg transition"
              >
                + Add New Keynote
              </button>
            </div>
          </div>
        )}
      </div>

      {showKeynoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-purple-900 mb-4">
                {editingKeynoteId ? 'Edit Keynote' : 'Create New Keynote'}
              </h2>

              <form onSubmit={(e) => { e.preventDefault(); handleSaveKeynote(); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={keynoteForm.name}
                    onChange={(e) => setKeynoteForm({ ...keynoteForm, name: e.target.value })}
                    placeholder="Speaker name"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={keynoteForm.title}
                    onChange={(e) => setKeynoteForm({ ...keynoteForm, title: e.target.value })}
                    placeholder="Talk title"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL</label>
                  <input
                    type="url"
                    value={keynoteForm.photo_url}
                    onChange={(e) => setKeynoteForm({ ...keynoteForm, photo_url: e.target.value })}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Affiliation</label>
                  <input
                    type="text"
                    value={keynoteForm.affiliation}
                    onChange={(e) => setKeynoteForm({ ...keynoteForm, affiliation: e.target.value })}
                    placeholder="University / Company"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio (HTML)</label>
                  <textarea
                    value={keynoteForm.bio}
                    onChange={(e) => setKeynoteForm({ ...keynoteForm, bio: e.target.value })}
                    placeholder="Speaker biography"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content (HTML)</label>
                  <textarea
                    value={keynoteForm.content}
                    onChange={(e) => setKeynoteForm({ ...keynoteForm, content: e.target.value })}
                    placeholder="Talk description"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="text"
                      value={keynoteForm.date}
                      onChange={(e) => setKeynoteForm({ ...keynoteForm, date: e.target.value })}
                      placeholder="May 5, 2026"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="text"
                      value={keynoteForm.time}
                      onChange={(e) => setKeynoteForm({ ...keynoteForm, time: e.target.value })}
                      placeholder="10:00 AM"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowKeynoteModal(false)}
                    className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg transition"
                  >
                    {editingKeynoteId ? 'Update' : 'Create'}
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
