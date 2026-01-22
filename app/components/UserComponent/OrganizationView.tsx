"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { OrganizationMember } from "@/types";
import CategorySection from "./CategorySection";
import MemberModal from "./modals/MemberModal";
import { useAuth } from "../AuthProvider";

export default function OrganizationView({
  initialMembers,
}: {
  initialMembers: OrganizationMember[];
}) {
    const { user } = useAuth();
    const isAdmin = user?.is_admin === true;

    const [members, setMembers] = useState(initialMembers);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);

    const fetchMembers = async () => {
        setLoading(true);
        const res = await apiClient.get<OrganizationMember[]>("/organizations");
        setMembers(res.data ?? []);
        setLoading(false);
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const grouped = members.reduce<Record<string, OrganizationMember[]>>(
        (acc, m) => {
            acc[m.category] = acc[m.category] || [];
            acc[m.category].push(m);
            return acc;
        },
        {}
    );
    
    if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div>
        <div className="flex flex-col gap-6 justify-center my-10">
            <div className="w-5xl text-center text-3xl font-normal mt-8 text-gray-900">Organizing Committee</div>
            <div className="max-w-5xl mx-auto space-y-10">

                {/* ADD MEMBER (ADMIN ONLY) */}
                {isAdmin && (<div className="flex justify-end">
                <button
                    onClick={() => setOpenModal(true)}
                    className="
                    px-6 py-2 mt-4 mb-10
                    font-medium rounded-lg
                    border-2 border-purple-300
                    bg-white text-purple-950
                    transition-all duration-300 ease-out
                    hover:bg-purple-700 hover:text-white
                    hover:-translate-y-3
                    active:translate-y-0
                    disabled:opacity-70
                    disabled:cursor-not-allowed
                  "
                >
                    + Add Member
                </button>
                </div>)}

                {Object.entries(grouped).map(([category, members]) => (
                <CategorySection
                    isAdmin={isAdmin}
                    key={category}
                    category={category}
                    members={members}
                    refresh={fetchMembers}
                />
                ))}

                {openModal && isAdmin && (
                <MemberModal
                    isAdmin={isAdmin}
                    onClose={() => setOpenModal(false)}
                    onSaved={fetchMembers}
                />
                )}
            </div>

        </div>
    </div>
  );
}
