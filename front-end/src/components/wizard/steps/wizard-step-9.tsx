'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WizardStepContainer } from '../wizard-step-container';
import { LogStream } from '../log-stream';
import { ChatInterface } from '../chat-interface';
import { useWizardData, useWizard } from '@/components/wizard-context';
import { wizardStorage } from '@/lib/localStorage';
import {
  Play,
  ExternalLink,
  Rocket,
  Loader2,
  CheckCircle,
  Globe,
  Settings,
} from 'lucide-react';
import Link from 'next/link';

export function WizardStep9() {
  const { data, updateData } = useWizardData();
  const { dispatch } = useWizard();
  const [isDeploying, setIsDeploying] = useState(false);
  const [isDeployed, setIsDeployed] = useState(!!data.deploymentUrl);
  const [logs, setLogs] = useState<string[]>(['Ready to deploy to Vercel...']);

  const mockDeploymentUrl = 'https://migrated-site-abc123.vercel.app';
  const mockEnvVars = {
    NEXT_PUBLIC_API_URL: 'https://api.migrated-site.com',
    DATABASE_URL: 'postgresql://...',
    NEXTAUTH_SECRET: 'generated-secret-key',
    NEXTAUTH_URL: mockDeploymentUrl,
  };

  const handleDeploy = async () => {
    setIsDeploying(true);

    const deploymentSteps = [
      'Initializing Vercel deployment...',
      'Generating environment variables...',
      'Building Next.js application...',
      'Optimizing assets and components...',
      'Configuring domain and SSL...',
      'Running deployment tests...',
      'Finalizing deployment configuration...',
      'Deployment completed successfully!',
      `Site is now live at ${mockDeploymentUrl}`,
    ];

    for (const step of deploymentSteps) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setLogs((prev) => [...prev, step]);
    }

    updateData({
      deploymentUrl: mockDeploymentUrl,
      deploymentLogs: logs,
      vercelEnvVars: mockEnvVars,
    });

    setIsDeployed(true);
    setIsDeploying(false);
  };

  const handleComplete = () => {
    try {
      // Reset the wizard context first
      dispatch({ type: 'RESET_WIZARD' });

      // Clear localStorage
      wizardStorage.clear();

      // Also try the more aggressive clear method as fallback
      setTimeout(() => {
        wizardStorage.clearAll();
      }, 100);

      console.log('Wizard completed and localStorage cleared');

      // Migration is complete - redirect to dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error during wizard completion:', error);
      // Still redirect even if clearing fails
      window.location.href = '/dashboard';
    }
  };

  return (
    <WizardStepContainer
      onNext={handleComplete}
      canProceed={isDeployed}
      isLoading={isDeploying}
      nextLabel="Complete Migration"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-primary" />
                Deploy to Vercel
              </span>
              <Badge variant={isDeployed ? 'default' : 'secondary'}>
                {isDeployed ? 'Deployed' : 'Pending'}
              </Badge>
            </CardTitle>
            <CardDescription>
              Deploy your migrated site to Vercel with automatic environment
              configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isDeployed && !isDeploying && (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Ready to deploy your migrated site to Vercel
                </p>
                <Button
                  onClick={handleDeploy}
                  className="gap-2"
                  disabled={!data.documentation}
                >
                  <Play className="h-4 w-4" />
                  Deploy to Vercel
                </Button>
                {!data.documentation && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Complete documentation generation first
                  </p>
                )}
              </div>
            )}

            {isDeploying && (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Deploying to Vercel...</p>
              </div>
            )}

            {isDeployed && (
              <div className="space-y-6">
                <div className="text-center py-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">
                    Migration Completed Successfully!
                  </h3>
                  <p className="text-green-700 dark:text-green-400 mb-4">
                    Your site has been successfully migrated and deployed to
                    Vercel
                  </p>
                  <Button asChild className="gap-2">
                    <Link href={mockDeploymentUrl} target="_blank">
                      <Globe className="h-4 w-4" />
                      View Live Site
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Globe className="h-5 w-5 text-primary" />
                        Deployment Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Live URL:</label>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-sm bg-muted px-2 py-1 rounded flex-1">
                            {mockDeploymentUrl}
                          </code>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={mockDeploymentUrl} target="_blank">
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Status:</label>
                        <p className="text-sm text-green-600 mt-1">
                          ✓ Active and running
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          SSL Certificate:
                        </label>
                        <p className="text-sm text-green-600 mt-1">
                          ✓ Automatically configured
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Settings className="h-5 w-5 text-primary" />
                        Environment Variables
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        {Object.entries(mockEnvVars).map(([key]) => (
                          <div
                            key={key}
                            className="flex justify-between items-center p-2 bg-muted rounded"
                          >
                            <span className="font-mono text-xs">{key}</span>
                            <span className="text-xs text-muted-foreground">
                              ✓ Configured
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="logs" className="w-full">
          <TabsList>
            <TabsTrigger value="logs">Deployment Logs</TabsTrigger>
            <TabsTrigger value="summary">Migration Summary</TabsTrigger>
            <TabsTrigger value="chat">Final Comments</TabsTrigger>
          </TabsList>

          <TabsContent value="logs">
            <LogStream
              logs={logs}
              isActive={isDeploying}
              title="Vercel Deployment"
            />
          </TabsContent>

          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle>Migration Summary</CardTitle>
                <CardDescription>
                  Complete overview of your migration process
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isDeployed ? (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-foreground">
                          47
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Pages Migrated
                        </div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-foreground">
                          5
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Components Created
                        </div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-foreground">
                          4
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Page Templates
                        </div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-foreground">
                          5
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Rules Migrated
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Migration Timeline</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>✓ Source & Destination Configuration</span>
                          <span className="text-muted-foreground">
                            Completed
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>✓ Content Model Generation</span>
                          <span className="text-muted-foreground">
                            Completed
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>✓ Requirements Generation</span>
                          <span className="text-muted-foreground">
                            Completed
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>✓ Component Generation</span>
                          <span className="text-muted-foreground">
                            Completed
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>✓ Page Template Assembly</span>
                          <span className="text-muted-foreground">
                            Completed
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>✓ Content Migration</span>
                          <span className="text-muted-foreground">
                            Completed
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>✓ Rule Migration</span>
                          <span className="text-muted-foreground">
                            Completed
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>✓ Documentation Generation</span>
                          <span className="text-muted-foreground">
                            Completed
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>✓ Vercel Deployment</span>
                          <span className="text-green-600">Live</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Complete deployment to view migration summary
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat">
            <ChatInterface
              title="Migration Complete"
              placeholder="Add final comments about the migration process..."
              disabled={!isDeployed}
            />
          </TabsContent>
        </Tabs>
      </div>
    </WizardStepContainer>
  );
}
