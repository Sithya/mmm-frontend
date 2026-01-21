'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
// import { useAuth } from '@/context/AuthContext';

export default function EditPageButton() {
  // const { user } = useAuth();
  // const isAdmin = user?.is_admin === true;

  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // if (!isAdmin) return null;

  const slug = pathname.slice(1).replace(/\//g, '-') || 'home';

  const handleClick = () => {
    setLoading(true);
    router.push(`/admin/pages/${slug}`);
  };

  return (
    <div className="flex justify-center mt-8">
      <button
        onClick={handleClick}
        disabled={loading}
        className="
          px-6 py-2 mt-4 mb-10
          font-medium rounded-lg
          border-2 border-purple-300
          bg-white text-purple-950
          transition-all duration-300 ease-out
          hover:bg-purple-700 hover:text-white
          hover:-translate-y-3
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
