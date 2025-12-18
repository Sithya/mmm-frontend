'use client';

import React, { useEffect, useState } from 'react';
import 'react-quill-new/dist/quill.snow.css'; 

interface PageData {
  id: number;
  slug: string;
  title: string;
  content: string;
  component: string;
}

interface PageContentProps {
  slug?: string; // optional, will auto-detect if not provided
}

import { usePathname } from 'next/navigation';

const PageContent: React.FC<PageContentProps> = ({ slug: propSlug }) => {
  const pathname = usePathname();
  const slug = propSlug || pathname?.slice(1) || 'home'; // default to 'home'

  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages/slug/${slug}`);
        if (!res.ok) throw new Error('Failed to fetch page content');
        const data: PageData = await res.json();
        setContent(data.content || '');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPageContent();
  }, [slug]);

  if (loading) return <p>Loading page content...</p>;

  return (
    <div className="max-w-7xl">
      <div className="ql-snow">
        <div
          className="ql-editor"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default PageContent;
