"use client"

import { useEffect, useState } from "react"
import { Logo } from "./header"
import { AnimatePresence, motion } from "motion/react"

export const waitTime = 2500
export function InitialLoader({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    // Hide loader after 2.5 seconds
    const timer = setTimeout(() => {
      setShow(false)
    }, waitTime)

    return () => {
      clearTimeout(timer)
      window?.scrollTo({ top: 0, behavior: "instant" })
    }
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="animator-loader"
          initial={{ translateX: "0%" }}
          exit={{ translateX: "100%", transition: { delay: 0.5, duration: 0.7, when: "afterChildren" } }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5, when: "afterChildren" } }}
            className="text-4xl font-bold text-white">
            <Logo className="max-w-16 fill-white" />
            <motion.div
              className="mt-2 h-1 bg-white"
              initial={{ width: 0 }}
              animate={{ width: "90%" }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      )}
      {!show && <motion.div key="content">{children}</motion.div>}
    </AnimatePresence>
  )
}
