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
          className="px-6 py-2 mt-4 text-purple-950 border-purple-300 border-2  rounded-lg shadow hover:bg-purple-200 transition font-medium duration-300 mb-10 hover:border-none ">
          {addContent ? '+ Add Content' : 'Loading...'}
        </div>
      </div>
    </Link>
  );
}
