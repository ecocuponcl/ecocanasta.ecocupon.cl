import Link from "next/link"
import { cn } from "@/lib/utils"
import { createServerClient } from "@/lib/supabase/server"

interface MainNavProps {
    className?: string
}

async function getCategories() {
    try {
        const supabase = createServerClient()
        const { data } = await supabase.from("categories").select("name, slug")
        return data || []
    } catch (error) {
        console.error("Error fetching categories for MainNav:", error)
        return []
    }
}

export async function MainNav({ className }: MainNavProps) {
    const categories = await getCategories()

    const items = [
        {
            title: "Inicio",
            href: "/",
        },
        ...categories.map((category: any) => ({
            title: category.name,
            href: `/category/${category.slug}`,
        })),
    ]

    return (
        <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
            {items.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium transition-colors hover:text-primary"
                >
                    {item.title}
                </Link>
            ))}
        </nav>
    )
}
