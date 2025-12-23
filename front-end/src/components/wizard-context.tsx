'use client';

import type React from 'react';
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from 'react';
import { wizardStorage } from '../lib/localStorage';

export interface WizardStep {
  id: number;
  name: string;
  title: string;
  description: string;
  status: 'pending' | 'current' | 'completed' | 'error';
  isOptional?: boolean;
}

export interface ContentModel {
  templates: Array<{
    name: string;
    fields: Array<{
      name: string;
      type: string;
      required: boolean;
    }>;
  }>;
  contentTypes: Array<{
    name: string;
    description: string;
    fields: string[];
  }>;
}

export interface Requirements {
  technical: string[];
  functional: string[];
  performance: string[];
  security: string[];
}

export interface Component {
  name: string;
  type: string;
  props: Record<string, unknown>;
  description: string;
  code: string;
}

export interface PageTemplate {
  name: string;
  components: string[];
  layout: string;
  description: string;
}

export interface MigratedContent {
  items: Array<{
    id: string;
    name: string;
    template: string;
    fields: Record<string, unknown>;
  }>;
  totalCount: number;
}

export interface MigratedRules {
  rules: Array<{
    name: string;
    condition: string;
    action: string;
  }>;
}

export interface RuleMappings {
  mappings: Array<{
    source: string;
    target: string;
    transformation: string;
  }>;
}

export interface Documentation {
  readme: string;
  apiDocs: string;
  deploymentGuide: string;
  troubleshooting: string;
}

export interface WizardData {
  // Step 1: Source & Destination Inputs
  sourceUrls: string[];
  currentSitecoreUrl: string;
  codeRepositoryUrl: string;
  xmcUrl: string;
  skipHitl: boolean;

  // Step 2: Content Model
  contentModel: ContentModel | null;
  contentModelFiles: string[];

  // Step 3: Requirements
  requirements: Requirements | null;
  requirementsFiles: string[];

  // Step 4: Components
  components: Component[] | null;
  componentFiles: string[];
  componentApprovals: Record<string, boolean>;

  // Step 5: Page Templates
  pageTemplates: PageTemplate[] | null;
  pageTemplateFiles: string[];
  pageApprovals: Record<string, boolean>;

  // Step 6: Content Migration
  migratedContent: MigratedContent | null;
  contentMigrationLogs: string[];

  // Step 7: Rules Migration
  migratedRules: MigratedRules | null;
  ruleMappings: RuleMappings | null;

  // Step 8: Documentation
  documentation: Documentation | null;
  readmeFiles: string[];

  // Step 9: Deploy
  deploymentUrl: string;
  deploymentLogs: string[];
  vercelEnvVars: Record<string, string>;
}

interface WizardState {
  currentStep: number;
  steps: WizardStep[];
  data: WizardData;
  isLoading: boolean;
  error: string | null;
}

type WizardAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'UPDATE_DATA'; payload: Partial<WizardData> }
  | {
      type: 'SET_STEP_STATUS';
      payload: { stepId: number; status: WizardStep['status'] };
    }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_WIZARD' }
  | { type: 'LOAD_STATE'; payload: WizardState };

const initialSteps: WizardStep[] = [
  {
    id: 1,
    name: 'inputs',
    title: 'Source & Destination Inputs',
    description: 'Configure source URLs and destination settings',
    status: 'current',
  },
  {
    id: 2,
    name: 'content-model',
    title: 'Generate Content Model',
    description: 'AI-powered content model generation',
    status: 'pending',
  },
  {
    id: 3,
    name: 'requirements',
    title: 'Requirement Generation',
    description: 'Generate technical requirements from content model',
    status: 'pending',
  },
  {
    id: 4,
    name: 'components',
    title: 'Generate Components',
    description: 'Create component inventory and forms',
    status: 'pending',
  },
  {
    id: 5,
    name: 'templates',
    title: 'Create Page Templates',
    description: 'Assemble page templates from components',
    status: 'pending',
  },
  {
    id: 6,
    name: 'content',
    title: 'Migrate Content',
    description: 'Launch web harvester and migrate content',
    status: 'pending',
  },
  {
    id: 7,
    name: 'rules',
    title: 'Migrate Rules',
    description: 'Migrate business rules and mappings',
    status: 'pending',
  },
  {
    id: 8,
    name: 'documentation',
    title: 'Generate Documentation',
    description: 'Create comprehensive documentation',
    status: 'pending',
  },
  {
    id: 9,
    name: 'deploy',
    title: 'Deploy',
    description: 'Deploy to Vercel with environment setup',
    status: 'pending',
  },
];

