'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TextEditor from '@/app/components/TextEditor';

export default function AdminContentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Pre-fill content from query params if any
  const initialContent = searchParams.get('content') || '';
  const [content, setContent] = useState(initialContent);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  const hasData = Boolean(content);

  const handleCancel = () => router.back();

  const handleSubmit = () => {
    console.log('Content:', content);
    alert(`${hasData ? 'Edited' : 'Created'} successfully!`);
    router.push('/admin'); // redirect after saving
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-20">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-purple-900 mb-6">
          {hasData ? 'Edit Content' : 'Create New Content'}
        </h1>

        {/* Tabs */}
        <div className="flex border-b border-purple-300 mb-6">
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-2 font-semibold text-purple-900 ${
              activeTab === 'edit' ? 'border-b-4 border-purple-700' : 'border-b-4 border-transparent'
            } transition`}
          >
            Edit Content
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`ml-4 px-4 py-2 font-semibold text-purple-900 ${
              activeTab === 'preview' ? 'border-b-4 border-purple-700' : 'border-b-4 border-transparent'
            } transition`}
          >
            Preview Content
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'edit' ? (
          <TextEditor
            initialValue={content}
            onChange={(val) => setContent(val)}
            allowMap={true}
            allowImage={true}
          />
        ) : (
          <div className="bg-gray-50 border border-purple-200 rounded-xl p-6 min-h-[300px]">
            <div
              className="prose max-w-full"
              dangerouslySetInnerHTML={{ __html: content || '<p>No content to preview.</p>' }}
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={handleCancel}
            className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white transition"
          >
            {hasData ? 'Edit' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
