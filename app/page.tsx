import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { createServerClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/utils"

export const revalidate = 3600 // Revalidate every hour

async function getCategories() {
    const supabase = await createServerClient()
    const { data, error } = await supabase.from("categories").select("*")

    if (error) {
        console.error("Error fetching categories:", error)
        return []
    }

    return data
}

async function getFeaturedProducts() {
    const supabase = await createServerClient()
    const { data, error } = await supabase
        .from("products")
        .select("*, categories(name)")
        .limit(4)

    if (error) {
        console.error("Error fetching products:", error)
        return []
    }

    return data
}

export default async function Home() {
    const [categories, featuredProducts] = await Promise.all([
        getCategories(),
        getFeaturedProducts()
    ])

    return (
        <div className="container py-8">
            {/* Hero Section */}
            <section className="mb-12 rounded-xl bg-primary px-6 py-12 text-primary-foreground md:px-12 md:py-20">
                <div className="mx-auto max-w-2xl text-center">
                    <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
                        Ahorra dinero en tus compras diarias
                    </h1>
                    <p className="mb-8 text-lg opacity-90">
                        Comparamos precios de los principales supermercados y tiendas para que siempre encuentres el mejor precio.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button size="lg" variant="secondary" asChild>
                            <Link href="/product">Ver productos</Link>
                        </Button>
                        <Button size="lg" variant="outline" className="bg-transparent" asChild>
                            <Link href="/category">Explorar categorías</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="mb-12">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Categorías Populares</h2>
                    <Button variant="ghost" asChild>
                        <Link href="/category" className="flex items-center gap-1">
                            Ver todas <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {categories.map((category) => (
                        <Link key={category.id} href={`/category/${category.slug}`}>
                            <Card className="transition-colors hover:bg-muted/50">
                                <CardContent className="flex flex-col items-center p-6 text-center">
                                    <div className="mb-4 relative h-16 w-16">
                                        <Image
                                            src={category.image || "/placeholder.svg"}
                                            alt={category.name}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <h3 className="font-medium">{category.name}</h3>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section>
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Ofertas Destacadas</h2>
                    <Button variant="ghost" asChild>
                        <Link href="/product" className="flex items-center gap-1">
                            Ver todos <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {featuredProducts.map((product) => (
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
            </section>
        </div>
    )
}
