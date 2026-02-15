import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ecocanasta.ecocupon.cl'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Fetch categories
    const { data: categories } = await supabase
        .from('categories')
        .select('slug, created_at')

    // Fetch products
    const { data: products } = await supabase
        .from('products')
        .select('id, created_at')
        .limit(1000)

    const categoryUrls = (categories || []).map((category) => ({
        url: `${baseUrl}/category/${category.slug}`,
        lastModified: new Date(category.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    const productUrls = (products || []).map((product) => ({
        url: `${baseUrl}/product/${product.id}`,
        lastModified: new Date(product.created_at),
        changeFrequency: 'daily' as const,
        priority: 0.6,
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/category`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/product`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        ...categoryUrls,
        ...productUrls,
    ]
}
