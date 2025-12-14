'use client';

import React, { useEffect, useState } from 'react';
import 'react-quill-new/dist/quill.snow.css'; // add this line when you want to display the text editor content

interface PageData {
  id: number;
  slug: string;
  title: string;
  content: string;
  component: string;
}

const FetchHomePage = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomePage = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/pages/slug/home`
        );
        if (!res.ok) throw new Error('Failed to fetch homepage content');
        const data: PageData = await res.json();
        setContent(data.content || '');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomePage();
  }, []);

  if (loading) return <p>Loading homepage...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* Quill display wrapper */}
      <div className="ql-snow">
        <div
          className="ql-editor"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default FetchHomePage;
