import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Productos</CardTitle>
          <CardDescription>Agregar, editar y eliminar productos del catálogo</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Funcionalidad de gestión de productos vendrá pronto...</p>
        </CardContent>
      </Card>
    </div>
  );
}