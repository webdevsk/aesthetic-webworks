import { Footer } from "@/components/footer"

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children} <Footer /></>
}