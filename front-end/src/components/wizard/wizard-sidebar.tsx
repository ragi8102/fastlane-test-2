'use client';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useWizard, useWizardNavigation } from '@/components/wizard-context';
import { CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function WizardSidebar() {
  const { state } = useWizard();
  const { goToStep } = useWizardNavigation();

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'current':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const completedSteps = state.steps.filter(
    (step) => step.status === 'completed'
  ).length;
  const totalSteps = state.steps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  return (
    <aside className="w-80 border-r border-border bg-card p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Migration Progress
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {completedSteps} of {totalSteps} steps completed
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground mb-3">Steps</h3>
          {state.steps.map((step) => (
            <Button
              key={step.id}
              variant="ghost"
              className={cn(
                'w-full justify-start h-auto p-3 text-left',
                step.status === 'current' && 'bg-accent',
                step.status === 'completed' && 'text-muted-foreground'
              )}
              onClick={() => goToStep(step.id)}
              disabled={
                step.status === 'pending' && step.id > state.currentStep
              }
            >
              <div className="flex items-start gap-3 w-full">
                <div className="flex-shrink-0 mt-0.5">
                  {getStepIcon(step.status)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      {step.id.toString().padStart(2, '0')}
                    </span>
                    <span className="text-sm font-medium truncate">
                      {step.title}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {step.description}
                  </p>
                </div>
              </div>
            </Button>
          ))}
        </div>

        <div className="pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-blue-600" />
              <span>Current Step</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="h-3 w-3 text-muted-foreground" />
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-3 w-3 text-red-600" />
              <span>Error</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
