import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Share2, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ProductCoupon } from "@/components/product-coupon"
import { createClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/utils"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

async function getProductDetails(id: string) {
  const supabase = await createClient()

  const { data: product, error } = await supabase.from("products").select("*").eq("id", id).single()
  if (error || !product) return null

  const { data: category } = await supabase.from("categories").select("*").eq("id", product.category_id).single()
  if (!category) return null

  const { data: specs } = await supabase.from("product_specs").select("*").eq("product_id", id)
  const { data: prices } = await supabase.from("knasta_prices").select("*").eq("product_id", id)
  const knastaPrice = prices && prices.length > 0 ? prices[0] : null

  return {
    ...product,
    categoryName: category.name,
    categorySlug: category.slug,
    specs: specs ?? [],
    knastaPrice,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getProductDetails(id)

  if (!product) notFound()

  const discount =
    product.knastaPrice && product.knastaPrice.price < product.price
      ? Math.round(((product.price - product.knastaPrice.price) / product.price) * 100)
      : 0

  const savings = product.knastaPrice ? product.price - product.knastaPrice.price : 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:py-8">
      {/* Breadcrumb */}
      <Link
        href={`/category/${product.categorySlug}`}
        className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground sm:mb-6"
      >
        <ArrowLeft className="mr-1.5 h-4 w-4" />
        Volver a {product.categoryName}
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
        {/* Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
          <Image
            src={product.image || "/placeholder.svg?height=500&width=500"}
            alt={product.name}
            fill
            className="object-contain p-4 sm:p-8"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          {discount > 0 && (
            <Badge className="absolute left-3 top-3 bg-primary px-3 py-1 text-sm text-primary-foreground sm:text-base">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <span className="mb-1 text-xs uppercase tracking-wider text-muted-foreground sm:text-sm">
            {product.categoryName}
          </span>
          <h1 className="mb-3 text-xl font-bold sm:text-2xl lg:text-3xl">{product.name}</h1>

          {/* Price */}
          <div className="mb-4">
            {product.knastaPrice && discount > 0 ? (
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground line-through sm:text-base">
                  ${formatPrice(product.price)}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold sm:text-3xl">
                    ${formatPrice(product.knastaPrice.price)}
                  </span>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    Ahorras ${formatPrice(savings)}
                  </Badge>
                </div>
              </div>
            ) : (
              <span className="text-2xl font-bold sm:text-3xl">${formatPrice(product.price)}</span>
            )}
          </div>

          <p className="mb-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {product.description}
          </p>

          {/* Price comparison */}
          {product.knastaPrice && discount > 0 && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <h3 className="mb-3 text-sm font-semibold sm:text-base">Comparacion de precios</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Precio regular</span>
                    <span className="font-medium">${formatPrice(product.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Precio EcoCupon</span>
                    <span className="font-medium">${formatPrice(product.knastaPrice.price)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-medium">Tu ahorro</span>
                    <span className="font-bold text-primary">
                      -${formatPrice(savings)} ({discount}%)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Coupon */}
          {discount > 0 && <ProductCoupon product={product} discount={discount} />}

          {/* Action buttons */}
          <div className="mt-4 flex gap-3">
            {product.knastaPrice?.url ? (
              <Button asChild className="flex-1 gap-2">
                <a href={product.knastaPrice.url} target="_blank" rel="noopener noreferrer">
                  <ShoppingCart className="h-4 w-4" />
                  Comprar
                </a>
              </Button>
            ) : (
              <Button className="flex-1 gap-2">
                <ShoppingCart className="h-4 w-4" />
                Comprar
              </Button>
            )}
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Compartir</span>
            </Button>
          </div>

          {/* Specs */}
          {product.specs.length > 0 && (
            <div className="mt-6 sm:mt-8">
              <h3 className="mb-3 text-sm font-semibold sm:text-base">Especificaciones</h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {product.specs.map((spec: any) => (
                  <div key={spec.id} className="flex justify-between rounded-md bg-muted/50 px-3 py-2 text-sm">
                    <span className="text-muted-foreground">{spec.name}</span>
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
