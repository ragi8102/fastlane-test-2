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
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WizardStepContainer } from '../wizard-step-container';
import { LogStream } from '../log-stream';
import { ChatInterface } from '../chat-interface';
import { useWizardData } from '@/components/wizard-context';
import { Database, Loader2, CheckCircle, Globe, FileText } from 'lucide-react';

export function WizardStep6() {
  const { data, updateData } = useWizardData();
  const [isHarvesting, setIsHarvesting] = useState(false);
  const [isMigrated, setIsMigrated] = useState(!!data.migratedContent);
  const [harvestProgress, setHarvestProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([
    'Ready to launch web harvester...',
  ]);

  const handleLaunchHarvester = async () => {
    setIsHarvesting(true);
    setHarvestProgress(0);

    const harvestSteps = [
      { log: 'Launching web harvester...', progress: 10 },
      { log: 'Connecting to source URLs...', progress: 20 },
      { log: 'Crawling sitemap and discovering pages...', progress: 35 },
      { log: 'Extracting content from pages...', progress: 50 },
      { log: 'Processing images and media files...', progress: 65 },
      { log: 'Mapping content to new structure...', progress: 80 },
      { log: 'Validating migrated content...', progress: 95 },
      { log: 'Content migration completed successfully!', progress: 100 },
    ];

    for (const step of harvestSteps) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setLogs((prev) => [...prev, step.log]);
      setHarvestProgress(step.progress);
    }

    // Mock migrated content data
    const mockMigratedContent = {
      items: [
        {
          id: 'homepage-1',
          name: 'Homepage',
          template: 'Homepage Template',
          fields: {
            title: 'Welcome to Our Site',
            hero: 'Hero content here',
            sections: ['features', 'testimonials'],
          },
        },
        {
          id: 'product-1',
          name: 'Product 1',
          template: 'Product Template',
          fields: {
            name: 'Sample Product',
            description: 'Product description',
            price: 99.99,
            images: ['image1.jpg', 'image2.jpg'],
          },
        },
        {
          id: 'blog-1',
          name: 'Blog Post 1',
          template: 'Blog Post Template',
          fields: {
            title: 'Sample Blog Post',
            content: 'Blog content here',
            author: 'John Doe',
            publishDate: '2024-01-15',
          },
        },
      ],
      totalCount: 47,
    };

    updateData({
      migratedContent: mockMigratedContent,
      contentMigrationLogs: logs,
    });

    setIsMigrated(true);
    setIsHarvesting(false);
  };

  const handleNext = () => {
    // Migrated content is already saved in state
  };

  return (
    <WizardStepContainer
      onNext={handleNext}
      canProceed={isMigrated}
      isLoading={isHarvesting}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Content Migration
              </span>
              <Badge variant={isMigrated ? 'default' : 'secondary'}>
                {isMigrated ? 'Completed' : 'Pending'}
              </Badge>
            </CardTitle>
            <CardDescription>
              Launch web harvester to migrate content from your source sites
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isMigrated && !isHarvesting && (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Ready to launch web harvester and migrate your content
                </p>
                <Button
                  onClick={handleLaunchHarvester}
                  className="gap-2"
                  disabled={!data.pageTemplates}
                >
                  <Globe className="h-4 w-4" />
                  Launch Web Harvester
                </Button>
                {!data.pageTemplates && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Complete page template creation first
                  </p>
                )}
              </div>
            )}

            {isHarvesting && (
              <div className="space-y-4 py-8">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground mb-4">
                    Harvesting content...
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Migration Progress</span>
                    <span className="font-medium">{harvestProgress}%</span>
                  </div>
                  <Progress value={harvestProgress} className="h-3" />
                </div>
              </div>
            )}

            {isMigrated && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="text-sm text-muted-foreground">
                    Content migration completed successfully
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-muted p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-foreground">47</div>
                    <div className="text-sm text-muted-foreground">
                      Pages Migrated
                    </div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-foreground">
                      156
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Images Processed
                    </div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-foreground">23</div>
                    <div className="text-sm text-muted-foreground">
                      Documents
                    </div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-foreground">
                      2.3 GB
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Size
                    </div>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Content Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Homepage</span>
                        <Badge variant="outline">1 page</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Product Pages</span>
                        <Badge variant="outline">24 pages</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Blog Posts</span>
                        <Badge variant="outline">18 pages</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Static Pages</span>
                        <Badge variant="outline">4 pages</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="logs" className="w-full">
          <TabsList>
            <TabsTrigger value="logs">Harvester Logs</TabsTrigger>
            <TabsTrigger value="content">Migrated Content</TabsTrigger>
            <TabsTrigger value="chat">Comments & Review</TabsTrigger>
          </TabsList>

          <TabsContent value="logs">
            <LogStream
              logs={logs}
              isActive={isHarvesting}
              title="Web Harvester Activity"
            />
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Content Migration Summary
                </CardTitle>
                <CardDescription>
                  Overview of migrated content and assets
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isMigrated ? (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">Source Analysis</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Total URLs Processed:</span>
                            <span className="font-medium">47</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Successful Extractions:</span>
                            <span className="font-medium text-green-600">
                              47
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Failed Extractions:</span>
                            <span className="font-medium">0</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-3">Content Mapping</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Mapped to Templates:</span>
                            <span className="font-medium text-green-600">
                              47
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Validation Errors:</span>
                            <span className="font-medium">0</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Manual Review Required:</span>
                            <span className="font-medium">0</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Launch web harvester to view content details
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat">
            <ChatInterface
              title="Content Migration Review"
              placeholder="Add comments or questions about the content migration..."
              disabled={!isMigrated}
            />
          </TabsContent>
        </Tabs>
      </div>
    </WizardStepContainer>
  );
}
