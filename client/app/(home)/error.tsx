"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">Something went wrong!</h1>
        <p className="mb-8 text-gray-600">{error.message || "We encountered an error while loading the page"}</p>
        <div className="space-x-4">
          <button
            onClick={reset}
            className="rounded-md bg-primary px-6 py-2 text-white transition-colors hover:bg-secondary">
            Try again
          </button>
          <Link href="/" className="inline-block rounded-md bg-gray-200 px-6 py-2 transition-colors hover:bg-gray-300">
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
