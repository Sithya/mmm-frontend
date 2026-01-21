"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../AuthProvider";

export default function LogoutButton({ className }: { className?: string }) {
    const { signOut } = useAuth();
    const router = useRouter();

    const handle = async () => {
        try {
            await signOut();
        } finally {
            router.push("/home");
        }
    };

    return (
        <button
            onClick={handle}
            className={className ?? "px-3 py-1 bg-[#2A0845] text-white rounded-md"}
        >
            Logout
        </button>
    );
}
