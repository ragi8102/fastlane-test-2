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
import { FileDownload } from '../file-download';
import { useWizardData } from '@/components/wizard-context';
import { Play, Download, FileText, Loader2, CheckCircle } from 'lucide-react';

export function WizardStep3() {
  const { data, updateData } = useWizardData();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(!!data.requirements);
  const [logs, setLogs] = useState<string[]>([
    'Ready to generate technical requirements...',
  ]);

  const handleGenerate = async () => {
    setIsGenerating(true);

    // Simulate requirements generation
    const newLogs = [
      'Starting requirements generation...',
      'Analyzing content model structure...',
      'Identifying technical requirements...',
      'Generating component specifications...',
      'Creating API requirements...',
      'Defining data migration requirements...',
      'Requirements generation completed successfully!',
    ];

    for (const log of newLogs) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setLogs((prev) => [...prev, log]);
    }

    // Mock requirements data
    const mockRequirements = {
      functional: [
        'Implement responsive homepage with hero section',
        'Create product catalog with filtering and search',
        'Build blog system with author management',
        'Implement user authentication and authorization',
      ],
      technical: [
        'Next.js 14+ with App Router',
        'TypeScript for type safety',
        'Tailwind CSS for styling',
        'Headless CMS integration',
        'SEO optimization with metadata',
      ],
      performance: [
        'Page load time under 2 seconds',
        'Lighthouse score above 90',
        'Image optimization and lazy loading',
        'Code splitting and dynamic imports',
      ],
      security: [
        'HTTPS enforcement',
        'Input validation and sanitization',
        'CSRF protection',
        'Rate limiting on API endpoints',
      ],
    };

    updateData({
      requirements: mockRequirements,
      requirementsFiles: [
        'requirements.md',
        'technical-specs.json',
        'api-documentation.md',
      ],
    });

    setIsGenerated(true);
    setIsGenerating(false);
  };

  const handleNext = () => {
    // Requirements are already saved in state
  };

  return (
    <WizardStepContainer
      onNext={handleNext}
      canProceed={isGenerated}
      isLoading={isGenerating}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Requirements Generation
              </span>
              <Badge variant={isGenerated ? 'default' : 'secondary'}>
                {isGenerated ? 'Generated' : 'Pending'}
              </Badge>
            </CardTitle>
            <CardDescription>
              Generate comprehensive technical requirements from your content
              model
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isGenerated && !isGenerating && (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Ready to generate technical requirements from your content
                  model
                </p>
                <Button
                  onClick={handleGenerate}
                  className="gap-2"
                  disabled={!data.contentModel}
                >
                  <Play className="h-4 w-4" />
                  Generate Requirements
                </Button>
                {!data.contentModel && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Complete content model generation first
                  </p>
                )}
              </div>
            )}

            {isGenerating && (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">
                  Generating technical requirements...
                </p>
              </div>
            )}

            {isGenerated && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="text-sm text-muted-foreground">
                      Requirements generated successfully
                    </p>
                  </div>
                  <FileDownload
                    files={data.requirementsFiles}
                    label="Download Requirements"
                    icon={<Download className="h-4 w-4" />}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">
                      Functional Requirements
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      4 requirements
                    </p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Technical Requirements</h4>
                    <p className="text-sm text-muted-foreground">
                      5 requirements
                    </p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">API Requirements</h4>
                    <p className="text-sm text-muted-foreground">4 endpoints</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="logs" className="w-full">
          <TabsList>
            <TabsTrigger value="logs">Log Stream</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="chat">Comments & Review</TabsTrigger>
          </TabsList>

          <TabsContent value="logs">
            <LogStream logs={logs} isActive={isGenerating} />
          </TabsContent>

          <TabsContent value="requirements">
            <Card>
              <CardHeader>
                <CardTitle>Generated Requirements</CardTitle>
                <CardDescription>
                  Review the technical specifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isGenerated ? (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">
                        Functional Requirements
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span>
                            Implement responsive homepage with hero section
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span>
                            Create product catalog with filtering and search
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span>Build blog system with author management</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span>
                            Implement user authentication and authorization
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">
                        Technical Requirements
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                          <span>Next.js 14+ with App Router</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                          <span>TypeScript for type safety</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                          <span>Tailwind CSS for styling</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                          <span>Headless CMS integration</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                          <span>SEO optimization with metadata</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">API Requirements</h4>
                      <div className="space-y-2 text-sm font-mono">
                        <div className="p-2 bg-muted rounded">
                          GET /api/products
                        </div>
                        <div className="p-2 bg-muted rounded">
                          GET /api/blog/posts
                        </div>
                        <div className="p-2 bg-muted rounded">
                          POST /api/auth/login
                        </div>
                        <div className="p-2 bg-muted rounded">
                          GET /api/sitemap.xml
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Generate requirements to view details
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat">
            <ChatInterface
              title="Requirements Review"
              placeholder="Add comments or questions about the generated requirements..."
              disabled={!isGenerated}
            />
          </TabsContent>
        </Tabs>
      </div>
    </WizardStepContainer>
  );
}
