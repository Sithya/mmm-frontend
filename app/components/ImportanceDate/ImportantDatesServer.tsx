import React from 'react'
import ImportantDates from './ImportantDates';

interface DateItem {
    id: number;
    dueDate: string;
    description: string;
}

function parseDateItem (item: DateItem){
    const date = new Date(item.dueDate);
    const month = date.toLocaleString('en-US', { month: 'short'}).toUpperCase();
    const day = date.getDate().toString();
    const year = date.toLocaleString('en-US', { year: 'numeric'});
    return { id: item.id, month, day, year, title: item.description };
}

export default async function ImportantDatesServer() {
    const res = await fetch('http://localhost:8000/api/important-dates');
    if(!res.ok){
        throw new Error('Falied to fetch important dates');
    }
    const json = await res.json();
    const dates = json.data.items.map(parseDateItem);

    return <ImportantDates initialDates={dates} />;
}
