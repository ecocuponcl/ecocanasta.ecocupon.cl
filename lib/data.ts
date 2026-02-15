// lib/data.ts content extracted from Vercel
export const categories = [
    { id: 1, name: "Frutas y Verduras", slug: "frutas-verduras", image: "/placeholder.svg?height=100&width=100" },
    { id: 2, name: "Lácteos y Huevos", slug: "lacteos-huevos", image: "/placeholder.svg?height=100&width=100" },
    { id: 3, name: "Carnes y Pescados", slug: "carnes-pescados", image: "/placeholder.svg?height=100&width=100" },
    { id: 4, name: "Despensa", slug: "despensa", image: "/placeholder.svg?height=100&width=100" },
]

export const products = [
    {
        id: 1,
        name: "Aceite de Maravilla 1L",
        price: 1990,
        image: "/placeholder.svg?height=300&width=300",
        categoryId: 4,
        shop: "Supermercado A"
    },
    {
        id: 2,
        name: "Leche Entera 1L",
        price: 950,
        image: "/placeholder.svg?height=300&width=300",
        categoryId: 2,
        shop: "Supermercado B"
    },
]
