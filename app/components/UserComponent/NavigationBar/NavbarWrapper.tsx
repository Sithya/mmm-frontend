'use client';
import { usePathname } from "next/navigation";
import Navbar from "./NavBar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const hideNavbar = pathname === '/f96ca35d-445d-43e3-bf95-a542922b3db4';

  if (hideNavbar) return null;
  return (
    <header className="w-full">
      <Navbar />
    </header>
  );
}
