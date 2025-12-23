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
import { ComponentApproval } from '../component-approval';
import { useWizardData } from '@/components/wizard-context';
import { Play, Download, Package, Loader2, CheckCircle } from 'lucide-react';

export function WizardStep4() {
  const { data, updateData } = useWizardData();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(!!data.components);
  const [logs, setLogs] = useState<string[]>([
    'Ready to generate components...',
  ]);

  const mockComponents = [
    {
      id: 'hero-section',
      name: 'Hero Section',
      type: 'Layout Component',
      props: { title: 'string', subtitle: 'string', ctaText: 'string', ctaLink: 'string' },
      description: 'Main hero section with title, subtitle, and CTA button',
      code: 'export function HeroSection({ title, subtitle, ctaText, ctaLink }) { ... }',
      status: 'pending',
    },
    {
      id: 'product-card',
      name: 'Product Card',
      type: 'Content Component',
      props: { product: 'object', showPrice: 'boolean', showDescription: 'boolean' },
      description: 'Reusable product display card with image, title, price',
      code: 'export function ProductCard({ product, showPrice, showDescription }) { ... }',
      status: 'pending',
    },
    {
      id: 'navigation-menu',
      name: 'Navigation Menu',
      type: 'Navigation Component',
      props: { items: 'array', isMobile: 'boolean', onItemClick: 'function' },
      description: 'Responsive navigation with dropdown menus',
      code: 'export function NavigationMenu({ items, isMobile, onItemClick }) { ... }',
      status: 'pending',
    },
    {
      id: 'contact-form',
      name: 'Contact Form',
      type: 'Form Component',
      props: { onSubmit: 'function', fields: 'array', validation: 'object' },
      description: 'Contact form with validation and submission handling',
      code: 'export function ContactForm({ onSubmit, fields, validation }) { ... }',
      status: 'pending',
    },
    {
      id: 'search-bar',
      name: 'Search Bar',
      type: 'Search Integration',
      props: { onSearch: 'function', placeholder: 'string', suggestions: 'array' },
      description: 'Global search with autocomplete and filtering',
      code: 'export function SearchBar({ onSearch, placeholder, suggestions }) { ... }',
      status: 'pending',
    },
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);

    const newLogs = [
      'Starting component generation...',
      'Analyzing requirements and content model...',
      'Generating React components...',
      'Creating form components with validation...',
      'Building search integrations...',
      'Generating component documentation...',
      'Component generation completed successfully!',
    ];

    for (const log of newLogs) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setLogs((prev) => [...prev, log]);
    }

    updateData({
      components: mockComponents,
      componentFiles: [
        'components/hero-section.tsx',
        'components/product-card.tsx',
        'components/navigation-menu.tsx',
        'components/contact-form.tsx',
        'components/search-bar.tsx',
        'component-inventory.json',
      ],
      componentApprovals: {},
    });

    setIsGenerated(true);
    setIsGenerating(false);
  };

  const handleComponentApproval = (componentId: string, approved: boolean) => {
    updateData({
      componentApprovals: {
        ...data.componentApprovals,
        [componentId]: approved,
      },
    });
  };

  const allComponentsReviewed = () => {
    if (!data.components) return false;
    return mockComponents.every(
      (comp) => data.componentApprovals[comp.id] !== undefined
    );
  };

  const handleNext = () => {
    // Components and approvals are already saved in state
  };

  return (
    <WizardStepContainer
      onNext={handleNext}
      canProceed={isGenerated && allComponentsReviewed()}
      isLoading={isGenerating}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Component Generation
              </span>
              <Badge variant={isGenerated ? 'default' : 'secondary'}>
                {isGenerated ? 'Generated' : 'Pending'}
              </Badge>
            </CardTitle>
            <CardDescription>
              Generate React components, forms, and search integrations from
              your requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isGenerated && !isGenerating && (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Ready to generate components from your technical requirements
                </p>
                <Button
                  onClick={handleGenerate}
                  className="gap-2"
                  disabled={!data.requirements}
                >
                  <Play className="h-4 w-4" />
                  Generate Components
                </Button>
                {!data.requirements && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Complete requirements generation first
                  </p>
                )}
              </div>
            )}

            {isGenerating && (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">
                  Generating components...
                </p>
              </div>
            )}

            {isGenerated && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="text-sm text-muted-foreground">
                      {mockComponents.length} components generated successfully
                    </p>
                  </div>
                  <FileDownload
                    files={data.componentFiles}
                    label="Download Components"
                    icon={<Download className="h-4 w-4" />}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Layout Components</h4>
                    <p className="text-sm text-muted-foreground">1 component</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Content Components</h4>
                    <p className="text-sm text-muted-foreground">
                      2 components
                    </p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Form & Search</h4>
                    <p className="text-sm text-muted-foreground">
                      2 components
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="logs" className="w-full">
          <TabsList>
            <TabsTrigger value="logs">Log Stream</TabsTrigger>
            <TabsTrigger value="components">Component Inventory</TabsTrigger>
            <TabsTrigger value="chat">Comments & Review</TabsTrigger>
          </TabsList>

          <TabsContent value="logs">
            <LogStream logs={logs} isActive={isGenerating} />
          </TabsContent>

          <TabsContent value="components">
            <div className="space-y-4">
              {isGenerated ? (
                mockComponents.map((component) => (
                  <ComponentApproval
                    key={component.id}
                    component={component}
                    isApproved={data.componentApprovals[component.id]}
                    onApproval={(approved) =>
                      handleComponentApproval(component.id, approved)
                    }
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">
                      Generate components to view inventory
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="chat">
            <ChatInterface
              title="Component Review"
              placeholder="Add comments or questions about the generated components..."
              disabled={!isGenerated}
            />
          </TabsContent>
        </Tabs>
      </div>
    </WizardStepContainer>
  );
}
