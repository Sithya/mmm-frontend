import NewsCard from "../HybridComponent/NewsCard";

const API_BASE = process.env.API_INTERNAL_URL;

async function getPage(slug: string) {
  const res = await fetch(`${process.env.API_INTERNAL_URL}/pages/slug/${slug}`, { cache: 'no-store' });
  return res.json();
}

async function hasNews(pageId: number) {
  const res = await fetch(`${API_BASE}/news?page_id=${pageId}`);
  if (!res.ok) return false;
  const data = await res.json();
  return data.length > 0;
}

async function hasKeynotes(pageId: number) {
  const res = await fetch(`${API_BASE}/keynotes?page_id=${pageId}`);
  if (!res.ok) return false;
  const data = await res.json();
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
              <div key={section.id} className="ql-snow max-w-5xl my-6">
                <div
                  className="ql-editor"
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

          // case 'keynotes':
          //   return (
          //     <KeynoteCard
          //       key={section.id}
          //       pageId={section.data.page_id}
          //     />
          //   );

          default:
            return null;
        }
      })}
    </>
  );
}
