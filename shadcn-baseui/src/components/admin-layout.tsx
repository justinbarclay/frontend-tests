"use client"

import { useAuthStore } from "@/store/useAuthStore"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { LogOutIcon } from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuthStore()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold tracking-tight">Schema Architect</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-muted-foreground md:inline-block">
              {user?.email}
            </span>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={logout}
              aria-label="Log out"
            >
              <LogOutIcon className="size-4" />
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
