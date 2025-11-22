import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MMM2027 Application",
  description: "MMM2027 Full-Stack Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
