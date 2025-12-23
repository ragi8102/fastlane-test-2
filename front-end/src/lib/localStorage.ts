import type { WizardData, WizardStep } from '../components/wizard-context';

export interface Submission {
  id: string;
  name: string;
  sourceUrl: string;
  targetUrl: string;
  status: 'completed' | 'in-progress' | 'failed' | 'pending';
  progress: number;
  createdAt: string;
  updatedAt: string;
  currentStep: string;
  wizardData?: WizardData;
  userId?: string;
}

const SUBMISSIONS_KEY = 'migration_submissions';
const WIZARD_STATE_KEY = 'wizard_state';

// Submissions localStorage utilities
export const submissionsStorage = {
  getAll: (): Submission[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(SUBMISSIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  getById: (id: string): Submission | null => {
    const submissions = submissionsStorage.getAll();
    return submissions.find((s) => s.id === id) || null;
  },

  create: (
    submission: Omit<Submission, 'id' | 'createdAt' | 'updatedAt'>
  ): Submission => {
    const newSubmission: Submission = {
      ...submission,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const submissions = submissionsStorage.getAll();
    submissions.push(newSubmission);
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
    return newSubmission;
  },

  update: (id: string, updates: Partial<Submission>): Submission | null => {
    const submissions = submissionsStorage.getAll();
    const index = submissions.findIndex((s) => s.id === id);

    if (index === -1) return null;

    submissions[index] = {
      ...submissions[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
    return submissions[index];
  },

  delete: (id: string): boolean => {
    const submissions = submissionsStorage.getAll();
    const filtered = submissions.filter((s) => s.id !== id);

    if (filtered.length === submissions.length) return false;

    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(filtered));
    return true;
  },

  // Initialize with sample data if empty
  initializeSampleData: () => {
    const existing = submissionsStorage.getAll();
    if (existing.length === 0) {
      const sampleSubmissions: Omit<
        Submission,
        'id' | 'createdAt' | 'updatedAt'
      >[] = [
        {
          name: 'Corporate Website Migration',
          sourceUrl: 'https://old-corp-site.com',
          targetUrl: 'https://new-corp-site.com',
          status: 'completed',
          progress: 100,
          currentStep: 'Deploy',
        },
        {
          name: 'E-commerce Platform Update',
          sourceUrl: 'https://shop.example.com',
          targetUrl: 'https://newshop.example.com',
          status: 'in-progress',
          progress: 65,
          currentStep: 'Component Generation',
        },
        {
          name: 'Blog Content Migration',
          sourceUrl: 'https://blog.oldsite.com',
          targetUrl: 'https://blog.newsite.com',
          status: 'failed',
          progress: 30,
          currentStep: 'Content Model',
        },
      ];

      sampleSubmissions.forEach((submission) => {
        submissionsStorage.create(submission);
      });
    }
  },
};

// Wizard state localStorage utilities
export const wizardStorage = {
  save: (state: {
    currentStep: number;
    steps: WizardStep[];
    data: WizardData;
    isLoading: boolean;
    error: string | null;
  }) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(WIZARD_STATE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save wizard state:', error);
    }
  },

  load: () => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(WIZARD_STATE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  clear: () => {
    if (typeof window === 'undefined') return;
    try {
      // Log what we're trying to clear
      console.log('Clearing wizard state from localStorage...');
      console.log('Key:', WIZARD_STATE_KEY);
      console.log(
        'Value before clear:',
        localStorage.getItem(WIZARD_STATE_KEY)
      );

      // Remove the wizard state
      localStorage.removeItem(WIZARD_STATE_KEY);

      // Verify it was removed
      console.log('Value after clear:', localStorage.getItem(WIZARD_STATE_KEY));

      // Also clear any other wizard-related keys that might exist
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('wizard') || key.includes('migration'))) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach((key) => {
        console.log('Removing additional key:', key);
        localStorage.removeItem(key);
      });

      console.log('Wizard localStorage cleared successfully');
    } catch (error) {
      console.error('Failed to clear wizard state:', error);
    }
  },

  // Alternative clear method that clears all localStorage
  clearAll: () => {
    if (typeof window === 'undefined') return;
    try {
      console.log('Clearing all localStorage...');
      localStorage.clear();
      console.log('All localStorage cleared');
    } catch (error) {
      console.error('Failed to clear all localStorage:', error);
    }
  },
};
