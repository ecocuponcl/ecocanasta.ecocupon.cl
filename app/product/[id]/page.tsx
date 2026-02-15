import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ProductCoupon } from "@/components/product-coupon"
import { createServerClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/utils"

export const revalidate = 3600 // Revalidate every hour

interface ProductPageProps {
  params: {
    id: string
  }
}

async function getProductDetails(id: string) {
  const supabase = createServerClient()

  // Get product
  const { data: product, error: productError } = await supabase.from("products").select("*").eq("id", id).single()

  if (productError || !product) {
    return null
  }

  // Get category
  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("*")
    .eq("id", product.category_id)
    .single()

  if (categoryError) {
    console.error("Error fetching category:", categoryError)
    return null
  }

  // Get product specs
  const { data: specs, error: specsError } = await supabase.from("product_specs").select("*").eq("product_id", id)

  if (specsError) {
    console.error("Error fetching product specs:", specsError)
  }

  // Get comparison price
  const { data: comparisonPrices, error: comparisonError } = await supabase
    .from("knasta_prices")
    .select("*")
    .eq("product_id", id)

  if (comparisonError) {
    console.error("Error fetching comparison price:", comparisonError)
  }

  const comparisonPrice = comparisonPrices && comparisonPrices.length > 0 ? comparisonPrices[0] : null

  return {
    ...product,
    categoryName: category.name,
    categorySlug: category.slug,
    specs: specs || [],
    comparisonPrice,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductDetails(params.id)

  if (!product) {
    notFound()
  }

  const discount =
    product.comparisonPrice && product.comparisonPrice.price < product.price
      ? Math.round(((product.price - product.comparisonPrice.price) / product.price) * 100)
      : 0

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <Link
        href={`/category/${product.categorySlug}`}
        className="flex items-center text-muted-foreground mb-4 sm:mb-6 hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        <span className="text-sm">Volver a {product.categoryName}</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        <div className="relative aspect-square w-full bg-muted rounded-lg overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg?height=400&width=400"}
            alt={product.name}
            fill
            className="object-contain p-4"
            priority
          />
        </div>

        <div>
          <div className="mb-2 text-sm text-gray-500">{product.categoryName}</div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">{product.name}</h1>

          {product.comparisonPrice ? (
            <div className="flex flex-col mb-3 sm:mb-4">
              <span className="text-gray-500 line-through text-base sm:text-lg">${formatPrice(product.price)}</span>
              <div className="flex items-center">
                <span className="font-bold text-2xl sm:text-3xl mr-2">
                  ${formatPrice(product.comparisonPrice.price)}
                </span>
                {discount > 0 && (
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded">
                    {discount}% OFF
                  </span>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">${formatPrice(product.price)}</p>
          )}

          <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6">{product.description}</p>

          {product.comparisonPrice && (
            <Card className="mb-4 sm:mb-6">
              <CardContent className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg font-semibold">Comparación de precios</h3>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between">
                    <span>Precio regular:</span>
                    <span className="font-semibold">${formatPrice(product.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Precio con descuento:</span>
                    <span className="font-semibold">${formatPrice(product.comparisonPrice.price)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span>Ahorro:</span>
                    <span
                      className={`font-semibold ${product.comparisonPrice.price < product.price ? "text-green-600" : "text-red-600"}`}
                    >
                      {product.comparisonPrice.price < product.price
                        ? `-${formatPrice(product.price - product.comparisonPrice.price)} (-${discount}%)`
                        : `+${formatPrice(product.comparisonPrice.price - product.price)} (+${Math.round(((product.comparisonPrice.price - product.price) / product.price) * 100)}%)`}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {discount > 0 && <ProductCoupon product={product} discount={discount} />}

          <div className="flex gap-3 sm:gap-4 mt-4 sm:mt-6">
            <Button className="w-full text-sm sm:text-base py-2 sm:py-3">Comprar</Button>
            <Button variant="outline" size="icon" className="aspect-square h-auto">
              <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="sr-only">Compartir</span>
            </Button>
          </div>

          {product.specs.length > 0 && (
            <div className="mt-6 sm:mt-8">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Especificaciones</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                {product.specs.map((spec) => (
                  <div key={spec.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{spec.name}:</span>
                    <span className="font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
