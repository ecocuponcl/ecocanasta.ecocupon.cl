import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = createServerClient()

  // Seed categories
  const categories = [
    {
      id: "electronics",
      name: "Electrónicos",
      slug: "electronics",
      description: "Dispositivos electrónicos y gadgets",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: "home",
      name: "Hogar",
      slug: "home",
      description: "Productos para el hogar y decoración",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: "fashion",
      name: "Moda",
      slug: "fashion",
      description: "Ropa, calzado y accesorios",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: "sports",
      name: "Deportes",
      slug: "sports",
      description: "Equipamiento deportivo y accesorios",
      image: "/placeholder.svg?height=400&width=600",
    },
  ]

  const { error: categoriesError } = await supabase.from("categories").upsert(categories)

  if (categoriesError) {
    console.error("Error seeding categories:", categoriesError)
    return NextResponse.json({ error: "Error seeding categories" }, { status: 500 })
  }

  // Seed products
  const products = [
    {
      id: "smartphone-1",
      name: "Smartphone Galaxy S23",
      description: "Smartphone de última generación con cámara de alta resolución y batería de larga duración.",
      price: 699990,
      image: "/placeholder.svg?height=400&width=400",
      category_id: "electronics",
    },
    {
      id: "laptop-1",
      name: "Laptop UltraBook Pro",
      description: "Laptop ultradelgada con procesador de alto rendimiento y pantalla de alta resolución.",
      price: 1299990,
      image: "/placeholder.svg?height=400&width=400",
      category_id: "electronics",
    },
    {
      id: "headphones-1",
      name: "Audífonos Noise Cancelling",
      description: "Audífonos inalámbricos con cancelación de ruido activa y sonido de alta fidelidad.",
      price: 249990,
      image: "/placeholder.svg?height=400&width=400",
      category_id: "electronics",
    },
    {
      id: "sofa-1",
      name: "Sofá Modular Comfort",
      description: "Sofá modular de 3 cuerpos con tela de alta calidad y diseño contemporáneo.",
      price: 899990,
      image: "/placeholder.svg?height=400&width=400",
      category_id: "home",
    },
    {
      id: "table-1",
      name: "Mesa de Centro Nórdica",
      description: "Mesa de centro con diseño nórdico, fabricada en madera de roble y patas de metal.",
      price: 199990,
      image: "/placeholder.svg?height=400&width=400",
      category_id: "home",
    },
    {
      id: "lamp-1",
      name: "Lámpara de Pie Moderna",
      description: "Lámpara de pie con diseño moderno, perfecta para iluminar cualquier espacio de tu hogar.",
      price: 89990,
      image: "/placeholder.svg?height=400&width=400",
      category_id: "home",
    },
    {
      id: "jacket-1",
      name: "Chaqueta Impermeable Mountain",
      description:
        "Chaqueta impermeable para actividades al aire libre con tecnología de protección contra el viento y la lluvia.",
      price: 149990,
      image: "/placeholder.svg?height=400&width=400",
      category_id: "fashion",
    },
    {
      id: "sneakers-1",
      name: "Zapatillas Running Pro",
      description: "Zapatillas de running con amortiguación avanzada y diseño ligero para máximo rendimiento.",
      price: 119990,
      image: "/placeholder.svg?height=400&width=400",
      category_id: "fashion",
    },
    {
      id: "backpack-1",
      name: "Mochila Urbana Tech",
      description: "Mochila urbana con compartimentos para laptop y dispositivos electrónicos, resistente al agua.",
      price: 79990,
      image: "/placeholder.svg?height=400&width=400",
      category_id: "fashion",
    },
  ]

  const { error: productsError } = await supabase.from("products").upsert(products)

  if (productsError) {
    console.error("Error seeding products:", productsError)
    return NextResponse.json({ error: "Error seeding products" }, { status: 500 })
  }

  // Seed product specs
  const specs = [
    { product_id: "smartphone-1", name: "Pantalla", value: "6.1 pulgadas AMOLED" },
    { product_id: "smartphone-1", name: "Procesador", value: "Snapdragon 8 Gen 2" },
    { product_id: "smartphone-1", name: "RAM", value: "8GB" },
    { product_id: "smartphone-1", name: "Almacenamiento", value: "256GB" },
    { product_id: "smartphone-1", name: "Cámara", value: "50MP + 12MP + 10MP" },
    { product_id: "smartphone-1", name: "Batería", value: "3900mAh" },

    { product_id: "laptop-1", name: "Pantalla", value: "15.6 pulgadas 4K" },
    { product_id: "laptop-1", name: "Procesador", value: "Intel Core i7-12700H" },
    { product_id: "laptop-1", name: "RAM", value: "16GB" },
    { product_id: "laptop-1", name: "Almacenamiento", value: "1TB SSD" },
    { product_id: "laptop-1", name: "Gráficos", value: "NVIDIA RTX 3060" },
    { product_id: "laptop-1", name: "Batería", value: "10 horas" },

    { product_id: "headphones-1", name: "Tipo", value: "Over-ear" },
    { product_id: "headphones-1", name: "Conectividad", value: "Bluetooth 5.2" },
    { product_id: "headphones-1", name: "Cancelación de ruido", value: "Activa" },
    { product_id: "headphones-1", name: "Batería", value: "30 horas" },
    { product_id: "headphones-1", name: "Carga rápida", value: "Sí" },
    { product_id: "headphones-1", name: "Micrófono", value: "Integrado" },
  ]

  const { error: specsError } = await supabase.from("product_specs").upsert(specs)

  if (specsError) {
    console.error("Error seeding product specs:", specsError)
    return NextResponse.json({ error: "Error seeding product specs" }, { status: 500 })
  }

  // Seed Knasta prices
  const knastaPrices = [
    {
      product_id: "smartphone-1",
      price: 599990,
      url: "https://knasta.cl/producto/smartphone-galaxy-s23",
      last_updated: new Date().toISOString(),
    },
    {
      product_id: "laptop-1",
      price: 1199990,
      url: "https://knasta.cl/producto/laptop-ultrabook-pro",
      last_updated: new Date().toISOString(),
    },
    {
      product_id: "headphones-1",
      price: 199990,
      url: "https://knasta.cl/producto/audifonos-noise-cancelling",
      last_updated: new Date().toISOString(),
    },
    {
      product_id: "sofa-1",
      price: 949990,
      url: "https://knasta.cl/producto/sofa-modular-comfort",
      last_updated: new Date().toISOString(),
    },
    {
      product_id: "table-1",
      price: 159990,
      url: "https://knasta.cl/producto/mesa-centro-nordica",
      last_updated: new Date().toISOString(),
    },
    {
      product_id: "lamp-1",
      price: 79990,
      url: "https://knasta.cl/producto/lampara-pie-moderna",
      last_updated: new Date().toISOString(),
    },
    {
      product_id: "jacket-1",
      price: 129990,
      url: "https://knasta.cl/producto/chaqueta-impermeable-mountain",
      last_updated: new Date().toISOString(),
    },
    {
      product_id: "sneakers-1",
      price: 99990,
      url: "https://knasta.cl/producto/zapatillas-running-pro",
      last_updated: new Date().toISOString(),
    },
  ]

  const { error: knastaPricesError } = await supabase.from("knasta_prices").upsert(knastaPrices)

  if (knastaPricesError) {
    console.error("Error seeding Knasta prices:", knastaPricesError)
    return NextResponse.json({ error: "Error seeding Knasta prices" }, { status: 500 })
  }

  return NextResponse.json({ success: true, message: "Database seeded successfully" })
}
