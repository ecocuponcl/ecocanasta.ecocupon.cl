import { redirect } from 'next/navigation';
import { verifyAdminAccess } from '@/lib/actions/admin';
import { Card, CardContent } from '@/components/ui/card';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verify admin access at the layout level too
  const { success, message } = await verifyAdminAccess();
  
  if (!success) {
    // Redirect to home if not admin
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="container py-6">
        <Card>
          <CardContent className="pt-6">
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}