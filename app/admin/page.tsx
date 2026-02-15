import { redirect } from 'next/navigation';
import { verifyAdminAccess } from '@/lib/actions/admin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function AdminPage() {
  // Verify admin access
  const { success, message } = await verifyAdminAccess();
  
  if (!success) {
    // Redirect to home if not admin
    redirect('/');
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Panel de Administración</CardTitle>
          <CardDescription>Acceso restringido a usuarios administradores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Opciones de administración:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/admin/products">
                <Button variant="outline" className="w-full h-auto py-6">
                  <div className="text-left">
                    <h4 className="font-semibold">Gestión de Productos</h4>
                    <p className="text-sm text-muted-foreground mt-1">Agregar, editar o eliminar productos</p>
                  </div>
                </Button>
              </Link>
              <Link href="/admin/categories">
                <Button variant="outline" className="w-full h-auto py-6">
                  <div className="text-left">
                    <h4 className="font-semibold">Gestión de Categorías</h4>
                    <p className="text-sm text-muted-foreground mt-1">Administrar categorías de productos</p>
                  </div>
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="outline" className="w-full h-auto py-6">
                  <div className="text-left">
                    <h4 className="font-semibold">Gestión de Usuarios</h4>
                    <p className="text-sm text-muted-foreground mt-1">Ver y administrar usuarios</p>
                  </div>
                </Button>
              </Link>
              <Link href="/admin/analytics">
                <Button variant="outline" className="w-full h-auto py-6">
                  <div className="text-left">
                    <h4 className="font-semibold">Analytics</h4>
                    <p className="text-sm text-muted-foreground mt-1">Ver estadísticas y análisis</p>
                  </div>
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}