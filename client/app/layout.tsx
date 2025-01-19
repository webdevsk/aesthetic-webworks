import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"
import HolyLoader from "holy-loader"

const inter = Inter({
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Aesthetic Webworks",
  description: "A Web Design and Development agency landing page",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <HolyLoader color="#525aff" height="2px" easing="ease" showSpinner={false} speed={300} initialPosition={0.08} />
        {children}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  )
}
