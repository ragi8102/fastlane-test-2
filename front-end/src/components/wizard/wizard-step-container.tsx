'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  useWizard,
  useWizardNavigation,
  useWizardStep,
} from '@/components/wizard-context';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

interface WizardStepContainerProps {
  children: ReactNode;
  onNext?: () => void | Promise<void>;
  onPrev?: () => void;
  nextLabel?: string;
  prevLabel?: string;
  canProceed?: boolean;
  isLoading?: boolean;
}

export function WizardStepContainer({
  children,
  onNext,
  onPrev,
  nextLabel = 'Next Step',
  prevLabel = 'Previous',
  canProceed = true,
  isLoading = false,
}: WizardStepContainerProps) {
  const { state } = useWizard();
  const { nextStep, prevStep } = useWizardNavigation();
  const currentStep = useWizardStep();

  const handleNext = async () => {
    if (onNext) {
      await onNext();
    }
    if (canProceed) {
      nextStep();
    }
  };

  const handlePrev = () => {
    if (onPrev) {
      onPrev();
    }
    prevStep();
  };

  const isFirstStep = state.currentStep === 1;
  const isLastStep = state.currentStep === state.steps.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Step {currentStep?.id}
            </span>
            <span>{currentStep?.title}</span>
          </CardTitle>
          <CardDescription>{currentStep?.description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={isFirstStep || isLoading}
          className="gap-2 bg-transparent"
        >
          <ArrowLeft className="h-4 w-4" />
          {prevLabel}
        </Button>

        <Button
          onClick={handleNext}
          disabled={!canProceed || isLoading}
          className="gap-2"
        >
          {isLoading
            ? 'Processing...'
            : isLastStep
            ? 'Complete Migration'
            : nextLabel}
          {!isLoading && <ArrowRight className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
