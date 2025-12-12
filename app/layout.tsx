import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Navbar from "@/components/Navbar";
import NavbarMobileMenuWrapper from "@/components/NavbarMobileMenuWrapper";
import SideBarWrapper from "@/components/SideBarWrapper";
import { ToastContainer } from "react-toastify";
import { ClerkProvider } from "@clerk/nextjs";
import { huHU } from "@clerk/localizations";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "HRU Referees",
  description: "MRGSZ Játékvezetői Bizottság",
  keywords: "referee, hru, játékvezető, rugby, rögbi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={huHU}>
      <html lang="en" suppressHydrationWarning>
        <body className={`${outfit.variable} font-outfit`}>
          <div className="min-h-screen lg:flex">
            <SideBarWrapper />
            <div className="flex-1 lg:ml-72.5">
              <Navbar />
              <NavbarMobileMenuWrapper />
              <main className="bg-gray-100 p-4 mx-auto max-w-screen-2xl md:p-6 text-gray-600">
                {children}
              </main>
              <Analytics />
            </div>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              style={{ zIndex: 20000000 }}
            />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
