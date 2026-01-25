"use client";

import React, { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { Pencil, Trash2 } from 'lucide-react';

type FaqItem = {
    id?: number;
    question: string;
    answer: string;
    order?: number;
};


type Page = { id: number; slug: string; title: string; content: string | null };

export default function AdminFaq({ className }: { className?: string }) {
    const [items, setItems] = useState<FaqItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [pageId, setPageId] = useState<number | null>(null);

    const [showModal, setShowModal] = useState<boolean>(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<{ index: number; id?: number; question?: string } | null>(null);
    const [form, setForm] = useState<FaqItem>({ question: "", answer: "", order: 0 });
    const [error, setError] = useState<string | null>(null);

    const loadFaqs = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiClient.get<FaqItem[]>("/faqs");
            setItems((res.data ?? []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));

            // const page = res.data;
            // if (page?.id) setPageId(page.id);
            // let parsed: FaqItem[] | null = null;
            // if (page?.content) {
            //     try {
            //         const maybe = JSON.parse(page.content);
            //         if (Array.isArray(maybe)) {
            //             parsed = maybe.filter(x => typeof x?.question === "string" && typeof x?.answer === "string");
            //         }
            //     } catch {
            //         // ignore parse errors; will fall back
            //     }
            // }
            // const next = parsed ?? [];
            // next.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            // setItems(next);
        } catch (e: any) {
            // If slug doesn't exist, keep empty and allow initialize
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadFaqs(); }, []);

    const openModal = (index?: number) => {
        if (index != null) {
            setEditingIndex(index);
            setForm(items[index]);
        } else {
            setEditingIndex(null);
            setForm({ question: "", answer: "", order: (items[items.length - 1]?.order ?? 0) + 1 });
        }
        setShowModal(true);
    };

    const persist = async (nextItems: FaqItem[]) => {
        setSaving(true);
        setError(null);
        try {
            // ensure sorted order before saving
            const sorted = [...nextItems].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            const payload = { content: JSON.stringify(sorted) } as any;
            if (pageId) {
                await apiClient.put(`/pages/${pageId}`, payload);
            } else {
                // create page if it doesn't exist yet
                const createRes = await apiClient.post<Page>("/pages", {
                    title: "Registration FAQ",
                    slug: "registration-faq",
                    content: payload.content,
                });
                setPageId(createRes.data?.id ?? null);
            }
            setItems(sorted);
        } catch (e: any) {
            setError("Failed to save FAQs. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleSave = async () => {
        if (!form.question.trim() || !form.answer.trim()) return;
        const next = [...items];
        if (editingIndex != null) {
            next[editingIndex] = { ...form };
        } else {
            next.push({ ...form });
        }
        await persist(next);
        setShowModal(false);
    };

    // Open confirmation modal for delete
    const handleDelete = (index: number) => {
        const id = items[index]?.id;
        const question = items[index]?.question;
        setConfirmDelete({ index, id, question });
    };

    // Perform deletion after confirmation
    const performDelete = async () => {
        if (!confirmDelete) return;
        const { id } = confirmDelete;
        if (!id) {
            setConfirmDelete(null);
            return;
        }

        setSaving(true);
        setError(null);
        try {
            await apiClient.delete(`/faqs/${id}`);
            await loadFaqs();
            setConfirmDelete(null);
        } catch (e) {
            console.error(e);
            setError("Failed to delete FAQ.");
        } finally {
            setSaving(false);
        }
    };


    const submitFaq = async () => {
        if (!form.question.trim() || !form.answer.trim()) return;

        setSaving(true);
        setError(null);

        try {
            if (editingIndex != null && items[editingIndex]?.id) {
                // UPDATE
                const id = items[editingIndex].id!;
                await apiClient.put(`/faqs/${id}`, {
                    question: form.question,
                    answer: form.answer,
                    order: form.order ?? 0,
                });
            } else {
                // CREATE
                await apiClient.post("/faqs", {
                    question: form.question,
                    answer: form.answer,
                    order: form.order ?? 0,
                });
            }

            await loadFaqs();
            setShowModal(false);
        } catch (e) {
            setError("Failed to save FAQ. Please try again.");
        } finally {
            setSaving(false);
        }
    };


    return (
        <div className={className}>
            <div className="bg-white rounded-2xl shadow p-4 md:p-6 max-w-3xl w-full mx-auto">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-black text-left">Registration FAQs</h2>
                </div>

                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : items.length === 0 ? (
                    <div className="text-center text-gray-500">
                        <p>No FAQs yet.</p>
                        <p className="text-xs mt-1">Use the "Add FAQ" button to create your first item.</p>
                    </div>
                ) : (
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                        {items.map((item, idx) => (
                            <div key={idx} className="border rounded-lg p-4 text-left">
                                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <p className="font-semibold text-black">{item.question}</p>
                                        <p className="text-black text-sm mt-1 whitespace-pre-wrap">{item.answer}</p>
                                        <p className="text-xs text-black mt-1">Order: {item.order ?? 0}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openModal(idx)}
                                            aria-label="Edit FAQ"
                                            className="p-1 rounded-full text-purple-700 hover:bg-purple-100 hover:text-purple-900 transition"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(idx)}
                                            aria-label="Delete FAQ"
                                            className="p-1 rounded-full text-red-600 hover:bg-red-100 hover:text-red-700 transition"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-6 flex justify-center">
                    <button
                        onClick={() => openModal()}
                        className="px-6 py-2 my-4 font-medium rounded-lg border-2 border-purple-300 bg-white text-purple-950 transition-all duration-300 ease-out hover:bg-purple-700 hover:text-white hover:-translate-y-3 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        + Add FAQ
                    </button>
                </div>

                {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
                {saving && <p className="text-sm text-gray-600 mt-2">Saving...</p>}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-black mb-4">{editingIndex != null ? 'Edit FAQ' : 'Create FAQ'}</h2>
                            <form onSubmit={(e) => { e.preventDefault(); submitFaq(); }} className="space-y-4">
                                <label className="block text-sm font-medium text-black mb-1 text-left">Question</label>
                                <input
                                    required
                                    title="Question"
                                    placeholder="Question"
                                    value={form.question}
                                    onChange={e => setForm({ ...form, question: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />

                                <label className="block text-sm font-medium text-black mb-1 text-left">Answer</label>
                                <textarea
                                    required
                                    title="Answer"
                                    placeholder="Answer"
                                    rows={4}
                                    value={form.answer}
                                    onChange={e => setForm({ ...form, answer: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />

                                <label className="block text-sm font-medium text-black mb-1 text-left">Order</label>
                                <input
                                    type="number"
                                    title="Order"
                                    placeholder="0"
                                    value={form.order ?? 0}
                                    onChange={e => setForm({ ...form, order: parseInt(e.target.value || '0', 10) })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />

                                <div className="flex justify-end gap-3 pt-4">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 bg-gray-200 rounded-lg">Cancel</button>
                                    <button type="submit" className="px-6 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg">{editingIndex != null ? 'Update' : 'Create'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
                        <h2 className="text-xl font-semibold text-black mb-4">Confirm Deletion</h2>
                        <p className="text-gray-700 mb-6">Are you sure you want to delete <strong>{confirmDelete.question ?? 'this FAQ'}</strong>? This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => performDelete()}
                                className="px-5 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition font-medium"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
