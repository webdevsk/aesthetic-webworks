import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function ServicesSection() {
  return (
    <section className="container py-huge">
      <h2 className="variant-h2">We’re good at</h2>
      <div className="grid grid-cols-[1fr_50.75vw] items-end">
        <div>
          <div className="mt-6 space-y-4">
            <p>Services</p>
            {[
              "E-Commerce",
              "Website Design",
              "Web Development",
              "Digital Products",
              "Brand Identities",
              "SEO Optimisation",
            ].map((item) => (
              <Link href={`/services/#`} key={item} className="variant-h3 block text-[2vw]">
                {item}
              </Link>
            ))}
          </div>
        </div>
          <Card className="bg-primary text-primary-foreground p-16">
            <h3 className="variant-h3">
              Let's start with a conversation about how we can help you! Get in touch, we're a nice bunch.
            </h3>
            <div className="mt-8 flex items-center gap-4">
              <Button variant="ghost">Let's talk</Button>
              <Badge size="lg" variant="outline" className="border-current">999999999</Badge>
            </div>
          </Card>
      </div>
    </section>
  )
}
