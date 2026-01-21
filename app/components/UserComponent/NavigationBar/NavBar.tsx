"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../AuthProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import LogoutButton from "./LogoutButton";

interface DropdownSection {
  title: string;
  items: { label: string; href: string }[];
}

interface MenuItem {
  title: string;
  href: string;
  dropdown?: DropdownSection[];
}

export default function Navbar() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { user, signOut, isAdmin } = useAuth();

  const menuItems: MenuItem[] = [
    { title: "Home", href: "/home" },
    { title: "Conference", href: "/conference" },
    { title: "Attending", href: "/attending" },
    { title: "Calls", href: "/calls" },
    { title: "Authors", href: "/authors" },
    { title: "Organization", href: "/organization" },
    { title: "Register", href: "/register" },
  ];

  const ADMIN_PREFIX = "/f96ca35d-445d-43e3-bf95-a542922b3db4";

  async function handleSignOut() {
    try {
      await signOut();
    } finally {
      router.push("/home");
    }
  }

  return (
    <nav className="w-full shadow-sm fixed top-0 left-0 z-50 bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-2">
        {/* LOGO */}
        <Link href="/home">
          <Image src="/images/logo.png" width={120} height={60} alt="Logo" />
        </Link>

        {/* HAMBURGER ICON - MOBILE */}
        <div className="lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="focus:outline-none"
          >
            {mobileMenuOpen ? (
              <span className="text-2xl font-bold">✕</span>
            ) : (
              <span className="text-2xl font-bold">☰</span>
            )}
          </button>
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden lg:flex gap-6 text-lg font-semibold">
          {menuItems.map((item, index) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <div
                key={index}
                onMouseEnter={() => item.dropdown && setOpenDropdown(index)}
                onMouseLeave={() => setOpenDropdown(null)}
                className="relative"
              >
                <Link
                  href={item.href}
                  className={`px-6 py-3 rounded-lg transition duration-200
                    ${isActive
                      ? "bg-[#2A0845] text-white hover:bg-[#2A0845]"
                      : "text-black hover:bg-[#faf5ff] hover:text-black-600"
                    }`}
                >
                  {item.title}
                </Link>

                {item.dropdown && openDropdown === index && (
                  <div className="absolute top-[72px] left-0 w-screen bg-white border-t shadow-lg z-50 overflow-hidden animate-slideDown">
                    <div className="max-w-7xl mx-auto p-6 flex gap-14">
                      {item.dropdown.map((section, i) => (
                        <div key={i} className="min-w-[220px]">
                          <Link
                            href={section.items[0].href}
                            className="font-bold text-[18px] hover:text-[#2A0845] transition"
                          >
                            {section.title}
                          </Link>
                          <div className="flex flex-col mt-2 gap-1">
                            {section.items.map((sub, j) => (
                              <Link
                                key={j}
                                href={sub.href}
                                className="text-[15px] hover:text-[#2A0845] transition"
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {isAdmin && (
            <div className="flex items-center">
              <LogoutButton className="ml-4" />
            </div>
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white shadow-md border-t">
          <div className="flex flex-col p-4 gap-2">
            {menuItems.map((item, index) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <div key={index}>
                  <Link
                    href={item.href}
                    className={`block px-4 py-2 rounded-lg transition duration-200
                      ${isActive
                        ? "bg-[#2A0845] text-white"
                        : "text-black hover:bg-[#faf5ff]"
                      }`}
                  >
                    {item.title}
                  </Link>
                  {/* Mobile dropdown if exists */}
                  {item.dropdown && (
                    <div className="pl-4 mt-1 flex flex-col gap-1">
                      {item.dropdown.map((section, i) => (
                        <div key={i}>
                          <span className="font-bold text-[16px]">{section.title}</span>
                          {section.items.map((sub, j) => (
                            <Link
                              key={j}
                              href={sub.href}
                              className="block px-2 py-1 text-[14px] hover:text-[#2A0845] transition"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {isAdmin && (
              <div className="px-4 py-2">
                <LogoutButton />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ANIMATION KEYFRAME */}
      <style jsx global>{`
        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown { animation: slideDown 0.25s ease-out; }
      `}</style>
    </nav>
  );
}
