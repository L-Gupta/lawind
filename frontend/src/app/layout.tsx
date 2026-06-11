import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";

import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "LawInd | AI-powered legal intelligence for India",
  description:
    "LawInd combines artificial intelligence with Indian legal knowledge to make legal work faster, more accurate, and more accessible.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={playfair.variable}>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
