import Link from "next/link"
import { AnimatedButton as Button } from "./ui/animated-button"
import { Card } from "./ui/card"
import { Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <section>
      <div className="container py-huge">
        <div className="flex items-start justify-between gap-8">
          <div className="space-y-8">
            <h3 className="variant-h3 max-w-[47.917vw] text-[2.778vw]">
              We love crafting unforgettable digital experiences, brands and websites with people like you.
            </h3>
            <div className="space-y-4">
              <p>Get in touch</p>
              <a className="variant-h4 block font-semibold" href="tel:+447497877777">
                +44 7497 877777
              </a>
              <a className="variant-h4 block font-semibold" href="mailto:sample@gmail.com">
                sample@gmail.com
              </a>
              <p className="variant-h4 font-semibold">123 Fake Street, London, UK</p>
            </div>
          </div>
          <div className="flex w-[40%] min-w-[400px] max-w-[27.938vw] flex-col gap-10">
            <Card className="flex items-center gap-6 bg-foreground text-background">
              <h5 className="variant-h5 me-auto text-xl">Follow Us</h5>
              <Link
                href="#"
                target="_blank"
                className="block rounded-full ring-0 ring-transparent ring-offset-0 ring-offset-foreground transition-all duration-300 hover:scale-125 hover:ring-2 hover:ring-primary hover:ring-offset-8">
                <Instagram size={24} />
              </Link>
              <Link
                href="#"
                target="_blank"
                className="block rounded-full ring-0 ring-transparent ring-offset-0 ring-offset-foreground transition-all duration-300 hover:scale-125 hover:ring-2 hover:ring-primary hover:ring-offset-8">
                <Facebook size={24} />
              </Link>
              <Link
                href="#"
                target="_blank"
                className="block rounded-full ring-0 ring-transparent ring-offset-0 ring-offset-foreground transition-all duration-300 hover:scale-125 hover:ring-2 hover:ring-primary hover:ring-offset-8">
                <Twitter size={24} />
              </Link>
            </Card>
            <Card className="flex flex-col items-center gap-4">
              <h3 className="variant-h3">Let's get started</h3>
              <p>We’d love to hear about your project.</p>
              <Button className="mt-6 w-full" size="sm">
                Get in touch
              </Button>
            </Card>
          </div>
        </div>
        <div className="mt-12 flex items-center gap-8">
          <Link className="variant-p me-auto block pt-8 text-muted" href="#">
            © 2024 All rights reserved
          </Link>
          <Link className="variant-p block text-muted" href="#">
            Privacy Policy
          </Link>
          <Link className="variant-p block text-muted" href="#">
            Terms & Conditions
          </Link>
        </div>
      </div>
    </section>
  )
}
