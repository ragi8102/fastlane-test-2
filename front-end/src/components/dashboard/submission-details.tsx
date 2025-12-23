'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Download,
  RefreshCw,
  Play,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Activity,
} from 'lucide-react';
import Link from 'next/link';
import { submissionsStorage, type Submission } from '@/lib/localStorage';

interface SubmissionDetailsProps {
  submissionId: string;
}

export function SubmissionDetails({ submissionId }: SubmissionDetailsProps) {
  const [submission, setSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    const loadedSubmission = submissionsStorage.getById(submissionId);
    setSubmission(loadedSubmission);
  }, [submissionId]);

  if (!submission) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Submission Not Found
            </h1>
            <p className="text-muted-foreground">
              The requested migration could not be found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    {
      name: 'Source & Destination Inputs',
      status: submission.progress > 0 ? 'completed' : 'pending',
      progress: submission.progress > 0 ? 100 : 0,
    },
    {
      name: 'Generate Content Model',
      status:
        submission.progress > 15
          ? 'completed'
          : submission.progress > 0
          ? 'in-progress'
          : 'pending',
      progress: Math.min(
        100,
        Math.max(0, (submission.progress - 0) * (100 / 15))
      ),
    },
    {
      name: 'Requirement Generation',
      status:
        submission.progress > 30
          ? 'completed'
          : submission.progress > 15
          ? 'in-progress'
          : 'pending',
      progress: Math.min(
        100,
        Math.max(0, (submission.progress - 15) * (100 / 15))
      ),
    },
    {
      name: 'Generate Components',
      status:
        submission.progress > 45
          ? 'completed'
          : submission.progress > 30
          ? 'in-progress'
          : 'pending',
      progress: Math.min(
        100,
        Math.max(0, (submission.progress - 30) * (100 / 15))
      ),
    },
    {
      name: 'Create Page Templates',
      status:
        submission.progress > 60
          ? 'completed'
          : submission.progress > 45
          ? 'in-progress'
          : 'pending',
      progress: Math.min(
        100,
        Math.max(0, (submission.progress - 45) * (100 / 15))
      ),
    },
    {
      name: 'Migrate Content',
      status:
        submission.progress > 75
          ? 'completed'
          : submission.progress > 60
          ? 'in-progress'
          : 'pending',
      progress: Math.min(
        100,
        Math.max(0, (submission.progress - 60) * (100 / 15))
      ),
    },
    {
      name: 'Migrate Rules',
      status:
        submission.progress > 85
          ? 'completed'
          : submission.progress > 75
          ? 'in-progress'
          : 'pending',
      progress: Math.min(
        100,
        Math.max(0, (submission.progress - 75) * (100 / 10))
      ),
    },
    {
      name: 'Generate Documentation',
      status:
        submission.progress > 95
          ? 'completed'
          : submission.progress > 85
          ? 'in-progress'
          : 'pending',
      progress: Math.min(
        100,
        Math.max(0, (submission.progress - 85) * (100 / 10))
      ),
    },
    {
      name: 'Deploy',
      status:
        submission.progress === 100
          ? 'completed'
          : submission.progress > 95
          ? 'in-progress'
          : 'pending',
      progress: Math.min(
        100,
        Math.max(0, (submission.progress - 95) * (100 / 5))
      ),
    },
  ];

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return (
          <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {submission.name}
          </h1>
          <p className="text-muted-foreground">Migration Details</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Migration Progress
                <Badge
                  className={
                    submission.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : submission.status === 'in-progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-800'
                  }
                >
                  {submission.status.replace('-', ' ')}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span className="font-medium">{submission.progress}%</span>
                </div>
                <Progress value={submission.progress} className="h-3" />
              </div>

              <div className="space-y-3">
                {steps.map((step) => (
                  <div
                    key={step.name}
                    className="flex items-center gap-3 p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {getStepIcon(step.status)}
                      <span className="text-sm font-medium truncate">
                        {step.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {step.progress}%
                      </span>
                      <div className="w-16">
                        <Progress value={step.progress} className="h-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="logs" className="w-full">
            <TabsList>
              <TabsTrigger value="logs">Activity Logs</TabsTrigger>
              <TabsTrigger value="files">Generated Files</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="logs" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                      <div className="h-2 w-2 bg-blue-600 rounded-full mt-2" />
                      <div>
                        <p className="font-medium">
                          Component generation in progress
                        </p>
                        <p className="text-muted-foreground">
                          Processing React components - 65% complete
                        </p>
                        <p className="text-xs text-muted-foreground">
                          2 minutes ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                      <div className="h-2 w-2 bg-green-600 rounded-full mt-2" />
                      <div>
                        <p className="font-medium">
                          Requirements generated successfully
                        </p>
                        <p className="text-muted-foreground">
                          Generated 24 requirements from content model
                        </p>
                        <p className="text-xs text-muted-foreground">
                          15 minutes ago
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="files">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Generated Files
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between p-2 hover:bg-muted rounded">
                      <span>content-model.json</span>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-muted rounded">
                      <span>requirements.md</span>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Migration Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Source URL</label>
                    <p className="text-sm text-muted-foreground">
                      {submission.sourceUrl}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Target URL</label>
                    <p className="text-sm text-muted-foreground">
                      {submission.targetUrl}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full gap-2">
                <Play className="h-4 w-4" />
                Continue Migration
              </Button>
              <Button variant="outline" className="w-full gap-2 bg-transparent">
                <RefreshCw className="h-4 w-4" />
                Restart Step
              </Button>
              <Button variant="outline" className="w-full gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Download Report
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Migration Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">Created:</span>
                <p className="font-medium">
                  {new Date(submission.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Last Updated:</span>
                <p className="font-medium">
                  {new Date(submission.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Current Step:</span>
                <p className="font-medium">{submission.currentStep}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
