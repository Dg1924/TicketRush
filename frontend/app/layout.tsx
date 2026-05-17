import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { AppProvider } from "@/store/AppContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TicketRush",
  description: "TicketRush event ticket booking platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-[#08080f] text-white font-sans">
        <GoogleOAuthProvider clientId={googleClientId}>
          <AppProvider>{children}</AppProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}