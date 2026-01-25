"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../AuthProvider";

export default function LogoutButton({ className }: { className?: string }) {
    const { signOut } = useAuth();
    const router = useRouter();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [working, setWorking] = useState(false);

    const openConfirm = () => setConfirmOpen(true);

    const doLogout = async () => {
        setWorking(true);
        try {
            await signOut();
        } finally {
            setWorking(false);
            setConfirmOpen(false);
            router.push("/home");
        }
    };

    return (
        <>
            <button
                onClick={openConfirm}
                className={className ?? "px-6 py-2 my-4 font-medium rounded-lg border-2 border-purple-300 bg-white text-purple-950 transition-all duration-300 ease-out hover:bg-purple-700 hover:text-white hover:-translate-y-3 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"}
            >
                Logout
            </button>

            {confirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-[#2A0845]">Confirm Logout</h3>
                            <p className="text-sm text-gray-600 mt-2">Are you sure you want to log out?</p>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={() => setConfirmOpen(false)}
                                    className="px-4 py-2 bg-gray-200 rounded-lg"
                                    disabled={working}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={doLogout}
                                    className="px-4 py-2 bg-[#2A0845] text-white rounded-lg"
                                    disabled={working}
                                >
                                    {working ? 'Logging out...' : 'Logout'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
