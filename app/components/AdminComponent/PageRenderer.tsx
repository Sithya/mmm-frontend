import Keynotes from "../HybridComponent/KeyNote";
import NewsCard from "../HybridComponent/NewsCard";

const API_BASE = process.env.API_INTERNAL_URL;

async function getPage(slug: string) {
  const res = await fetch(`${process.env.API_INTERNAL_URL}/pages/slug/${slug}`, { cache: 'no-store' });
  const response = await res.json();
  // Handle both old format (direct page object) and new format ({success, data, message})
  return response.data || response;
}

async function hasNews(pageId: number) {
  const res = await fetch(`${API_BASE}/news?page_id=${pageId}`);
  if (!res.ok) return false;
  const response = await res.json();
  // Handle both old format (array) and new format ({success, data, message})
  const data = Array.isArray(response) ? response : (response.data || []);
  return data.length > 0;
}

async function hasKeynotes(pageId: number) {
  const res = await fetch(`${API_BASE}/keynotes?page_id=${pageId}`);
  if (!res.ok) return false;
  const response = await res.json();
  // Handle both old format (array) and new format ({success, data, message})
  const data = Array.isArray(response) ? response : (response.data || []);
  return data.length > 0;
}

export default async function PageRenderer({ slug }: { slug: string }) {
  const page = await getPage(slug);
  let sections = page.json?.sections || [];

  const newsExists = slug === 'home' && await hasNews(page.id); // news only on home
  const keynotesExists = slug === 'conference' && await hasKeynotes(page.id); // keynotes only on conference

  let resultSections: any[] = [];

  sections.forEach((section: any, index: number) => {
    resultSections.push(section);

    // Insert news after first text section on home page
    if (newsExists && slug === 'home' && section.type === 'text' && !resultSections.some(s => s.type === 'news')) {
      resultSections.push({
        id: `news-auto`,
        type: 'news',
        data: { page_id: page.id }
      });
    }

    // Insert keynotes after first text section on conference page
    if (keynotesExists && slug === 'conference' && section.type === 'text' && !resultSections.some(s => s.type === 'keynotes')) {
      resultSections.push({
        id: `keynotes-auto`,
        type: 'keynotes',
        data: { page_id: page.id }
      });
    }
  });

  return (
    <>
      {resultSections.map((section: any) => {
        switch (section.type) {
          case 'text':
            return (
              <div key={section.id} className="ql-snow w-full max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-6xl my-6 text-gray-900 px-4 sm:px-6">
                <div
                  className="ql-editor prose sm:prose-sm md:prose md:prose-lg lg:prose-xl"
                  dangerouslySetInnerHTML={{ __html: section.data.html }}
                />
              </div>

            );

          case 'news':
            return (
              <NewsCard
                key={section.id}
                pageId={section.data.page_id}
              />
            );

          case 'keynotes':
            return (
              <Keynotes
                key={section.id}
                pageId={section.data.page_id}
                isAdmin={true}
              />
            );

          default:
            return null;
        }
      })}
    </>
  );
}
