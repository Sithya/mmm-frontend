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
  // Sort by due_date ascending (soonest first)
  dates.sort(
    (a, b) => Date.parse(a.due_date) - Date.parse(b.due_date)
  );


  return <ImportantDates initialDates={dates} />;
}
