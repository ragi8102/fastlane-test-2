import { requireAuth } from '@/lib/session';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { SubmissionsList } from '@/components/dashboard/submissions-list';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';

export default async function DashboardPage() {
  await requireAuth();

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Migration Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage and track your content migration projects
            </p>
          </div>

          <DashboardStats />
          <SubmissionsList />
        </div>
      </main>
    </div>
  );
}
