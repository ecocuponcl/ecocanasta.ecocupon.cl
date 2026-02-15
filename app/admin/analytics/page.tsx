import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analytics y Estadísticas</CardTitle>
          <CardDescription>Ver métricas y análisis del sitio</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Funcionalidad de analytics vendrá pronto...</p>
        </CardContent>
      </Card>
    </div>
  );
}