import QueryProvider from "@/components/providers/QueryProvider";
import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Full-Stack & Mobile Engineer | Professional Portfolio",
  description:
    "Senior Full-Stack, React Native & AI Solutions Architect portfolio showcasing high-scale systems, mobile applications, and low-latency APIs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#111113] text-white min-h-screen flex flex-col antialiased">
        <QueryProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
