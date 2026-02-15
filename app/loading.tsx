export default function Loading() {
    return (
        <div className="container flex min-h-[60vh] flex-col items-center justify-center space-y-4 py-8">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-lg font-medium text-muted-foreground">Cargando EcoCupon...</p>
        </div>
    )
}
