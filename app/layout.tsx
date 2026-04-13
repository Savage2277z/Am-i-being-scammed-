import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://amibeingscammed.com"
  ),
  title: "Am I Being Scammed? — Free AI Scam Detector",
  description:
    "Paste any suspicious message, email, or offer and get an instant AI-powered scam analysis. Detect phishing, romance scams, fake job offers, and more.",
  keywords: [
    "scam detector",
    "scam checker",
    "phishing detector",
    "is this a scam",
    "fraud detection",
  ],
  openGraph: {
    title: "Am I Being Scammed? — Free AI Scam Detector",
    description:
      "Paste any suspicious message and get an instant AI verdict.",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Am I Being Scammed?",
    description:
      "Free AI-powered scam detection. Paste any message, get an instant verdict.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-700`}>
        <Navbar />
        <main className="min-h-[calc(100vh-128px)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
