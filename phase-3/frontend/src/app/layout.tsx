import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./clientLayout";
import AIAssistantWidget from "@/components/AIAssistant";


export const metadata: Metadata = {
  title: "TodoApp - Your Personal Task Manager",
  description: "A modern, responsive todo application for managing your tasks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-optimized">
      <body
        className={`antialiased bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 scroll-container`}
      >
        <ClientLayout>{children}  </ClientLayout>
      </body>
    </html>
  );
}
