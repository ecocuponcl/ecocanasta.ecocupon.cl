import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"

interface ProductPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params
    const supabase = await createServerClient()

    const { data: product, error } = await supabase
        .from("products")
        .select("*, categories(name, slug)")
        .eq("id", parseInt(id))
        .single()

    if (error || !product) {
        return notFound()
    }

    return (
        <div className="container py-8">
            <nav className="mb-8 flex text-sm text-muted-foreground">
                <Link href="/" className="hover:text-primary">Inicio</Link>
                <span className="mx-2">/</span>
                <Link href="/category" className="hover:text-primary">Categorías</Link>
                <span className="mx-2">/</span>
                <Link href={`/category/${(product as any).categories?.slug}`} className="hover:text-primary">
                    {(product as any).categories?.name}
                </Link>
                <span className="mx-2">/</span>
                <span className="text-foreground font-medium">{product.name}</span>
            </nav>

            <div className="grid gap-8 md:grid-cols-2">
                <div className="relative aspect-square overflow-hidden rounded-xl border bg-white">
                    <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-contain p-8"
                    />
                </div>
                <div className="flex flex-col">
                    <div className="mb-6">
                        <Link
                            href={`/category/${(product as any).categories?.slug}`}
                            className="text-sm font-medium text-primary hover:underline"
                        >
                            {(product as any).categories?.name}
                        </Link>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{product.name}</h1>
                        <p className="mt-4 text-3xl font-bold text-primary">{formatPrice(product.price)}</p>
                    </div>

                    {product.description && (
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold mb-2">Descripción</h2>
                            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                        </div>
                    )}

                    <div className="mt-auto space-y-4">
                        <Button size="lg" className="w-full text-lg">
                            Comparar Precios
                        </Button>
                        <Button size="lg" variant="outline" className="w-full text-lg">
                            Añadir a la lista
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
