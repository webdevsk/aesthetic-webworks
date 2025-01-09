"use client"

import { cn } from "@/lib/utils"
import useDetectScroll from "@smakss/react-scroll-direction"
import { DialogContent, DialogRoot, DialogTrigger } from "./dialog-menu"
import { AnimatedLink } from "./ui/animated-button"
import { BurgerMenuBtn } from "./ui/burger-menu-btn"

export function Header() {
  const { scrollDir, scrollPosition } = useDetectScroll()
  const translate = scrollPosition.top === 0 ? 0 : scrollDir === "up" ? 0 : 1
  return (
    <>
      <header
        style={{ ["--translate" as string]: translate }}
        className="container fixed top-0 z-40 flex h-[100px] translate-y-[calc(var(--translate)_*_-100%)] items-center gap-8 transition-transform duration-700">
        <Logo className="max-w-16" />
        <AnimatedLink
          variant="outline"
          href="/admin"
          className="ms-auto flex h-10 items-center px-6 py-0 text-base font-medium">
          Admin Panel
        </AnimatedLink>
        <DialogRoot>
          <DialogTrigger asChild>
            <BurgerMenuBtn />
          </DialogTrigger>
          <DialogContent title="Main Menu"></DialogContent>
        </DialogRoot>
      </header>
      <div
        style={{ ["--translate" as string]: translate }}
        className="pointer-events-none fixed top-0 z-30 h-[100px] w-full translate-y-[calc(var(--translate)_*_-100%)] transition-transform delay-100 duration-300">
        <div className="h-full w-full backdrop-blur-md" />
      </div>
    </>
  )
}

export function Logo({ className, ...props }: { className?: string } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      id="logo"
      className={cn("h-auto w-full", className)}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64.06 32">
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
