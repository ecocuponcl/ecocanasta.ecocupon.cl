"use client"

import Link from "next/link"
import { ShoppingBag, Menu, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

const categories = [
  { name: "Tecnologia", slug: "technology" },
  { name: "Moda", slug: "fashion" },
  { name: "Hogar", slug: "home" },
  { name: "Libros", slug: "books" },
  { name: "Oficina", slug: "office" },
]

export function SiteHeader() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    router.push("/")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center px-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 border-b p-4">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <span className="text-lg font-bold">EcoCupon</span>
              </div>
              <nav className="flex flex-col">
                <Link href="/" className="border-b px-4 py-3 text-sm font-medium hover:bg-muted" onClick={() => setOpen(false)}>
                  Inicio
                </Link>
                {categories.map((cat) => (
                  <Link key={cat.slug} href={`/category/${cat.slug}`} className="border-b px-4 py-3 text-sm hover:bg-muted" onClick={() => setOpen(false)}>
                    {cat.name}
                  </Link>
                ))}
                <Link href="/category/all" className="border-b px-4 py-3 text-sm font-medium text-primary hover:bg-muted" onClick={() => setOpen(false)}>
                  Ver todas las ofertas
                </Link>
              </nav>
              <div className="p-4">
                {user ? (
                  <Button variant="outline" className="w-full gap-2" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4" />
                    Salir
                  </Button>
                ) : (
                  <Link href="/auth/login" onClick={() => setOpen(false)}>
                    <Button className="w-full gap-2">
                      <User className="h-4 w-4" />
                      Ingresar
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-primary" />
          <span className="text-lg font-bold">EcoCupon</span>
        </Link>

        <nav className="ml-8 hidden items-center gap-1 md:flex">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`} className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              {cat.name}
            </Link>
          ))}
          <Link href="/category/all" className="rounded-md px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10">
            Ofertas
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">{user.email?.split("@")[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-xs text-muted-foreground">{user.email}</DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} className="gap-2 text-destructive">
                  <LogOut className="h-4 w-4" />
                  Salir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/login">
              <Button size="sm" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Ingresar</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
