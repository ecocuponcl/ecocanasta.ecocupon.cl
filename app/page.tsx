import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { createServerClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/utils"

export const revalidate = 3600 // Revalidate every hour

async function getCategories() {
  const supabase = createServerClient()
  const { data, error } = await supabase.from("categories").select("*")

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data
}

async function getDiscountedProducts() {
  const supabase = createServerClient()

  // Primero obtenemos los productos básicos
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6)

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  // Luego obtenemos las categorías y precios de comparación para cada producto
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
        category: category || { name: "Sin categoría", slug: "sin-categoria" },
      }
    }),
  )

  // Filtrar productos con descuento (precio de comparación menor que el precio original)
  return productsWithData.filter((product) => product.comparisonPrice && product.comparisonPrice.price < product.price)
}

export default async function Home() {
  const categories = await getCategories()
  const discountedProducts = await getDiscountedProducts()

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Categorías destacadas */}
      <section className="mb-6 sm:mb-12">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="bg-gray-800 text-white overflow-hidden">
            <CardContent className="p-3 sm:p-6 flex flex-col h-full">
              <div className="flex items-center mb-2 sm:mb-4">
                <div className="p-1 sm:p-2 rounded-full bg-green-600 mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="sm:w-6 sm:h-6"
                  >
                    <path d="M3 3h18v18H3z" />
                    <path d="M12 8v8" />
                    <path d="m8 12 4-4 4 4" />
                  </svg>
                </div>
                <h2 className="text-sm sm:text-xl font-bold">Ofertas de hoy</h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 mb-2 sm:mb-4">
                Aquí encontrarás las bajadas de precio de las últimas horas
              </p>
              <div className="mt-auto">
                <Button
                  asChild
                  variant="secondary"
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm py-1 sm:py-2"
                >
                  <Link href="/category/all" className="flex items-center justify-center">
                    Ver Ofertas
                    <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 text-white overflow-hidden">
            <CardContent className="p-3 sm:p-6 flex flex-col h-full">
              <div className="flex items-center mb-2 sm:mb-4">
                <div className="p-1 sm:p-2 rounded-full bg-blue-600 mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="sm:w-6 sm:h-6"
                  >
                    <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                    <path d="M12 18h.01" />
                  </svg>
                </div>
                <h2 className="text-sm sm:text-xl font-bold">Ofertas Tecno</h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 mb-2 sm:mb-4">
                Las mejores ofertas en tecnología de la semana
              </p>
              <div className="mt-auto">
                <Button
                  asChild
                  variant="secondary"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm py-1 sm:py-2"
                >
                  <Link href="/category/electronics" className="flex items-center justify-center">
                    Ver Ofertas
                    <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 text-white overflow-hidden">
            <CardContent className="p-3 sm:p-6 flex flex-col h-full">
              <div className="flex items-center mb-2 sm:mb-4">
                <div className="p-1 sm:p-2 rounded-full bg-purple-600 mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="sm:w-6 sm:h-6"
                  >
                    <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
                  </svg>
                </div>
                <h2 className="text-sm sm:text-xl font-bold">Ofertas Moda</h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 mb-2 sm:mb-4">Ofertas de ropa y calzado de la semana</p>
              <div className="mt-auto">
                <Button
                  asChild
                  variant="secondary"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm py-1 sm:py-2"
                >
                  <Link href="/category/fashion" className="flex items-center justify-center">
                    Ofertas Ropa
                    <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 text-white overflow-hidden">
            <CardContent className="p-3 sm:p-6 flex flex-col h-full">
              <div className="flex items-center mb-2 sm:mb-4">
                <div className="p-1 sm:p-2 rounded-full bg-amber-600 mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="sm:w-6 sm:h-6"
                  >
                    <path d="M21 7v6h-6" />
                    <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
                  </svg>
                </div>
                <h2 className="text-sm sm:text-xl font-bold">Ofertas Hogar</h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 mb-2 sm:mb-4">
                Los mejores descuentos en productos para el hogar
              </p>
              <div className="mt-auto">
                <Button
                  asChild
                  variant="secondary"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm py-1 sm:py-2"
                >
                  <Link href="/category/home" className="flex items-center justify-center">
                    Ver Hogar
                    <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mejores ofertas */}
      <section className="mb-6 sm:mb-12">
        <div className="flex justify-between items-center mb-3 sm:mb-6">
          <h2 className="text-lg sm:text-2xl font-bold flex items-center">
            Mejores Ofertas de hoy
            <span className="ml-2">🔥</span>
          </h2>
          <Button asChild variant="outline" size="sm" className="text-xs sm:text-sm">
            <Link href="/category/all">Ver Todo</Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {discountedProducts.map((product) => {
            const discount = product.comparisonPrice
              ? Math.round(((product.price - product.comparisonPrice.price) / product.price) * 100)
              : 0

            return (
              <Card key={product.id} className="overflow-hidden border border-gray-200 h-full flex flex-col">
                <Link href={`/product/${product.id}`} className="relative block h-28 sm:h-32 md:h-40 bg-gray-100">
                  <Image
                    src={product.image || "/placeholder.svg?height=200&width=200"}
                    alt={product.name}
                    fill
                    className="object-contain p-2"
                  />
                </Link>
                <CardContent className="p-2 sm:p-4 flex flex-col flex-grow">
                  <div className="mb-1 sm:mb-2 text-xs text-gray-500">{product.category.name}</div>
                  <Link href={`/product/${product.id}`} className="hover:underline">
                    <h3 className="font-medium text-xs sm:text-sm line-clamp-2 mb-1 sm:mb-2">{product.name}</h3>
                  </Link>
                  <div className="mt-auto">
                    <div className="flex flex-col">
                      <span className="text-gray-500 line-through text-xs">${formatPrice(product.price)}</span>
                      <span className="font-bold text-sm sm:text-lg">
                        ${formatPrice(product.comparisonPrice?.price || 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1 sm:mt-2">
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-1 sm:px-2 py-0.5 rounded">
                        {discount}% OFF
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Descuentos por rango */}
      <section className="mb-6 sm:mb-12">
        <h2 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-6">Descuentos</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <Card className="bg-gray-800 text-white overflow-hidden">
            <CardContent className="p-3 sm:p-6 flex flex-col h-full">
              <div className="flex flex-col items-center justify-center h-16 sm:h-24">
                <div className="text-base sm:text-2xl font-bold">DESDE</div>
                <div className="text-2xl sm:text-4xl font-bold">30%</div>
                <div className="text-base sm:text-xl font-bold">OFF</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 text-white overflow-hidden">
            <CardContent className="p-3 sm:p-6 flex flex-col h-full">
              <div className="flex flex-col items-center justify-center h-16 sm:h-24">
                <div className="text-base sm:text-2xl font-bold">DESDE</div>
                <div className="text-2xl sm:text-4xl font-bold">40%</div>
                <div className="text-base sm:text-xl font-bold">OFF</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 text-white overflow-hidden">
            <CardContent className="p-3 sm:p-6 flex flex-col h-full">
              <div className="flex flex-col items-center justify-center h-16 sm:h-24">
                <div className="text-base sm:text-2xl font-bold">DESDE</div>
                <div className="text-2xl sm:text-4xl font-bold">50%</div>
                <div className="text-base sm:text-xl font-bold">OFF</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 text-white overflow-hidden">
            <CardContent className="p-3 sm:p-6 flex flex-col h-full">
              <div className="flex flex-col items-center justify-center h-16 sm:h-24">
                <div className="text-base sm:text-2xl font-bold">DESDE</div>
                <div className="text-2xl sm:text-4xl font-bold">60%</div>
                <div className="text-base sm:text-xl font-bold">OFF</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Todas las categorías */}
      <section className="mb-6 sm:mb-12">
        <h2 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-6">Todas las categorías</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {categories.map((category) => (
            <Link href={`/category/${category.slug}`} key={category.id}>
              <Card className="overflow-hidden h-full transition-all hover:shadow-lg">
                <div className="relative h-32 sm:h-48 w-full">
                  <Image
                    src={category.image || "/placeholder.svg?height=400&width=600"}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-3 sm:p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base sm:text-xl font-semibold">{category.name}</h2>
                    <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </div>
                  <p className="text-muted-foreground text-xs sm:text-sm mt-1 sm:mt-2">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
