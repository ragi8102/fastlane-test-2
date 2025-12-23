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
import { PageTemplateApproval } from '../page-template-approval';
import { useWizardData } from '@/components/wizard-context';
import { Play, Download, Layout, Loader2, CheckCircle } from 'lucide-react';

export function WizardStep5() {
  const { data, updateData } = useWizardData();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(!!data.pageTemplates);
  const [logs, setLogs] = useState<string[]>([
    'Ready to create page templates...',
  ]);

  const mockPageTemplates = [
    {
      id: 'homepage',
      name: 'Homepage Template',
      description: 'Main landing page with hero, features, and CTA sections',
      components: ['Hero Section', 'Navigation Menu', 'Product Card'],
      layout: 'full-width',
      status: 'pending',
    },
    {
      id: 'product-listing',
      name: 'Product Listing Template',
      description: 'Product catalog page with filtering and search',
      components: ['Navigation Menu', 'Search Bar', 'Product Card'],
      layout: 'sidebar',
      status: 'pending',
    },
    {
      id: 'contact-page',
      name: 'Contact Page Template',
      description: 'Contact page with form and company information',
      components: ['Navigation Menu', 'Contact Form'],
      layout: 'centered',
      status: 'pending',
    },
    {
      id: 'blog-post',
      name: 'Blog Post Template',
      description: 'Individual blog post layout with content and sidebar',
      components: ['Navigation Menu', 'Content Block', 'Sidebar'],
      layout: 'two-column',
      status: 'pending',
    },
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);

    const newLogs = [
      'Starting page template assembly...',
      'Analyzing component inventory...',
      'Creating page layouts and compositions...',
      'Assembling components into templates...',
      'Generating responsive layouts...',
      'Creating template documentation...',
      'Page template assembly completed successfully!',
    ];

    for (const log of newLogs) {
      await new Promise((resolve) => setTimeout(resolve, 1400));
      setLogs((prev) => [...prev, log]);
    }

    updateData({
      pageTemplates: mockPageTemplates,
      pageTemplateFiles: [
        'templates/homepage.tsx',
        'templates/product-listing.tsx',
        'templates/contact-page.tsx',
        'templates/blog-post.tsx',
        'page-templates.json',
      ],
      pageApprovals: {},
    });

    setIsGenerated(true);
    setIsGenerating(false);
  };

  const handlePageApproval = (pageId: string, approved: boolean) => {
    updateData({
      pageApprovals: {
        ...data.pageApprovals,
        [pageId]: approved,
      },
    });
  };

  const allPagesReviewed = () => {
    if (!data.pageTemplates) return false;
    return mockPageTemplates.every(
      (page) => data.pageApprovals[page.id] !== undefined
    );
  };

  const handleNext = () => {
    // Page templates and approvals are already saved in state
  };

  return (
    <WizardStepContainer
      onNext={handleNext}
      canProceed={isGenerated && allPagesReviewed()}
      isLoading={isGenerating}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Layout className="h-5 w-5 text-primary" />
                Page Template Assembly
              </span>
              <Badge variant={isGenerated ? 'default' : 'secondary'}>
                {isGenerated ? 'Generated' : 'Pending'}
              </Badge>
            </CardTitle>
            <CardDescription>
              Assemble components into complete page templates and layouts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isGenerated && !isGenerating && (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Ready to assemble page templates from your components
                </p>
                <Button
                  onClick={handleGenerate}
                  className="gap-2"
                  disabled={!data.components}
                >
                  <Play className="h-4 w-4" />
                  Create Page Templates
                </Button>
                {!data.components && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Complete component generation first
                  </p>
                )}
              </div>
            )}

            {isGenerating && (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">
                  Assembling page templates...
                </p>
              </div>
            )}

            {isGenerated && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="text-sm text-muted-foreground">
                      {mockPageTemplates.length} page templates created
                      successfully
                    </p>
                  </div>
                  <FileDownload
                    files={data.pageTemplateFiles}
                    label="Download Templates"
                    icon={<Download className="h-4 w-4" />}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Marketing Pages</h4>
                    <p className="text-sm text-muted-foreground">2 templates</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Content Pages</h4>
                    <p className="text-sm text-muted-foreground">2 templates</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="logs" className="w-full">
          <TabsList>
            <TabsTrigger value="logs">Log Stream</TabsTrigger>
            <TabsTrigger value="templates">Page Templates</TabsTrigger>
            <TabsTrigger value="chat">Comments & Review</TabsTrigger>
          </TabsList>

          <TabsContent value="logs">
            <LogStream logs={logs} isActive={isGenerating} />
          </TabsContent>

          <TabsContent value="templates">
            <div className="space-y-4">
              {isGenerated ? (
                mockPageTemplates.map((template) => (
                  <PageTemplateApproval
                    key={template.id}
                    template={template}
                    isApproved={data.pageApprovals[template.id]}
                    onApproval={(approved) =>
                      handlePageApproval(template.id, approved)
                    }
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">
                      Create page templates to view details
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="chat">
            <ChatInterface
              title="Page Template Review"
              placeholder="Add comments or questions about the page templates..."
              disabled={!isGenerated}
            />
          </TabsContent>
        </Tabs>
      </div>
    </WizardStepContainer>
  );
}
