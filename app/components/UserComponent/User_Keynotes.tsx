"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { apiClient } from "@/lib/api";

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

interface Page { id: number; slug: string; }

const fetchKeynotes = async (): Promise<Keynote[]> => {
  const res = await apiClient.get<Keynote[]>('/keynotes');
  return res.data ?? [];
};

const fetchPageIdBySlug = async (slug: string): Promise<number | null> => {
  const res = await apiClient.get<Page>(`/pages/slug/${slug}`);
  return res.data?.id ?? null;
};


function formatTime(raw?: string): string {
  if (!raw) return '';
  const s = raw.trim();
  // Already AM/PM format: 9:00 AM or 09:00PM
  const ampm = s.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (ampm) {
    const h = parseInt(ampm[1], 10);
    const m = ampm[2];
    const mer = ampm[3].toUpperCase();
    return `${h}:${m} ${mer}`;
  }
  // 24h format HH:mm or HH:mm:ss
  const hms = s.match(/^(\d{2}):(\d{2})(?::\d{2})?$/);
  if (hms) {
    const hh = parseInt(hms[1], 10);
    const mm = hms[2];
    const mer = hh < 12 ? 'AM' : 'PM';
    const h12 = hh % 12 === 0 ? 12 : hh % 12;
    return `${h12}:${mm} ${mer}`;
  }
  // Fallback: return as-is
  return s;
}

function normalizeImageUrl(url: string, width: number, height: number): string {
  try {
    const u = new URL(url);
    // If the URL is an Unsplash page (not the image CDN), convert to a direct image URL
    // just for test modify later
    if (u.hostname === 'unsplash.com' && u.pathname.startsWith('/photos/')) {
      // photo id is the last path segment
      const segments = u.pathname.split('/').filter(Boolean);
      const id = segments[segments.length - 1];
      if (id) return `https://source.unsplash.com/${id}/${width}x${height}`;
    }
    return url;
  } catch {
    return url;
  }
}

function formatDate(s?: string): string {
  if (!s) return '';
  // Expecting YYYY-MM-DD; avoid timezone shifts by manual parse
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return s;
  const monthIdx = parseInt(m[2], 10) - 1;
  const day = m[3];
  const year = m[1];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const mon = months[Math.max(0, Math.min(11, monthIdx))];
  return `${mon} ${day}, ${year}`;
}

function KeynoteCard({ keynote }: { keynote: Keynote }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="grid grid-cols-[1fr,200px] items-stretch">
        {/* Left: Content */}
        <div className="p-6 h-full">
          <h3 className="text-xl font-semibold text-[#2A0845] mb-4 leading-snug">{keynote.title}</h3>
          <div className="text-gray-700 mb-6 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: keynote.content }} />
          <h3 className="text-xl font-semibold text-[#2A0845] mb-3">Biography</h3>
          <div className="text-gray-700 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: keynote.bio }} />
        </div>

        {/* Right: Speaker Card */}
        <div className="bg-purple-50 p-6 flex flex-col items-center justify-start gap-3 h-full border-l border-purple-100">
          {keynote.photo_url ? (
            <Image src={normalizeImageUrl(keynote.photo_url, 160, 160)} alt={keynote.name} width={160} height={160} className="rounded-lg object-cover w-full" />
          ) : (
            <div className="w-full aspect-square bg-gray-300 rounded-lg" />
          )}
          <div className="text-center w-full">
            <p className="font-bold text-slate-900 text-sm">{keynote.name}</p>
            <p className="text-xs text-gray-600 mt-1">{keynote.affiliation}</p>
          </div>
          {(keynote.date || keynote.time) && (
            <div className="mt-2 text-xs text-gray-700 text-center flex flex-col items-center gap-1 w-full">
              <span role="img" aria-label="calendar"></span>
              <div className="space-y-0.5">
                {keynote.date && <div className="font-medium">{formatDate(keynote.date)}</div>}
                {keynote.time && <div>{formatTime(keynote.time)}</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Keynotes({ pageId, pageSlug, keynotes, refreshToken }: { pageId?: number; pageSlug?: string; keynotes?: Keynote[]; refreshToken?: number }) {
  const [items, setItems] = useState<Keynote[]>(keynotes ?? []);
  const [loading, setLoading] = useState<boolean>(!keynotes);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (keynotes) {
        setItems(keynotes);
        setLoading(false);
        return;
      }
      setLoading(true);
      let pid = pageId ?? null;
      if (!pid && pageSlug) {
        pid = await fetchPageIdBySlug(pageSlug);
      }
      const all = await fetchKeynotes();
      const filtered = pid != null ? all.filter(k => k.page_id === pid) : all;
      if (mounted) {
        setItems(filtered);
        setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [pageId, pageSlug, keynotes, refreshToken]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-purple-700"></div>
        <p className="mt-2 text-gray-600 text-sm">Loading keynotes...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return <div className="text-center text-gray-500 py-12">No keynotes available at this time.</div>;
  }
  return (
    <div className="space-y-6">
      {items.map((keynote) => (
        <KeynoteCard key={keynote.id} keynote={keynote} />
      ))}
    </div>
  );
}

