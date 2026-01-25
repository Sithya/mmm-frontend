"use client";

import { apiClient } from "@/lib/api";
import { useState } from "react";
import DeleteConfirmModal from "./DeleteConfirmModal";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {children}
    </label>
  );
}

export default function CategoryEditModal({
  isAdmin,
  oldCategory,
  onClose,
  onSaved,
}: {
  isAdmin: boolean;
  oldCategory: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  if (!isAdmin) return null;
  
  const [newCategory, setNewCategory] = useState(oldCategory);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ---------------- Rename ---------------- */
  const submitRename = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCategory.trim()) return;

    setLoading(true);
    await apiClient.patch("/organizations/category", {
      old_category: oldCategory,
      new_category: newCategory.trim(),
    });

    onSaved();
    setLoading(false);
    onClose();
  };

  /* ---------------- Delete ---------------- */
  const submitDelete = async () => {
    setLoading(true);

    await apiClient.post("/organizations/category", {
      category: oldCategory,
    });

    onSaved();
    setLoading(false);
    setConfirmDelete(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl w-full max-w-sm space-y-5 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-800">
            Edit Category
          </h2>

          {/* Rename */}
          <div>
            <FieldLabel>Category Name</FieldLabel>
            <input
              className="input"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="text-gray-600"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              onClick={submitRename}
              disabled={loading}
              className="bg-purple-700 hover:bg-purple-800
                         text-white px-4 py-2 rounded-md"
            >
              Save
            </button>
          </div>

          {/* Confirm delete category */}
          <div className="border-t pt-4 mt-4">
            <p className="text-sm text-gray-600 mb-2">
              Delete category and all its members?
            </p>

            <button
              onClick={() => setConfirmDelete(true)}
              disabled={loading}
              className="w-full text-red-600 border border-red-300
                         hover:bg-red-50 rounded-md px-4 py-2
                         transition"
            >
              Delete Category
            </button>

            <p className="text-xs text-gray-500 mt-2">
              This action cannot be undone.
            </p>
          </div>
        </div>
      </div>

      {/* CONFIRM DELETE */}
      {confirmDelete && (
        <DeleteConfirmModal
          title="Delete this category?"
          description={`All members under "${oldCategory}" will be permanently deleted.`}
          confirmText="Delete Category"
          danger
          onCancel={() => setConfirmDelete(false)}
          onConfirm={submitDelete}
        />
      )}
    </>
  );
}
