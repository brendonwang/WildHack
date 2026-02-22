"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"


import { Button } from "@/components/ui/button"
import clsx from "clsx"

const navItems = [
  { label: "Home", href: "/" },
  { label: "Report", href: "/report" },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="border-b sticky top-0 bg-white z-9999 shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Wildlife Tracker
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) =>
            <Link
              key={item.label}
              href={item.href}
              className={clsx(
                "text-sm font-medium transition-colors hover:text-foreground",
                item.href === pathname ? "text-foreground font-bold" : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>

          )}
        </nav>

        <Button asChild size="sm">
          <Link href="/report">
            Get Started
          </Link>
        </Button>
      </div>
    </header>
  )
}
