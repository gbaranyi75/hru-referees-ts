import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Navbar from "@/components/Navbar";
import NavbarMobileMenuWrapper from "@/components/NavbarMobileMenuWrapper";
import SideBarWrapper from "@/components/SideBarWrapper";
import { ToastContainer } from "react-toastify";
import { ClerkProvider } from "@clerk/nextjs";
import { huHU } from "@clerk/localizations";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const outfit = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"]
});

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
        <body className={outfit.className}>
          <div className="min-h-screen lg:flex">
            <SideBarWrapper />
            <div className="flex-1 lg:ml-[290px]">
              <Navbar />
              <NavbarMobileMenuWrapper />
              <main className="bg-gray-100 p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6 text-gray-600">
                {children}
              </main>
              {/* <Analytics /> */}
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
