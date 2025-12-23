'use client';

import { useWizard } from '@/components/wizard-context';
import { WizardStep1 } from './steps/wizard-step-1';
import { WizardStep2 } from './steps/wizard-step-2';
import { WizardStep3 } from './steps/wizard-step-3';
import { WizardStep4 } from './steps/wizard-step-4';
import { WizardStep5 } from './steps/wizard-step-5';
import { WizardStep6 } from './steps/wizard-step-6';
import { WizardStep7 } from './steps/wizard-step-7';
import { WizardStep8 } from './steps/wizard-step-8';
import { WizardStep9 } from './steps/wizard-step-9';

export function WizardStepRenderer() {
  const { state } = useWizard();

  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return <WizardStep1 />;
      case 2:
        return <WizardStep2 />;
      case 3:
        return <WizardStep3 />;
      case 4:
        return <WizardStep4 />;
      case 5:
        return <WizardStep5 />;
      case 6:
        return <WizardStep6 />;
      case 7:
        return <WizardStep7 />;
      case 8:
        return <WizardStep8 />;
      case 9:
        return <WizardStep9 />;
      default:
        return <WizardStep1 />;
    }
  };

  return <div className="w-full">{renderStep()}</div>;
}
