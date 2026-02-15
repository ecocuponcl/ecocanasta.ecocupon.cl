import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { SlidersHorizontal } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/utils"
import { MobileFilter } from "@/components/mobile-filter"

export const revalidate = 3600 // Revalidate every hour

interface CategoryPageProps {
  params: {
    slug: string
  }
  searchParams: {
    minDiscount?: string
  }
}

async function getCategoryWithProducts(slug: string) {
  const supabase = createServerClient()

  // Si es "all", obtener todos los productos
  if (slug === "all") {
    // Obtener productos básicos
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })

    if (productsError) {
      console.error("Error fetching products:", productsError)
      return {
        category: { id: "all", name: "Todas las ofertas", slug: "all", description: "Todas las ofertas disponibles" },
        products: [],
      }
    }

    // Obtener las categorías y precios de comparación para cada producto
    const productsWithData = await Promise.all(
      products.map(async (product) => {
        // Obtener la categoría
        const { data: category } = await supabase
          .from("categories")
          .select("name, slug")
          .eq("id", product.category_id)
          .single()

        // Obtener el precio de comparación
        const { data: comparisonPrices } = await supabase.from("knasta_prices").select("*").eq("product_id", product.id)

        const comparisonPrice = comparisonPrices && comparisonPrices.length > 0 ? comparisonPrices[0] : null

        return {
          ...product,
          comparisonPrice,
          categoryName: category?.name || "Sin categoría",
          categorySlug: category?.slug || "sin-categoria",
        }
      }),
    )

    return {
      category: { id: "all", name: "Todas las ofertas", slug: "all", description: "Todas las ofertas disponibles" },
      products: productsWithData,
    }
  }

  // Get category
  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single()

  if (categoryError || !category) {
    return null
  }

  // Get products for this category
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", category.id)
    .order("created_at", { ascending: false })

  if (productsError) {
    console.error("Error fetching products:", productsError)
    return { category, products: [] }
  }

  // Obtener precios de comparación para cada producto
  const productsWithComparison = await Promise.all(
    products.map(async (product) => {
      const { data: comparisonPrices } = await supabase.from("knasta_prices").select("*").eq("product_id", product.id)

      const comparisonPrice = comparisonPrices && comparisonPrices.length > 0 ? comparisonPrices[0] : null

      return {
        ...product,
        comparisonPrice,
        categoryName: category.name,
        categorySlug: category.slug,
      }
    }),
  )

  return {
    category,
    products: productsWithComparison,
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const data = await getCategoryWithProducts(params.slug)

  if (!data) {
    notFound()
  }

  const { category, products } = data

  // Filtrar por descuento mínimo si existe el parámetro
  const minDiscount = searchParams.minDiscount ? Number.parseInt(searchParams.minDiscount) : 0

  const filteredProducts = products.filter((product) => {
    if (!product.comparisonPrice) return minDiscount === 0

    const discount = Math.round(((product.price - product.comparisonPrice.price) / product.price) * 100)
    return discount >= minDiscount
  })

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{category.name}</h1>
        <p className="text-muted-foreground text-sm">{category.description}</p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">
          {filteredProducts.length} {filteredProducts.length === 1 ? "producto" : "productos"}
        </p>
        <div className="flex items-center gap-2">
          <MobileFilter
            onFilterChange={(discount) => {
              const url = new URL(window.location.href)
              url.searchParams.set("minDiscount", discount.toString())
              window.location.href = url.toString()
            }}
          />
          <div className="hidden lg:flex items-center gap-2">
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {filteredProducts.length === 0 ? (
          <p className="col-span-full text-center py-12 text-muted-foreground">
            No hay productos con los filtros seleccionados
          </p>
        ) : (
          filteredProducts.map((product) => {
            const discount = product.comparisonPrice
              ? Math.round(((product.price - product.comparisonPrice.price) / product.price) * 100)
              : 0

            return (
              <Card key={product.id} className="overflow-hidden flex flex-col h-full">
                <Link href={`/product/${product.id}`} className="relative block h-32 sm:h-40 md:h-48 bg-gray-100">
                  <Image
                    src={product.image || "/placeholder.svg?height=400&width=400"}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                  />
                </Link>
                <CardContent className="p-3 sm:p-4 flex-grow">
                  <div className="mb-2 text-xs text-gray-500">{product.categoryName}</div>
                  <Link href={`/product/${product.id}`} className="hover:underline">
                    <h2 className="font-medium text-xs sm:text-sm md:text-base line-clamp-2 mb-2">{product.name}</h2>
                  </Link>
                  <p className="text-muted-foreground mb-4 text-xs sm:text-sm line-clamp-2">{product.description}</p>

                  <div className="mt-auto">
                    {product.comparisonPrice ? (
                      <div className="flex flex-col">
                        <span className="text-gray-500 line-through text-xs sm:text-sm">
                          ${formatPrice(product.price)}
                        </span>
                        <span className="font-bold text-base sm:text-xl">
                          ${formatPrice(product.comparisonPrice.price)}
                        </span>
                        <div className="flex items-center mt-1">
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                            {discount > 0 ? `${discount}% OFF` : ""}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="font-bold text-base sm:text-xl">${formatPrice(product.price)}</div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-3 sm:p-4 pt-0">
                  <div className="flex gap-2 w-full">
                    <Button asChild className="w-full text-xs sm:text-sm">
                      <Link href={`/product/${product.id}`}>Ver detalles</Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
