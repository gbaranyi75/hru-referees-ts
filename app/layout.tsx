import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import NavbarMobileMenu from "@/components/NavbarMobileMenu";
import Footer from "@/components/Footer";
import SideBarWrapper from "@/components/SideBarWrapper";
import { ToastContainer } from "react-toastify";
import { ClerkProvider } from "@clerk/nextjs";
import { huHU } from "@clerk/localizations";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";

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
      <html lang="en">
        <body>
          <div className="flex">
            <SideBarWrapper />
            <main className="flex-1">
              <div className="flex flex-col min-h-screen md:ml-64">
                <Navbar />
                <NavbarMobileMenu />
                <div className="bg-gray-100 flex-grow">{children}</div>
                <Footer />
                {/* <Analytics /> */}
              </div>
            </main>
            <ToastContainer position="bottom-center" autoClose={2000} />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
