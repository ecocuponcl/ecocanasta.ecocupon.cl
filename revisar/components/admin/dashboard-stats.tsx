import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Package, Percent, ShoppingBag } from "lucide-react"

interface DashboardStatsProps {
  stats: {
    productCount: number
    categoryCount: number
    discountCount: number
    averagePrice: number
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.productCount}</div>
          <p className="text-xs text-muted-foreground">Productos en la base de datos</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Productos con descuento</CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.discountCount}</div>
          <p className="text-xs text-muted-foreground">
            {stats.productCount > 0
              ? `${Math.round((stats.discountCount / stats.productCount) * 100)}% del total`
              : "No hay productos"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Precio promedio</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.averagePrice.toLocaleString()}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <span>Promedio de todos los productos</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Categorías</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.categoryCount}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <span>Categorías activas</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
