'use client';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserNav } from '@/components/user-nav';
import { AltudoLogo } from '@/components/altudo-logo';
import { useWizard } from '@/components/wizard-context';
import { Workflow, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export function WizardHeader() {
  const { state } = useWizard();
  const currentStep = state.steps.find((step) => step.id === state.currentStep);

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <AltudoLogo />
          <div className="flex items-center gap-2">
            <Workflow className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                Migration Wizard
              </h1>
              {currentStep && (
                <p className="text-sm text-muted-foreground">
                  Step {currentStep.id}: {currentStep.title}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Save className="h-4 w-4" />
            Save Progress
          </Button>
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