const initialData: WizardData = {
  sourceUrls: [],
  currentSitecoreUrl: '',
  codeRepositoryUrl: '',
  xmcUrl: '',
  skipHitl: false,
  contentModel: null,
  contentModelFiles: [],
  requirements: null,
  requirementsFiles: [],
  components: null,
  componentFiles: [],
  componentApprovals: {},
  pageTemplates: null,
  pageTemplateFiles: [],
  pageApprovals: {},
  migratedContent: null,
  contentMigrationLogs: [],
  migratedRules: null,
  ruleMappings: null,
  documentation: null,
  readmeFiles: [],
  deploymentUrl: '',
  deploymentLogs: [],
  vercelEnvVars: {},
};

const initialState: WizardState = {
  currentStep: 1,
  steps: initialSteps,
  data: initialData,
  isLoading: false,
  error: null,
};

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  let newState: WizardState;

  switch (action.type) {
    case 'SET_STEP':
      newState = {
        ...state,
        currentStep: action.payload,
        steps: state.steps.map((step) => ({
          ...step,
          status:
            step.id === action.payload
              ? 'current'
              : step.id < action.payload
              ? 'completed'
              : 'pending',
        })),
      };
      break;

    case 'NEXT_STEP':
      const nextStep = Math.min(state.currentStep + 1, state.steps.length);
      newState = {
        ...state,
        currentStep: nextStep,
        steps: state.steps.map((step) => ({
          ...step,
          status:
            step.id === nextStep
              ? 'current'
              : step.id < nextStep
              ? 'completed'
              : 'pending',
        })),
      };
      break;

    case 'PREV_STEP':
      const prevStep = Math.max(state.currentStep - 1, 1);
      newState = {
        ...state,
        currentStep: prevStep,
        steps: state.steps.map((step) => ({
          ...step,
          status:
            step.id === prevStep
              ? 'current'
              : step.id < prevStep
              ? 'completed'
              : 'pending',
        })),
      };
      break;

    case 'UPDATE_DATA':
      newState = {
        ...state,
        data: { ...state.data, ...action.payload },
      };
      break;

    case 'SET_STEP_STATUS':
      newState = {
        ...state,
        steps: state.steps.map((step) =>
          step.id === action.payload.stepId
            ? { ...step, status: action.payload.status }
            : step
        ),
      };
      break;

    case 'SET_LOADING':
      newState = { ...state, isLoading: action.payload };
      break;

    case 'SET_ERROR':
      newState = { ...state, error: action.payload };
      break;

    case 'RESET_WIZARD':
      newState = initialState;
      break;

    case 'LOAD_STATE':
      newState = action.payload;
      break;

    default:
      newState = state;
  }

  if (action.type !== 'LOAD_STATE') {
    wizardStorage.save(newState);
  }

  return newState;
}

const WizardContext = createContext<{
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
} | null>(null);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  useEffect(() => {
    const savedState = wizardStorage.load();
    if (savedState) {
      dispatch({ type: 'LOAD_STATE', payload: savedState });
    }
  }, []);

  return (
    <WizardContext.Provider value={{ state, dispatch }}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
}

export function useWizardStep() {
  const { state } = useWizard();
  return state.steps.find((step) => step.id === state.currentStep);
}

export function useWizardNavigation() {
  const { dispatch } = useWizard();

  const goToStep = (stepId: number) => {
    dispatch({ type: 'SET_STEP', payload: stepId });
  };

  const nextStep = () => {
    dispatch({ type: 'NEXT_STEP' });
  };

  const prevStep = () => {
    dispatch({ type: 'PREV_STEP' });
  };

  return { goToStep, nextStep, prevStep };
}

export function useWizardData() {
  const { state, dispatch } = useWizard();

  const updateData = (data: Partial<WizardData>) => {
    dispatch({ type: 'UPDATE_DATA', payload: data });
  };

  return { data: state.data, updateData };
}
