import { createServerClient } from "@/lib/supabase/server"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"

export default async function ProductsPage() {
    const supabase = await createServerClient()
    const { data: products, error } = await supabase
        .from("products")
        .select("*, categories(name)")

    if (error) {
        console.error("Error fetching products:", error)
    }

    return (
        <div className="container py-8">
            <div className="mb-8">
                <nav className="mb-4 flex text-sm text-muted-foreground">
                    <Link href="/" className="hover:text-primary">Inicio</Link>
                    <span className="mx-2">/</span>
                    <span className="text-foreground font-medium">Todos los productos</span>
                </nav>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Todos los Productos</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Explora nuestra selección completa de productos y compara precios.
                </p>
            </div>

            {products && products.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {products.map((product) => (
                        <Link key={product.id} href={`/product/${product.id}`}>
                            <Card className="h-full overflow-hidden transition-colors hover:bg-muted/50">
                                <div className="aspect-square relative">
                                    <Image
                                        src={product.image || "/placeholder.svg"}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <CardContent className="p-4">
                                    <p className="text-sm text-muted-foreground mb-1">
                                        {(product as any).categories?.name}
                                    </p>
                                    <h3 className="font-bold mb-2 line-clamp-1">{product.name}</h3>
                                    <p className="text-xl font-bold text-primary">{formatPrice(product.price)}</p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed text-center">
                    <h2 className="mb-2 text-xl font-semibold">No se encontraron productos</h2>
                    <p className="text-muted-foreground">No hay productos disponibles en este momento.</p>
                </div>
            )}
        </div>
    )
}
