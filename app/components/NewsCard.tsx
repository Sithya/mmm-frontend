"use client";

import { useState } from "react";
import Link from "next/link";

export default function NewsCard() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const newsData = [
    {
      id: "1",
      title: "Accompanying Program: Experience Prague’s Medieval Spirit at MMM 2026",
      detail: "Prague is well known for its rich history, especially Medieval era. During MMM 2026, we invite you to explore...",
      date: "November 1, 2026",
    },
    {
      id: "2",
      title: "Registration",
      detail: "Conference registration is now open for early-bird registrations.",
      date: "October 29, 2026",
    },
    {
      id: "3",
      title: "Submission site open",
      detail: "The submission site is now open! Visit the submission guidelines for more details.",
      date: "July 14, 2026",
      link: "/submission",
      linkText: "submission guidelines", 
    },
  ];

  const isAdmin = false;

  return (
    <div className="space-y-4">
      {newsData.map((item) => {
        const expanded = expandedId === item.id;

        // For partial hyperlink
        const parts = item.linkText
          ? item.detail.split(item.linkText)
          : [item.detail];

        return (
          <div
            key={item.id}
            className="relative w-full bg-white rounded-xl shadow-md p-4 border text-left cursor-pointer "
            onClick={() => setExpandedId(expanded ? null : item.id)}>

            <div className="absolute top-0 left-0 h-full w-2 bg-gradient-to-b from-purple-700 to-purple-400 rounded-l-xl"></div>


            {/* Content */}
            <div className="flex-1 pl-3">
              <p className="text-gray-500 text-sm mb-1 font-semibold">{item.date}</p>

              <h2 className="font-semibold text-lg text-gray-900 mb-1">{item.title}</h2>

              {/* Detail text with partial link */}
              <p className={`text-gray-700 transition-all duration-300 ${expanded ? "line-clamp-none" : "line-clamp-1"}`}>
                {item.linkText ? (
                  <>
                    {parts[0]}
                    <Link
                      href={item.link!}
                      className="text-purple-600 underline hover:text-purple-800"
                      onClick={(e) => e.stopPropagation()}>
                      {item.linkText}
                    </Link>
                    {parts[1]}
                  </>
                ) : (
                  item.detail
                )}
              </p>
            </div>

            {/* Admin buttons */}
            {isAdmin && (
              <div
                className="absolute top-3 right-3 flex gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700">
                  Edit
                </button>
                <button className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700">
                  Delete
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
