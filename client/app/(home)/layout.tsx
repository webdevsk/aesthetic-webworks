import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { InitialLoader } from "@/components/initial-loader"

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      <InitialLoader>{children}</InitialLoader>
      <Footer />
    </>
  )
}
