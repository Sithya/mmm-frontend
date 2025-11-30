"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

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
  const [openDropdown, setOpenDropdown] = useState<number | null>(null); //controls which dropdown is currently open (or none)

  const menuItems: MenuItem[] = [
    { title: "Home", href: "/home" },
    { title: "Conference", href: "/conference" },
    { title: "Attending", href: "/attending" },
    {
      title: "Calls",
      href: "/calls",
      dropdown: [
        {
          title: "REGULAR PAPER",
          items: [
            // { label: "REGULAR PAPER", href: "#regular-paper" },
            { label: "Submission Guidelines", href: "#regular-guidelines" },
            { label: "Important Requirements", href: "#regular-important" },
          ]
        },
        {
          title: "SPECIAL SESSIONS",
          items: [
            { label: "Submission Guidelines", href: "#special-guidelines" },
            { label: "Important Requirements", href: "#special-important" },
          ]
        },
        {
          title: "VIDEO BROWSER",
          items: [
            { label: "Submission Guidelines", href: "#video-guidelines" },
            { label: "Important Requirements", href: "#video-important" },
          ]
        },
        {
          title: "TOPICS OF INTEREST",
          items: [
            { label: "Multimedia Content Analysis", href: "#topic-analysis" },
            { label: "Multimedia Signal Processing and Communications", href: "#topic-signal" },
          ]
        },
      ]
    },

    {
      title: "Authors",
      href: "/authors",
      dropdown: [
        {
          title: "CAMERA READY INSTRUCTION",
          items: [
            { label: "Required Submission Documents", href: "#camera-docs" },
            { label: "Submission Portal", href: "#camera-portal" },
            { label: "Important", href: "#camera-important" },
          ]
        },
        {
          title: "SUBMISSION GUIDELINE",
          items: [
            { label: "General Guidelines", href: "#sub-general" },
            { label: "Regular Papers", href: "#sub-regular" },
            { label: "Special Session Papers", href: "#sub-special" },
            { label: "Video Browser Showdown Papers", href: "#sub-video" },
          ]
        }
      ]
    },
    { title: "Organization", href: "/organization" },
    { title: "Register", href: "/register" },
  ];

  return (
    <nav className="w-full shadow-sm fixed top-0 left-0 z-50 bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        
        <Link href="/home">
          <Image src="/images/logo.png" width={120} height={60} alt="Logo" />
        </Link>

        {/* NAVIGATION MENU */}
        <div className="flex gap-6 text-lg font-semibold">
          {menuItems.map((item, index) => {
            const isActive = pathname.startsWith(item.href);

            return (
              <div key={index}
                onMouseEnter={() => item.dropdown && setOpenDropdown(index)}
                onMouseLeave={() => setOpenDropdown(null)}
                className="relative"
              >
                {/* MAIN NAV BUTTON */}
                <Link
                  href={item.href}
                  className={`px-6 py-3 rounded-lg transition duration-200
                    ${isActive 
                    ? "bg-[#2A0845] text-white hover:bg-[#2A0845]" 
                    : "text-black hover:bg-[#faf5ff] hover:text-black-600"}
                  `}
                >
                  {item.title}
                </Link>

                {/* DROPDOWN */}
                {item.dropdown && openDropdown === index && (
                  <div className="fixed top-[72px] left-0 w-screen bg-white border-t shadow-lg z-50 overflow-hidden animate-slideDown">
                    <div className="max-w-7xl mx-auto p-6 flex gap-14">
                      
                      {item.dropdown.map((section, i) => (
                        <div key={i} className="min-w-[220px]">
                          
                          {/* Title */}
                          <Link 
                            href={section.items[0].href} // Title scrolls to top item
                            className="font-bold text-[18px] hover:text-[#2A0845] transition">
                            {section.title}
                          </Link>

                          {/* Sub Items */}
                          <div className="flex flex-col mt-2 gap-1">
                            {section.items.map((sub, j) => (
                              <Link key={j} href={sub.href} className="text-[15px] hover:text-[#2A0845] transition">
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
        </div>
      </div>

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
