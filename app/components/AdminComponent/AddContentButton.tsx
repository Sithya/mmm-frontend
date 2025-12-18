import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function EditPageButton() {
    const pathname = usePathname();
    const slug = pathname.slice(1).replace(/\//g, '-') || "home"; // Remove leading slash and replace slashes with dashes 
    const addContent = true
  return (
    <Link href={`/admin/pages/${slug}`}>
      <div className="flex justify-center mt-8">
        <div
          className="px-6 py-2 bg-purple-800 text-white rounded-lg shadow hover:bg-purple-900 transition font-medium duration-300 mb-10">
          {addContent ? '+ Add Content' : 'Loading...'}
        </div>
      </div>
    </Link>
  );
}
