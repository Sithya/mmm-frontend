"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../AuthProvider";
import Link from "next/link";
import Image from "next/image";
import LogoutButton from "./LogoutButton";

interface MenuItem {
  title: string;
  href: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { title: "Home", href: "/home" },
    { title: "Conference", href: "/conference" },
    { title: "Attending", href: "/attending" },
    { title: "Calls", href: "/calls" },
    { title: "Authors", href: "/authors" },
    { title: "Organization", href: "/organization" },
    { title: "Register", href: "/register" },
  ];

  /** Mobile-safe navigation */
  const handleMobileNavigate = (href: string) => {
    setMobileMenuOpen(false);
    router.push(href);
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-2">
        {/* LOGO */}
        <Link href="/home" onClick={() => setMobileMenuOpen(false)} className="">
          <Image
            src="/images/logo.jpg"
            width={120}
            height={60}
            alt="Logo"
            priority
          />
        </Link>

        {/* HAMBURGER (MOBILE) */}
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="lg:hidden text-2xl font-bold focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>

        {/* DESKTOP MENU */}
        <div className="hidden lg:flex items-center gap-6 text-lg font-semibold">
          <div className="flex gap-6">
            {menuItems.map((item) => {
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-6 py-3 rounded-lg transition-colors duration-150
                    ${
                      isActive
                        ? "bg-[#2A0845] text-white"
                        : "text-black hover:bg-[#faf5ff]"
                    }`}
                >
                  {item.title}
                </Link>
              );
            })}
          </div>

          {isAdmin && <LogoutButton className="px-6 py-2 my-4 font-medium rounded-lg border-2 border-purple-300 bg-white text-purple-950 transition-all duration-300 ease-out hover:bg-purple-700 hover:text-white hover:-translate-y-3 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed" />}
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`
          lg:hidden bg-white border-t shadow-md
          transition-all duration-200 ease-out
          ${mobileMenuOpen
            ? "max-h-[500px] opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"}
        `}
      >
        <div className="flex flex-col p-4 gap-2">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);

            return (
              <button
                key={item.href}
                onClick={() => handleMobileNavigate(item.href)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors
                  ${
                    isActive
                      ? "bg-[#2A0845] text-white"
                      : "text-black hover:bg-[#faf5ff]"
                  }`}
              >
                {item.title}
              </button>
            );
          })}

          {isAdmin && (
            <div className="pt-2">
              <LogoutButton />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
