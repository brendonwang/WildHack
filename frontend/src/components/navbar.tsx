import Link from "next/link"

import { Button } from "@/components/ui/button"

const navItems = [
  { label: "Home", href: "/" },
  { label: "Docs", href: "https://ui.shadcn.com/docs", external: true },
  { label: "GitHub", href: "https://github.com/shadcn-ui/ui", external: true },
]

export default function Navbar() {
  return (
    <header className="border-b sticky">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Wildlife Tracker
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) =>
            item.external ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <Button asChild size="sm">
          <a href="https://ui.shadcn.com" target="_blank" rel="noreferrer">
            Get Started
          </a>
        </Button>
      </div>
    </header>
  )
}
