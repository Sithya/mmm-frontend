'use client';

import React, { useEffect, useState } from 'react';

interface PageData {
  id: number;
  slug: string;
  title: string;
  content: string;
  component: string;
}

const FetchHomePage = () => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomePage = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages/slug/home`);
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
    <div className="" dangerouslySetInnerHTML={{ __html: content }} />
  );
};

export default FetchHomePage;
