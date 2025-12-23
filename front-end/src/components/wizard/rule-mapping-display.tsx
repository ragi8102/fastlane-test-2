'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

interface RuleMapping {
  id: string;
  oldRule: string;
  newRule: string;
  type: string;
  status: string;
}

interface RuleMappingDisplayProps {
  mappings: RuleMapping[];
}

export function RuleMappingDisplay({ mappings }: RuleMappingDisplayProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'mapped':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'URL Redirect':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Security Rule':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Performance Rule':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'Business Logic':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300';
      case 'SEO Rule':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rule Mappings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mappings.map((mapping) => (
            <div key={mapping.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge className={getTypeColor(mapping.type)}>
                    {mapping.type}
                  </Badge>
                  <Badge className={getStatusColor(mapping.status)}>
                    {mapping.status}
                  </Badge>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 items-center">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Old Rule
                  </label>
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                    <code className="text-sm">{mapping.oldRule}</code>
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    New Rule
                  </label>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                    <code className="text-sm">{mapping.newRule}</code>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
