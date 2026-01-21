
import type { Metadata } from "next";
import "./globals.css"
import NavbarWrapper from "./components/UserComponent/NavigationBar/NavbarWrapper";
import { AuthProvider } from "./components/AuthProvider";
import "react-quill-new/dist/quill.snow.css";

export const metadata: Metadata = {
  title: "MMM2027 Application",
  description: "MMM2027 Full-Stack Application",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <NavbarWrapper />
          <main>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
