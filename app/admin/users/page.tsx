import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Usuarios</CardTitle>
          <CardDescription>Ver y administrar usuarios registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Funcionalidad de gestión de usuarios vendrá pronto...</p>
        </CardContent>
      </Card>
    </div>
  );
}