'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from "../AuthProvider";


export default function EditPageButton() {
  const { user } = useAuth();
  const isAdmin = user?.is_admin === true;

  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!isAdmin) return null;

  const slug = pathname.slice(1).replace(/\//g, '-') || 'home';

  const handleClick = () => {
    setLoading(true);
    router.push(`/admin/pages/${slug}`);
  };

  return (
    <div className="flex justify-center mt-8 px-4">
      <button
        onClick={handleClick}
        disabled={loading}
        aria-label="Add new page content"
        className="
          px-6 py-2 mb-8
          w-full sm:w-auto
          font-medium rounded-lg
          border-2 border-purple-300
          bg-white text-purple-950
          transition-all duration-300 ease-out
          hover:bg-purple-700 hover:text-white
          hover:-translate-y-1
          active:translate-y-0
          disabled:opacity-70
          disabled:cursor-not-allowed
        "
      >
        {loading ? 'Loading...' : '+ Add Content'}
      </button>
    </div>
  );
}
