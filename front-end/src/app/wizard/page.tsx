import { requireAuth } from '@/lib/session';
import { WizardLayout } from '@/components/wizard/wizard-layout';
import { WizardStepRenderer } from '@/components/wizard/wizard-step-renderer';

export default async function WizardPage() {
  await requireAuth();

  return (
    <WizardLayout>
      <WizardStepRenderer />
    </WizardLayout>
  );
}
