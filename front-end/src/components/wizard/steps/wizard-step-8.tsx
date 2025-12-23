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

export function WizardStep8() {
  const { data, updateData } = useWizardData();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(!!data.documentation);
  const [logs, setLogs] = useState<string[]>([
    'Ready to generate documentation...',
  ]);

  const mockDocumentationFiles = [
    'README.md',
    'DEPLOYMENT.md',
    'API_DOCUMENTATION.md',
    'COMPONENT_GUIDE.md',
    'MIGRATION_REPORT.md',
    'TROUBLESHOOTING.md',
  ];

  const handleGenerateDocumentation = async () => {
    setIsGenerating(true);

    const documentationSteps = [
      'Starting documentation generation...',
      'Analyzing project structure...',
      'Generating README.md with project overview...',
      'Creating API documentation...',
      'Documenting component library...',
      'Generating deployment guide...',
      'Creating migration report...',
      'Adding troubleshooting guide...',
      'Finalizing documentation structure...',
      'Documentation generation completed successfully!',
    ];

    for (const step of documentationSteps) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setLogs((prev) => [...prev, step]);
    }

    const mockDocumentation = {
      readme:
        '# Migration Project\n\nThis project contains the migrated content and components from the legacy system.\n\n## Overview\n\n- **Source**: Legacy CMS\n- **Target**: Next.js 14 with App Router\n- **Migration Date**: 2024-01-15\n- **Total Items**: 47 pages, 156 images, 23 documents\n\n## Architecture\n\n- Next.js 14 with App Router\n- TypeScript for type safety\n- Tailwind CSS for styling\n- Headless CMS integration',
      apiDocs:
        '# API Documentation\n\n## Endpoints\n\n### GET /api/products\nReturns a list of products with filtering and pagination.\n\n### GET /api/blog/posts\nReturns blog posts with author and category information.\n\n### POST /api/auth/login\nHandles user authentication.\n\n### GET /api/sitemap.xml\nGenerates dynamic sitemap for SEO.',
      deploymentGuide:
        '# Deployment Guide\n\n## Prerequisites\n\n- Node.js 18+\n- npm or yarn\n- Vercel account (for deployment)\n\n## Local Development\n\n1. Clone the repository\n2. Install dependencies: `npm install`\n3. Set up environment variables\n4. Run development server: `npm run dev`\n\n## Production Deployment\n\n1. Build the project: `npm run build`\n2. Deploy to Vercel: `vercel deploy`\n3. Configure environment variables in Vercel dashboard',
      troubleshooting:
        '# Troubleshooting Guide\n\n## Common Issues\n\n### Build Errors\n- Ensure all dependencies are installed\n- Check TypeScript configuration\n- Verify environment variables\n\n### Runtime Errors\n- Check browser console for errors\n- Verify API endpoints are accessible\n- Check network connectivity\n\n### Performance Issues\n- Enable image optimization\n- Check bundle size\n- Monitor Core Web Vitals',
    };

    updateData({
      documentation: mockDocumentation,
      readmeFiles: mockDocumentationFiles,
    });

    setIsGenerated(true);
    setIsGenerating(false);
  };

  const handleNext = () => {
    // Documentation is already saved in state
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
                Generate Documentation
              </span>
              <Badge variant={isGenerated ? 'default' : 'secondary'}>
                {isGenerated ? 'Generated' : 'Pending'}
              </Badge>
            </CardTitle>
            <CardDescription>
              Generate comprehensive documentation including README files and
              technical guides
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isGenerated && !isGenerating && (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Ready to generate comprehensive project documentation
                </p>
                <Button
                  onClick={handleGenerateDocumentation}
                  className="gap-2"
                  disabled={!data.migratedRules}
                >
                  <Play className="h-4 w-4" />
                  Generate Documentation
                </Button>
                {!data.migratedRules && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Complete rule migration first
                  </p>
                )}
              </div>
            )}

            {isGenerating && (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">
                  Generating documentation...
                </p>
              </div>
            )}

            {isGenerated && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="text-sm text-muted-foreground">
                      {mockDocumentationFiles.length} documentation files
                      generated
                    </p>
                  </div>
                  <FileDownload
                    files={mockDocumentationFiles}
                    label="Download Documentation"
                    icon={<Download className="h-4 w-4" />}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Generated Files</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {mockDocumentationFiles.map((file) => (
                          <div
                            key={file}
                            className="flex items-center gap-2 p-2 bg-muted rounded"
                          >
                            <FileText className="h-4 w-4 text-primary" />
                            <span className="text-sm font-mono">{file}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Documentation Sections
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm">
                            Project Overview
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            Architecture and setup guide
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">
                            API Documentation
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            Endpoints and usage examples
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">
                            Component Library
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            Component usage and props
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">
                            Deployment Guide
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            Configuration and deployment
                          </p>
                        </div>
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
            <TabsTrigger value="logs">Generation Logs</TabsTrigger>
            <TabsTrigger value="files">Documentation Files</TabsTrigger>
            <TabsTrigger value="chat">Comments & Review</TabsTrigger>
          </TabsList>

          <TabsContent value="logs">
            <LogStream
              logs={logs}
              isActive={isGenerating}
              title="Documentation Generation"
            />
          </TabsContent>

          <TabsContent value="files">
            <Card>
              <CardHeader>
                <CardTitle>Generated Documentation</CardTitle>
                <CardDescription>
                  Overview of created documentation files
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isGenerated ? (
                  <div className="space-y-4">
                    <div className="grid gap-3">
                      {mockDocumentationFiles.map((file) => (
                        <div
                          key={file}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium text-sm">{file}</p>
                              <p className="text-xs text-muted-foreground">
                                {file === 'README.md' &&
                                  'Main project documentation'}
                                {file === 'API_DOCUMENTATION.md' &&
                                  'API endpoints and examples'}
                                {file === 'COMPONENT_GUIDE.md' &&
                                  'Component usage guide'}
                                {file === 'DEPLOYMENT.md' &&
                                  'Deployment instructions'}
                                {file === 'MIGRATION_REPORT.md' &&
                                  'Migration summary report'}
                                {file === 'TROUBLESHOOTING.md' &&
                                  'Common issues and solutions'}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Generate documentation to view files
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat">
            <ChatInterface
              title="Documentation Review"
              placeholder="Add comments or questions about the generated documentation..."
              disabled={!isGenerated}
            />
          </TabsContent>
        </Tabs>
      </div>
    </WizardStepContainer>
  );
}
