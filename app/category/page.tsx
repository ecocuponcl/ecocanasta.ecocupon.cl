import { createServerClient } from "@/lib/supabase/server"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function CategoriesPage() {
    const supabase = await createServerClient()
    const { data: categories, error } = await supabase.from("categories").select("*")

    if (error) {
        console.error("Error fetching categories:", error)
    }

    return (
        <div className="container py-8">
            <div className="mb-8">
                <nav className="mb-4 flex text-sm text-muted-foreground">
                    <Link href="/" className="hover:text-primary">Inicio</Link>
                    <span className="mx-2">/</span>
                    <span className="text-foreground font-medium">Categorías</span>
                </nav>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Explorar Categorías</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Encuentra los mejores precios buscando por categoría de producto.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                <Link href="/category/all">
                    <Card className="h-full transition-colors hover:bg-muted/50 border-primary/20">
                        <CardContent className="flex flex-col items-center p-6 text-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                <span className="text-2xl font-bold text-primary">📦</span>
                            </div>
                            <h3 className="font-bold">Todos</h3>
                        </CardContent>
                    </Card>
                </Link>
                {categories?.map((category) => (
                    <Link key={category.id} href={`/category/${category.slug}`}>
                        <Card className="h-full transition-colors hover:bg-muted/50">
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
        </div>
    )
}
