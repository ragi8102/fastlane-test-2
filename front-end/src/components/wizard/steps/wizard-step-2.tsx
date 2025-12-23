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
import { Play, Download, FileText, Loader2 } from 'lucide-react';

export function WizardStep2() {
  const { data, updateData } = useWizardData();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(!!data.contentModel);
  const [logs, setLogs] = useState<string[]>([
    'Initializing content model generation...',
    'Analyzing sitemap structure...',
    'Identifying content types and patterns...',
  ]);

  const handleGenerate = async () => {
    setIsGenerating(true);

    // Simulate content model generation
    const newLogs = [
      'Starting content model analysis...',
      'Processing sitemap URLs...',
      'Extracting page templates and content types...',
      'Analyzing content relationships...',
      'Generating content model schema...',
      'Content model generation completed successfully!',
    ];

    for (const log of newLogs) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLogs((prev) => [...prev, log]);
    }

    // Mock content model data
    const mockContentModel = {
      templates: [
        {
          name: 'HomePage',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'hero', type: 'richText', required: false },
            { name: 'sections', type: 'component', required: false },
          ],
        },
        {
          name: 'ProductPage',
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'description', type: 'richText', required: false },
            { name: 'price', type: 'number', required: true },
            { name: 'images', type: 'image', required: false },
          ],
        },
        {
          name: 'BlogPost',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'content', type: 'richText', required: true },
            { name: 'author', type: 'reference', required: true },
            { name: 'publishDate', type: 'date', required: false },
          ],
        },
      ],
      contentTypes: [
        { name: 'HomePage', description: 'Homepage template', fields: ['title', 'hero', 'sections'] },
        {
          name: 'ProductPage',
          description: 'Product page template',
          fields: ['name', 'description', 'price', 'images'],
        },
        {
          name: 'BlogPost',
          description: 'Blog post template',
          fields: ['title', 'content', 'author', 'publishDate'],
        },
      ],
    };

    updateData({
      contentModel: mockContentModel,
      contentModelFiles: ['content-model.json', 'content-types.schema.json'],
    });

    setIsGenerated(true);
    setIsGenerating(false);
  };

  const handleNext = () => {
    // Content model is already saved in state
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
                Content Model Generation
              </span>
              <Badge variant={isGenerated ? 'default' : 'secondary'}>
                {isGenerated ? 'Generated' : 'Pending'}
              </Badge>
            </CardTitle>
            <CardDescription>
              AI-powered analysis of your site structure to create a
              comprehensive content model
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isGenerated && !isGenerating && (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Ready to analyze your site structure and generate content
                  model
                </p>
                <Button onClick={handleGenerate} className="gap-2">
                  <Play className="h-4 w-4" />
                  Generate Content Model
                </Button>
              </div>
            )}

            {isGenerating && (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">
                  Generating content model...
                </p>
              </div>
            )}

            {isGenerated && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Content model generated successfully
                  </p>
                  <div className="flex gap-2">
                    <FileDownload
                      files={data.contentModelFiles}
                      label="Download Content Model"
                      icon={<Download className="h-4 w-4" />}
                    />
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Generated Content Types:</h4>
                  <div className="space-y-1 text-sm">
                    <div>• HomePage (3 fields)</div>
                    <div>• ProductPage (4 fields)</div>
                    <div>• BlogPost (4 fields)</div>
                    <div>• Author (3 fields)</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="logs" className="w-full">
          <TabsList>
            <TabsTrigger value="logs">Log Stream</TabsTrigger>
            <TabsTrigger value="model">Content Model</TabsTrigger>
            <TabsTrigger value="chat">Comments & Review</TabsTrigger>
          </TabsList>

          <TabsContent value="logs">
            <LogStream logs={logs} isActive={isGenerating} />
          </TabsContent>

          <TabsContent value="model">
            <Card>
              <CardHeader>
                <CardTitle>Generated Content Model</CardTitle>
                <CardDescription>
                  Review the extracted content structure
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isGenerated ? (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Content Types</h4>
                        <div className="space-y-2 text-sm">
                          <div className="p-2 bg-muted rounded">HomePage</div>
                          <div className="p-2 bg-muted rounded">
                            ProductPage
                          </div>
                          <div className="p-2 bg-muted rounded">BlogPost</div>
                          <div className="p-2 bg-muted rounded">Author</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Relationships</h4>
                        <div className="space-y-2 text-sm">
                          <div className="p-2 bg-muted rounded">
                            HomePage → ProductPage
                          </div>
                          <div className="p-2 bg-muted rounded">
                            BlogPost → Author
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Generate content model to view details
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat">
            <ChatInterface
              title="Content Model Review"
              placeholder="Add comments or questions about the generated content model..."
              disabled={!isGenerated}
            />
          </TabsContent>
        </Tabs>
      </div>
    </WizardStepContainer>
  );
}
