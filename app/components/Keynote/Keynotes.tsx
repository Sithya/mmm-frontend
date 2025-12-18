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

const fetchKeynotes = async (): Promise<Keynote[]> => {
  const res = await apiClient.get<Keynote[]>('/keynotes');
  return res.data ?? [];
};


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
                {keynote.date && <div className="font-medium">{keynote.date}</div>}
                {keynote.time && <div>{keynote.time}</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Keynotes({ keynotes }: { keynotes: Keynote[] }) {
  if (keynotes.length === 0) {
    return <div className="text-center text-gray-500 py-12">No keynotes available at this time.</div>;
  }
  return (
    <div className="space-y-6">
      {keynotes.map((keynote) => (
        <KeynoteCard key={keynote.id} keynote={keynote} />
      ))}
    </div>
  );
}

