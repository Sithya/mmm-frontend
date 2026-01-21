"use client";
import React from 'react';
import AdminKeynote from "../AdminComponent/Admin_keynote";
import UserKeyNotes from "../UserComponent/User_Keynotes";
import { useAuth } from "../AuthProvider";

type Props = {
  pageId: number;
};

export default function Keynotes({ pageId }: Props) {
  const { isAdmin, loading } = useAuth();

  if (loading) return <div className="py-6">Loading keynotes…</div>;

  return isAdmin ? <AdminKeynote pageId={pageId} /> : <UserKeyNotes pageId={pageId} />;
}
