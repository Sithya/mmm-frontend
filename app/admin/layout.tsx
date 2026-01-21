"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthProvider";
import LogoutButton from "../components/UserComponent/NavigationBar/LogoutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace("/f96ca35d-445d-43e3-bf95-a542922b3db4");
    }
  }, [isAdmin, loading, router]);

  if (loading) return null;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="w-full bg-white shadow-sm p-3 flex justify-end">
        <div className="max-w-7xl w-full mx-auto flex justify-end">
          <LogoutButton />
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
