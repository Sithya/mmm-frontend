"use client";


import { apiClient } from "@/lib/api";
import { OrganizationMember } from "@/types";
import { useEffect, useState } from "react";

type FormState = {
  name: string;
  affiliation: string;
  category: string;
  photo_url: string;
  newCategory: string;
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {children}
    </label>
  );
}

export default function MemberModal({
  isAdmin,
  member,
  onClose,
  onSaved,
}: {
  isAdmin: boolean;
  member?: OrganizationMember;
  onClose: () => void;
  onSaved: () => void;
}) {
  if (!isAdmin) return null;

  const [form, setForm] = useState<FormState>({
    name: "",
    affiliation: "",
    category: "",
    photo_url: "",
    newCategory: "",
  });

  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    apiClient.get<OrganizationMember[]>("/organizations").then((res) => {
      setCategories([...new Set((res.data ?? []).map((m) => m.category))]);
    });

    if (member) {
      setForm({
        name: member.name ?? "",
        affiliation: member.affiliation ?? "",
        category: member.category ?? "",
        photo_url: member.photo_url ?? "",
        newCategory: "",
      });
    }
  }, [member]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Name is required.");
      return;
    }

    const payload = {
      page_id: 6,
      name: form.name.trim(),
      affiliation: form.affiliation.trim(),
      category: form.newCategory || form.category,
      photo_url: form.photo_url.trim(),
    };

    if (member) {
      await apiClient.put(`/organizations/${member.id}`, payload);
    } else {
      await apiClient.post("/organizations", payload);
    }

    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 w-full max-w-md rounded-xl space-y-5 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800">
          {member ? "Edit Member" : "Add Member"}
        </h2>

        {/* Name */}
        <div>
          <FieldLabel>Name</FieldLabel>
          <input
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {/* Affiliation */}
        <div>
          <FieldLabel>Affiliation</FieldLabel>
          <input
            className="input"
            value={form.affiliation}
            onChange={(e) =>
              setForm({ ...form, affiliation: e.target.value })
            }
          />
        </div>

        {/* Image */}
        <div>
          <FieldLabel>Image URL</FieldLabel>
          <input
            className="input"
            placeholder="https://example.com/photo.jpg"
            value={form.photo_url}
            onChange={(e) =>
              setForm({ ...form, photo_url: e.target.value })
            }
          />
        </div>

        {/* Category */}
        <div>
          <FieldLabel>Category</FieldLabel>
          <select
            className="w-full rounded-md border border-[#2A0845] px-3 py-2
                       focus:outline-none focus:ring-2 focus:ring-[#2A0845]
                       focus:border-[#2A0845] text-gray-800"
            value={form.category || ""}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value,
                newCategory: "",
              })
            }
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
            <option value="__new__">+ Create new category</option>
          </select>
        </div>

        {form.category === "__new__" && (
          <div>
            <FieldLabel>New Category Name</FieldLabel>
            <input
              className="input"
              value={form.newCategory}
              onChange={(e) =>
                setForm({ ...form, newCategory: e.target.value })
              }
            />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="text-gray-600">
            Cancel
          </button>
          <button
            onClick={submit}
            className="bg-purple-700 hover:bg-purple-800
                       text-white px-4 py-2 rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
