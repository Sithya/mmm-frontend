'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TextEditor from '@/app/components/TextEditor';

interface Page {
  id: number;
  slug: string;
  title: string;
  content: string | null;
  component: string | null;
}

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/pages`;
const PAGE_SLUG = 'home';

export default function AdminContentPage() {
  const router = useRouter();

  const [content, setContent] = useState('');
  const [pageId, setPageId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch homepage (via apiResource index)
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await fetch(API_URL, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch pages');

        const pages: Page[] = await res.json();
        const homePage = pages.find(p => p.slug === PAGE_SLUG);

        if (homePage) {
          setPageId(homePage.id);
          setContent(homePage.content || '');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, []);

  // Save (create or update)
  const handleSubmit = async () => {
    if (saving) return;
    setSaving(true);

    try {
      const url = pageId ? `${API_URL}/${pageId}` : API_URL;
      const method = pageId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: PAGE_SLUG,
          title: 'Home',
          content,
          component: 'HomePage',
        }),
      });

      if (!res.ok) throw new Error('Failed to save');

      router.push('/home');
    } catch (err) {
      console.error(err);
      alert('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return <p className="p-6 text-center">Loading...</p>;
  }

  return (
  <div className="max-h-screen bg-gray-50 p-6 mt-20">
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 flex flex-col h-[85vh]">

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-purple-900 mb-4">
        {activeTab === 'edit' ? 'Add Content' : 'Content Preview'}
      </h1>

      {/* Tabs */}
      <div className="flex border-b border-purple-300 mb-4">
        <button
          type="button"
          onClick={() => setActiveTab('edit')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'edit'
              ? 'border-b-4 border-purple-700 text-purple-900'
              : 'border-b-4 border-transparent text-purple-700'
          }`}
        >
          Add Content
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`ml-4 px-4 py-2 font-semibold ${
            activeTab === 'preview'
              ? 'border-b-4 border-purple-700 text-purple-900'
              : 'border-b-4 border-transparent text-purple-700'
          }`}
        >
          Content Preview
        </button>
      </div>

      {/* Editor / Preview  */}
      <div className="flex-1 overflow-y-auto pr-2">
        {activeTab === 'edit' ? (
          <TextEditor
            initialValue={content}
            onChange={setContent}
            allowMap
            allowImage
          />
        ) : (
          <div className="bg-gray-50 border border-purple-200 rounded-xl p-6 min-h-[300px]">
            <div
              className="prose max-w-full"
              dangerouslySetInnerHTML={{
                __html: content || '<p>No content to preview.</p>',
              }}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-purple-200">
        <button
          type="button"
          onClick={handleCancel}
          className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

    </div>
  </div>
);

}
