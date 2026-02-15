"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="container flex min-h-[60vh] flex-col items-center justify-center space-y-4 py-8 text-center">
            <h2 className="text-2xl font-bold">¡Algo salió mal!</h2>
            <p className="max-w-md text-muted-foreground">
                Lo sentimos, ha ocurrido un error inesperado. Por favor, intenta de nuevo.
            </p>
            <div className="flex gap-4">
                <Button onClick={() => reset()}>Reintentar</Button>
                <Button variant="outline" onClick={() => (window.location.href = "/")}>
                    Volver al inicio
                </Button>
            </div>
        </div>
    )
}
