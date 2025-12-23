'use client';

import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface NotificationOptions {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

export function useNotifications() {
  const { toast } = useToast();

  const showSuccess = useCallback(
    (options: NotificationOptions) => {
      toast({
        title: options.title,
        description: options.description,
        variant: 'default',
        duration: options.duration || 5000,
      });
    },
    [toast]
  );

  const showError = useCallback(
    (options: NotificationOptions) => {
      toast({
        title: options.title,
        description: options.description,
        variant: 'destructive',
        duration: options.duration || 7000,
      });
    },
    [toast]
  );

  const showInfo = useCallback(
    (options: NotificationOptions) => {
      toast({
        title: options.title,
        description: options.description,
        variant: 'default',
        duration: options.duration || 5000,
      });
    },
    [toast]
  );

  return {
    showSuccess,
    showError,
    showInfo,
  };
}
