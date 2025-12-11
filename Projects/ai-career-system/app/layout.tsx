// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PathFinder - AI Career Advisor", // Let's give it a real title!
  description: "AI-Powered Career & Skill Recommendation System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            {/* --- CHANGE THIS LINE --- */}
            <main className="flex-grow flex flex-col">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}