'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TextEditor from '@/app/components/AdminComponent/TextEditor';

interface Page {
  id: number;
  slug: string;
  title: string;
  content: string | null;
  component: string | null;
}

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/pages`;

export default function AdminPageEditor() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();

  const [content, setContent] = useState('');
  const [pageId, setPageId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [componentName, setComponentName] = useState('');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch page by slug
  useEffect(() => {
    if (!slug) return;

    const fetchPage = async () => {
      try {
        const res = await fetch(`${API_URL}/slug/${slug}`, {
          cache: 'no-store',
        });

        if (res.status === 404) {
          // Page not created yet
          setTitle(slug.replace('-', ' '));
          setComponentName(`${slug}Page`);
          setContent('');
        } else if (!res.ok) {
          throw new Error('Failed to fetch page');
        } else {
          const page: Page = await res.json();
          setPageId(page.id);
          setTitle(page.title);
          setComponentName(page.component || '');
          setContent(page.content || '');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  // Save page
  const handleSubmit = async () => {
    if (saving || !slug) return;
    setSaving(true);

    try {
      const url = pageId ? `${API_URL}/${pageId}` : API_URL;
      const method = pageId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          title,
          content,
          component: componentName,
        }),
      });

      if (!res.ok) throw new Error('Failed to save');

      router.push(`/${slug}`);
    } catch (err) {
      console.error(err);
      alert('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6 text-center">Loading...</p>;

  return (
    <div className="max-h-screen bg-gray-50 p-6 mt-20">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 flex flex-col h-[85vh]">
        <h1 className="text-2xl font-bold text-purple-900 mb-4">
          Edit Page: {slug}
        </h1>

        {/* Tabs */}
        <div className="flex border-b border-purple-300 mb-4">
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-2 font-semibold ${
              activeTab === 'edit'
                ? 'border-b-4 border-purple-700 text-purple-900'
                : 'border-b-4 border-transparent text-purple-700'
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`ml-4 px-4 py-2 font-semibold ${
              activeTab === 'preview'
                ? 'border-b-4 border-purple-700 text-purple-900'
                : 'border-b-4 border-transparent text-purple-700'
            }`}
          >
            Preview
          </button>
        </div>

        {/* Editor / Preview */}
        <div className="flex-1 overflow-y-auto pr-2">
          {activeTab === 'edit' ? (
            <TextEditor
              initialValue={content}
              onChange={setContent}
              allowMap
              allowImage
            />
          ) : (
            <div className="bg-gray-50 border border-purple-200 rounded-xl p-6">
              <div
                dangerouslySetInnerHTML={{
                  __html: content || '<p>No content to preview.</p>',
                }}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-purple-200">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 rounded-lg bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2 rounded-lg bg-purple-700 text-white"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
