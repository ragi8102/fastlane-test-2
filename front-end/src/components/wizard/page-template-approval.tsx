'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, Eye } from 'lucide-react';

interface PageTemplate {
  id: string;
  name: string;
  description: string;
  components: string[];
  status: string;
}

interface PageTemplateApprovalProps {
  template: PageTemplate;
  isApproved?: boolean;
  onApproval: (approved: boolean) => void;
}

export function PageTemplateApproval({
  template,
  isApproved,
  onApproval,
}: PageTemplateApprovalProps) {
  const getStatusBadge = () => {
    if (isApproved === true) {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          Approved
        </Badge>
      );
    }
    if (isApproved === false) {
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
          Rejected
        </Badge>
      );
    }
    return <Badge variant="outline">Pending Review</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{template.name}</CardTitle>
            <CardDescription className="mt-1">
              {template.description}
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Components Used:</h4>
            <div className="flex flex-wrap gap-2">
              {template.components.map((comp) => (
                <Badge key={comp} variant="secondary">
                  {comp}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              <Eye className="h-4 w-4" />
              Preview Template
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onApproval(true)}
              className={`gap-2 ${
                isApproved === true
                  ? 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-300'
                  : 'bg-transparent'
              }`}
            >
              <Check className="h-4 w-4" />
              Approve
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onApproval(false)}
              className={`gap-2 ${
                isApproved === false
                  ? 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-300'
                  : 'bg-transparent'
              }`}
            >
              <X className="h-4 w-4" />
              Reject
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
