"use client";

import { OrganizationMember } from "@/types";
import { useState } from "react";
import MemberCard from "./MemberCard";
import CategoryEditModal from "./modals/CategoryEditModal";
import { Pencil } from "lucide-react";

interface Props {
  category: string;
  members: OrganizationMember[];
  refresh: () => void;
  isAdmin: boolean;
}

export default function CategorySection({
  category,
  members,
  refresh,
  isAdmin,
}: Props) {
  const [editCategory, setEditCategory] = useState(false);

  return (
    <section>
      <div className="bg-[#2A0845] text-white px-6 py-3 flex justify-between items-center rounded-t">
        <h2 className="text-lg font-semibold">{category}</h2>

        {/* ADMIN ONLY */}
        {isAdmin && (
          <button
          onClick={() => setEditCategory(true)}
          className="p-1 rounded-full text-white hover:bg-white hover:text-[#2A0845] transition"
          >
          <Pencil size={20} />
          </button>)
        }

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 bg-gray-50 p-6 rounded-b">
        {members.map((m) => (
          <MemberCard key={m.id} member={m} refresh={refresh} isAdmin={isAdmin}/>
        ))}
      </div>

      {editCategory && isAdmin && (
        <CategoryEditModal
          isAdmin={isAdmin}
          oldCategory={category}
          onClose={() => setEditCategory(false)}
          onSaved={refresh}
        />
      )}
    </section>
  );
}
