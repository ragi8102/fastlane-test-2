import { WizardProvider } from '@/components/wizard-context';
import { WizardHeader } from './wizard-header';
import { WizardSidebar } from './wizard-sidebar';
import type { ReactNode } from 'react';

interface WizardLayoutProps {
  children: ReactNode;
}

export function WizardLayout({ children }: WizardLayoutProps) {
  return (
    <WizardProvider>
      <div className="min-h-screen bg-background">
        <WizardHeader />
        <div className="flex">
          <WizardSidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </WizardProvider>
  );
}
