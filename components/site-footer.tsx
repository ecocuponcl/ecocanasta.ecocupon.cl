import Link from "next/link"
import { ShoppingBag } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-3 sm:gap-4 py-8 sm:py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Link href="/" className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5 text-green-600" />
            <span className="inline-block font-bold">EcoCupon</span>
          </Link>
          <p className="text-center text-xs sm:text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} EcoCupon. Todos los derechos reservados.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
            Términos
          </Link>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
            Privacidad
          </Link>
          <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
            Contacto
          </Link>
        </div>
      </div>
    </footer>
  )
}
