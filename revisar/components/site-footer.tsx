import Link from "next/link"
import { ShoppingBag } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-primary" />
            <span className="font-bold">EcoCupon</span>
          </Link>
          <p className="text-center text-xs text-muted-foreground">
            Comparador de precios y cupones de descuento. Los precios pueden variar.
          </p>
        </div>
      </div>
    </footer>
  )
}
