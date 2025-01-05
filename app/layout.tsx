import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "./globals.css";
import { Footer } from "../components/footer"

const onest = Onest({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ArtistsWeb Clone",
  description: "A NextJS clone of ArtistsWeb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${onest.className} bg-white antialiased`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
