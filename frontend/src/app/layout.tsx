import QueryProvider from "@/components/providers/QueryProvider";
import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://YOUR-DOMAIN.vercel.app"),

  title: {
    default: "Yuvraj Kashid — Full-Stack Developer & AI Engineer",
    template: "%s | Yuvraj Kashid",
  },

  description:
    "Portfolio of Yuvraj Kashid — Full-Stack Developer & AI Engineer building modern web applications, AI-powered products, and scalable software solutions.",

  keywords: [
    "Yuvraj Kashid",
    "Full-Stack Developer",
    "AI Engineer",
    "MERN Stack Developer",
    "Next.js Developer",
    "React Developer",
    "Node.js Developer",
    "AI Developer",
    "Software Developer",
    "Web Developer",
  ],

  authors: [
    {
      name: "Yuvraj Kashid",
    },
  ],

  creator: "Yuvraj Kashid",

  openGraph: {
    type: "website",
    locale: "en_IN",
    title: "Yuvraj Kashid — Full-Stack Developer & AI Engineer",
    description:
      "Full-Stack Developer & AI Engineer building modern web applications and intelligent digital products.",
    siteName: "Yuvraj Kashid Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Yuvraj Kashid — Full-Stack Developer & AI Engineer",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Yuvraj Kashid — Full-Stack Developer & AI Engineer",
    description:
      "Full-Stack Developer & AI Engineer building modern web applications and intelligent digital products.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
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
