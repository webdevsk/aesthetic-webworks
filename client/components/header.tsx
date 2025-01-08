import { cn } from "@/lib/utils"
import { AnimatedButton } from "./ui/animated-button"
import { BurgerMenuBtn } from "./ui/burger-menu-btn"
import Link from "next/link"

export function Header() {
  return (
    <header className="container flex items-center gap-8 h-[100px]">
      <Logo className="max-w-16"/>
      <AnimatedButton variant="outline" className="text-base ms-auto font-medium px-6 h-10 flex items-center py-0"><Link href="/admin">Admin Panel</Link></AnimatedButton>
      <BurgerMenuBtn />
    </header>
  )
}

function Logo({ className, ...props }: { className?: string } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg id="logo" className={cn("w-full h-auto", className)} {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64.06 32">
      <rect
        id="line1"
        x="12.31"
        width="6.78"
        height="32"
        strokeWidth="0"
        // style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px;"
        data-svgorigin="15.700000524520874 0"
        transform="matrix(1,0,0,1,0,0)"></rect>
      <polygon
        id="angle1"
        points="0 32 6.78 32 12.31 0 5.53 0 0 32"
        strokeWidth="0"
        // style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px; visibility: visible;"
        data-svgorigin="6.15500020980835 0"
        transform="matrix(1,0,0,1,0,0)"></polygon>
      <rect
        id="line2"
        x="25.88"
        width="6.78"
        height="32"
        strokeWidth="0"
        // style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px;"
        data-svgorigin="29.269999265670776 0"
        transform="matrix(1,0,0,1,0,0)"></rect>
      <polygon
        id="angle2"
        points="32.66 32 39.44 32 44.97 0 38.19 0 32.66 32"
        strokeWidth="0"
        // style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px; visibility: visible;"
        data-svgorigin="38.81500053405762 32"
        transform="matrix(1,0,0,1,-0.25744,0)"></polygon>
      <rect
        id="line3"
        x="44.97"
        width="6.78"
        height="32"
        strokeWidth="0"
        // style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px;"
        data-svgorigin="48.3600013256073 0"
        transform="matrix(1,0,0,1,0,0)"></rect>
      <polygon
        id="angle3"
        points="57.28 0 51.75 32 58.53 32 64.06 0 57.28 0"
        strokeWidth="0"
        // style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px; visibility: visible;"
        data-svgorigin="57.904998779296875 32"
        transform="matrix(1,0,0,1,-0.25744,0)"></polygon>
    </svg>
  )
}
