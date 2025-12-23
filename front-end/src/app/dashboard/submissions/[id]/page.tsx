import { requireAuth } from '@/lib/session';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { SubmissionDetails } from '@/components/dashboard/submission-details';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function SubmissionDetailsPage({ params }: PageProps) {
  await requireAuth();

  // In a real app, you would fetch the submission from your database
  const submissionId = params.id;

  if (!submissionId) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <SubmissionDetails submissionId={submissionId} />
      </main>
    </div>
  );
}
