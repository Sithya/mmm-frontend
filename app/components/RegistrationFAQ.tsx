"use client";

import React, { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";

type FAQItem = {
  question: string;
  answer: string;
  order?: number;
};

type Page = { id: number; slug: string; content: string | null };



export default function RegistrationFAQ() {
  const [items, setItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get<Page>("/pages/slug/registration-faq");
        const page = res.data;
        let next: FAQItem[] = [];
        if (page?.content) {
          try {
            const maybe = JSON.parse(page.content);
            if (Array.isArray(maybe)) {
              next = maybe.filter(x => typeof x?.question === "string" && typeof x?.answer === "string");
            }
          } catch {}
        }
        next.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        if (mounted) setItems(next);
      } catch {
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <section className="max-w-4xl mx-auto px-[90px] py-16">
      <h1 className="text-3xl md:text-4xl font-semibold text-center text-slate-900 mb-10">
        Registration FAQ
      </h1>

      {loading ? (
        <p className="text-left text-gray-500">Loading FAQs...</p>
      ) : items.length === 0 ? (
        <div className="text-left text-gray-500 py-8">No FAQs available at this time.</div>
      ) : (
        <div className="space-y-6">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 text-left"
            >
              <h2 className="text-sm font-semibold text-slate-900 mb-3">
                {item.question}
              </h2>
              <p className="text-sm leading-6 text-slate-700 whitespace-pre-line">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
