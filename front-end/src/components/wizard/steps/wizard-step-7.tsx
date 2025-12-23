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
import { RuleMappingDisplay } from '../rule-mapping-display';
import { useWizardData } from '@/components/wizard-context';
import { Play, Download, Settings, Loader2, CheckCircle } from 'lucide-react';

export function WizardStep7() {
  const { data, updateData } = useWizardData();
  const [isMigrating, setIsMigrating] = useState(false);
  const [isMigrated, setIsMigrated] = useState(!!data.migratedRules);
  const [logs, setLogs] = useState<string[]>([
    'Ready to migrate business rules...',
  ]);

  const mockRuleMappings = [
    {
      id: 'redirect-rules',
      oldRule: '/old-product-page/*',
      newRule: '/products/*',
      type: 'URL Redirect',
      status: 'mapped',
    },
    {
      id: 'auth-rules',
      oldRule: 'Admin Access Control',
      newRule: 'Role-based Authentication',
      type: 'Security Rule',
      status: 'mapped',
    },
    {
      id: 'cache-rules',
      oldRule: 'Static Content Caching',
      newRule: 'Edge Caching Strategy',
      type: 'Performance Rule',
      status: 'mapped',
    },
    {
      id: 'validation-rules',
      oldRule: 'Form Validation Logic',
      newRule: 'Client-side Validation',
      type: 'Business Logic',
      status: 'mapped',
    },
    {
      id: 'seo-rules',
      oldRule: 'Meta Tag Generation',
      newRule: 'Dynamic SEO Metadata',
      type: 'SEO Rule',
      status: 'mapped',
    },
  ];

  const handleMigrateRules = async () => {
    setIsMigrating(true);

    const migrationSteps = [
      'Starting rule migration process...',
      'Analyzing existing business rules...',
      'Identifying rule dependencies...',
      'Mapping old rules to new architecture...',
      'Generating rule migration scripts...',
      'Validating rule mappings...',
      'Creating rule documentation...',
      'Rule migration completed successfully!',
    ];

    for (const step of migrationSteps) {
      await new Promise((resolve) => setTimeout(resolve, 1800));
      setLogs((prev) => [...prev, step]);
    }

    updateData({
      migratedRules: {
        rules: [
          {
            name: 'User Authentication Rule',
            condition: 'user.isAuthenticated',
            action: 'redirect to login page',
          },
          {
            name: 'Product Visibility Rule',
            condition: 'product.isPublished && product.isVisible',
            action: 'show product in catalog',
          },
          {
            name: 'Content Access Rule',
            condition: 'user.hasPermission(content.permission)',
            action: 'allow content access',
          },
        ],
      },
      ruleMappings: {
        mappings: [
          {
            source: '/old-product-page/*',
            target: '/products/*',
            transformation: 'URL redirect mapping',
          },
          {
            source: 'Admin Access Control',
            target: 'Role-based Authentication',
            transformation: 'Security rule conversion',
          },
          {
            source: 'Static Content Caching',
            target: 'Edge Caching Strategy',
            transformation: 'Performance optimization',
          },
          {
            source: 'Form Validation Logic',
            target: 'Client-side Validation',
            transformation: 'Business logic migration',
          },
          {
            source: 'Meta Tag Generation',
            target: 'Dynamic SEO Metadata',
            transformation: 'SEO rule enhancement',
          },
        ],
      },
    });

    setIsMigrated(true);
    setIsMigrating(false);
  };

  const handleNext = () => {
    // Rules are already saved in state
  };

  return (
    <WizardStepContainer
      onNext={handleNext}
      canProceed={isMigrated}
      isLoading={isMigrating}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Rule Migration
              </span>
              <Badge variant={isMigrated ? 'default' : 'secondary'}>
                {isMigrated ? 'Completed' : 'Pending'}
              </Badge>
            </CardTitle>
            <CardDescription>
              Migrate business rules and create rule mappings for the new
              architecture
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isMigrated && !isMigrating && (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Ready to migrate business rules and create rule mappings
                </p>
                <Button
                  onClick={handleMigrateRules}
                  className="gap-2"
                  disabled={!data.migratedContent}
                >
                  <Play className="h-4 w-4" />
                  Migrate Rules
                </Button>
                {!data.migratedContent && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Complete content migration first
                  </p>
                )}
              </div>
            )}

            {isMigrating && (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">
                  Migrating business rules...
                </p>
              </div>
            )}

            {isMigrated && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="text-sm text-muted-foreground">
                      {mockRuleMappings.length} rules migrated successfully
                    </p>
                  </div>
                  <FileDownload
                    files={[
                      'rule-mappings.json',
                      'migration-rules.md',
                      'validation-report.txt',
                    ]}
                    label="Download Rule Mappings"
                    icon={<Download className="h-4 w-4" />}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-muted p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {mockRuleMappings.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Rules
                    </div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {mockRuleMappings.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Successfully Mapped
                    </div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-foreground">0</div>
                    <div className="text-sm text-muted-foreground">
                      Failed Mappings
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="logs" className="w-full">
          <TabsList>
            <TabsTrigger value="logs">Migration Logs</TabsTrigger>
            <TabsTrigger value="mappings">Rule Mappings</TabsTrigger>
            <TabsTrigger value="chat">Comments & Review</TabsTrigger>
          </TabsList>

          <TabsContent value="logs">
            <LogStream
              logs={logs}
              isActive={isMigrating}
              title="Rule Migration Activity"
            />
          </TabsContent>

          <TabsContent value="mappings">
            {isMigrated ? (
              <RuleMappingDisplay mappings={mockRuleMappings} />
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    Migrate rules to view mappings
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="chat">
            <ChatInterface
              title="Rule Migration Review"
              placeholder="Add comments or questions about the rule migration..."
              disabled={!isMigrated}
            />
          </TabsContent>
        </Tabs>
      </div>
    </WizardStepContainer>
  );
}
