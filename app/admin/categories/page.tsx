import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Categorías</CardTitle>
          <CardDescription>Administrar las categorías de productos</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Funcionalidad de gestión de categorías vendrá pronto...</p>
        </CardContent>
      </Card>
    </div>
  );
}