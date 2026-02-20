import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/utils"
import type { Database } from "@/lib/database.types"

type Category = Database["public"]["Tables"]["categories"]["Row"]
type Product = Database["public"]["Tables"]["products"]["Row"]
type KnastaPrice = Database["public"]["Tables"]["knasta_prices"]["Row"]

type EnrichedProduct = Product & {
  knastaPrice: KnastaPrice | null
  categoryName: string
  categorySlug: string
}

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

async function getCategoryWithProducts(slug: string) {
  const supabase = await createClient()

  let category: Category | { id: string; name: string; slug: string; description: string | null } | null = null
  let products: Product[] = []

  if (slug === "all") {
    category = { id: "all", name: "Todas las ofertas", slug: "all", description: "Todas las ofertas disponibles" }
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })
    if (error) {
      console.error("Error fetching products:", error)
      return { category, products: [] }
    }
    products = (data as Product[]) ?? []
  } else {
    const { data: cat, error: catErr } = await supabase.from("categories").select("*").eq("slug", slug).single()
    if (catErr || !cat) return null
    category = cat as Category

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", cat.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching products:", error)
      return { category, products: [] }
    }
    products = (data as Product[]) ?? []
  }

  const enriched = await Promise.all(
    products.map(async (p) => {
      const { data: cat } = await supabase.from("categories").select("name, slug").eq("id", p.category_id).single()
      const { data: prices } = await supabase.from("knasta_prices").select("*").eq("product_id", p.id)
      const knastaPrice = prices && prices.length > 0 ? (prices[0] as KnastaPrice) : null

      return {
        ...p,
        knastaPrice,
        categoryName: (cat as Category)?.name || "General",
        categorySlug: (cat as Category)?.slug || "all",
      }
    }),
  )

  return { category, products: enriched as EnrichedProduct[] }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const data = await getCategoryWithProducts(slug)

  if (!data) notFound()

  const { category, products } = data

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:py-8">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <Link href="/" className="mb-3 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Volver
        </Link>
        <h1 className="text-xl font-bold sm:text-3xl">{category?.name || 'Categoría no encontrada'}</h1>
        {category?.description && <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>}
        <p className="mt-2 text-xs text-muted-foreground">
          {products.length} {products.length === 1 ? "producto" : "productos"}
        </p>
      </div>

      {/* Products grid */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground">No hay productos en esta categoria.</p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => {
            const discount = product.knastaPrice
              ? Math.round(((product.price - product.knastaPrice.price) / product.price) * 100)
              : 0

            return (
              <Link key={product.id} href={`/product/${product.id}`} className="group">
                <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
                  <div className="relative aspect-square bg-muted">
                    <Image
                      src={product.image || "/placeholder.svg?height=300&width=300"}
                      alt={product.name}
                      fill
                      className="object-contain p-3"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                    {discount > 0 && (
                      <Badge className="absolute left-2 top-2 bg-primary text-primary-foreground">
                        -{discount}%
                      </Badge>
                    )}
                  </div>
                  <CardContent className="flex flex-1 flex-col p-2.5 sm:p-4">
                    <span className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground sm:text-xs">
                      {product.categoryName}
                    </span>
                    <h3 className="mb-2 line-clamp-2 text-xs font-medium leading-snug group-hover:underline sm:text-sm">
                      {product.name}
                    </h3>
                    <div className="mt-auto">
                      {product.knastaPrice && discount > 0 ? (
                        <>
                          <span className="block text-xs text-muted-foreground line-through">
                            ${formatPrice(product.price)}
                          </span>
                          <span className="text-base font-bold sm:text-lg">
                            ${formatPrice(product.knastaPrice.price)}
                          </span>
                        </>
                      ) : (
                        <span className="text-base font-bold sm:text-lg">${formatPrice(product.price)}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
