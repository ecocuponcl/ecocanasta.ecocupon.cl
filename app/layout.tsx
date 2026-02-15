import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Toaster } from "sonner"
import { Analytics } from "@vercel/analytics/react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
    title: {
        default: "EcoCupon - Comparador de Precios de Supermercados",
        template: "%s | EcoCupon"
    },
    description: "Ahorra dinero comparando precios de supermercados y tiendas en Chile. Encuentra las mejores ofertas en tiempo real.",
    keywords: ["comparador de precios", "supermercados", "ofertas", "ahorro", "Chile"],
    authors: [{ name: "EcoCupon Team" }],
    generator: 'v0.dev'
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="es" suppressHydrationWarning>
            <body className={`${inter.className} min-h-screen bg-background antialiased`}>
                <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
                    <div className="relative flex min-h-screen flex-col">
                        <SiteHeader />
                        <main className="flex-1">{children}</main>
                        <SiteFooter />
                    </div>
                    <Toaster />
                    <Analytics />
                </ThemeProvider>
            </body>
        </html>
    )
}
