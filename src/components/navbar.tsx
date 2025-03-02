"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BrainCircuit, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const routes = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/upload",
    label: "Upload Dataset",
  },
  {
    href: "/dataset",
    label: "Dataset",
  },
  {
    href: "/features",
    label: "Feature Selection",
  },
  {
    href: "/training",
    label: "Model Training",
  },
  {
    href: "/models",
    label: "Saved Models",
  },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <BrainCircuit className="h-6 w-6" />
          <span className="font-bold text-xl">ML Studio</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 ml-10">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === route.href ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {route.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center ml-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Link href="/" className="flex items-center gap-2 mb-8">
                <BrainCircuit className="h-6 w-6" />
                <span className="font-bold text-xl">ML Studio</span>
              </Link>
              <nav className="flex flex-col space-y-4">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      pathname === route.href ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {route.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}

