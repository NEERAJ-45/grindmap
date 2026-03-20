import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GrindMap — DSA Pattern Tracker",
  description: "Track your DSA prep. Pattern by pattern.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} dark`}>
      <body className="min-h-screen bg-[#0a0a0a] text-[#ededed] font-sans antialiased">
        {children}
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: "#111",
              border: "1px solid #1f1f1f",
              color: "#ededed",
            },
          }}
        />
      </body>
    </html>
  );
}
