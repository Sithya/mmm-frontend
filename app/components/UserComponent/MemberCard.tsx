"use client";

import { useState } from "react";
import MemberModal from "./modals/MemberModal";
import DeleteConfirmModal from "./modals/DeleteConfirmModal";
import { OrganizationMember } from "@/types";
import { Pencil, Trash2 } from "lucide-react";
import { apiClient } from "@/lib/api";

export default function MemberCard({
  member,
  refresh,
  isAdmin,
}: {
  member: OrganizationMember;
  refresh: () => void;
  isAdmin: boolean;
}) {
  const [edit, setEdit] = useState(false);
  const [del, setDel] = useState(false);

  const onDel = async () => {
    await apiClient.delete(`/organizations/${member.id}`);
    setDel(false);
    refresh();
  };

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden flex flex-col">
      {/* Image */}
      <div className="h-40 w-full overflow-hidden">
        <img
          src={member.photo_url}
          alt={member.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-4 text-center space-y-1">
        <h3 className="font-semibold text-gray-900">
          {member.name}
        </h3>
        <p className="text-sm text-gray-600">
          {member.affiliation}
        </p>
      </div>

      {/* Actions (ADMIN ONLY)*/}
      {isAdmin && (<div className="flex justify-center gap-6 pb-4">
        {/* Edit */}
        <button
          onClick={() => setEdit(true)}
          className="p-1 rounded-full text-purple-700 hover:bg-purple-100 hover:text-purple-900 transition"
          aria-label="Edit member"
        >
          <Pencil size={20} />
        </button>

        {/* Delete */}
        <button
          onClick={() => setDel(true)}
          className="p-2 rounded-full text-red-600 hover:bg-red-100 hover:text-red-700 transition"
          aria-label="Delete member"
        >
          <Trash2 size={20} />
        </button>
      </div>)}

      {/* Modals */}
      {edit && isAdmin && (
        <MemberModal
          isAdmin={isAdmin}
          member={member}
          onClose={() => setEdit(false)}
          onSaved={refresh}
        />
      )}

        {del && isAdmin && (
            <DeleteConfirmModal
            title="Delete member?"
            onCancel={() => setDel(false)}
            onConfirm={onDel}
            />
        )}
    </div>
  );
}
