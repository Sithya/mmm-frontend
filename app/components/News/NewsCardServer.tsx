import NewsCard from "./NewsCard";

interface NewsItem {
  id: number;
  page_id?: number;
  title: string;
  content?: string;
  published_at?: string;
  linkText?: string;
  link?: string;
}

export default async function NewsPage() {
  const res = await fetch(`${process.env.API_INTERNAL_URL}/news`, { cache: "no-store" });
  if(!res.ok) throw new Error('Failed to fetch news card');
  const news = await res.json();

  return <NewsCard initialNews={news} />;
}
