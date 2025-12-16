import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function EditPageButton() {
    const pathname = usePathname();
    const slug = pathname.slice(1).replace(/\//g, '-') || "home"; // Remove leading slash and replace slashes with dashes 
  return (
    <Link href={`/admin/pages/${slug}`}>
      <div className="flex justify-center">
        <div
          className="w-48 h-16 flex items-center justify-center border border-purple-300 rounded-xl shadow-sm
          hover:shadow-md cursor-pointer transition-all duration-300 text-purple-900 font-semibold text-lg mb-10"
        >
          + Add Content
        </div>
      </div>
    </Link>
  );
}
