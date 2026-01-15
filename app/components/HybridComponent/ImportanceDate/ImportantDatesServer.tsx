import React from "react";
import ImportantDates from "./ImportantDates";

interface DateItem {
  id: number;
  due_date: string;       // ISO date string
  description: string;
}

export default async function ImportantDatesServer() {
  const res = await fetch(`${process.env.API_INTERNAL_URL}/important-dates`);
  if (!res.ok) {
    throw new Error("Failed to fetch important dates");
  }

  const json = await res.json();

  // Map API items to the format the client expects
  const dates: { id: number; due_date: string; title: string }[] = json.data.items
    .map((item: DateItem) => ({
      id: item.id,
      due_date: item.due_date,
      title: item.description,
    }))
    // Sort by due_date ascending to match the sidebar format
    .sort((a: { due_date: string }, b: { due_date: string }) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());

  return <ImportantDates initialDates={dates} />;
}
