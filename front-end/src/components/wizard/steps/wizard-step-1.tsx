'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { WizardStepContainer } from '../wizard-step-container';
import { useWizardData } from '@/components/wizard-context';
import { Plus, Trash2, Globe, Database, Code, Settings } from 'lucide-react';

export function WizardStep1() {
  const { data, updateData } = useWizardData();
  const [sourceUrls, setSourceUrls] = useState<string[]>(
    data.sourceUrls.length > 0 ? data.sourceUrls : ['']
  );
  const [currentSitecoreUrl, setCurrentSitecoreUrl] = useState(
    data.currentSitecoreUrl
  );
  const [codeRepositoryUrl, setCodeRepositoryUrl] = useState(
    data.codeRepositoryUrl
  );
  const [xmcUrl, setXmcUrl] = useState(data.xmcUrl);
  const [skipHitl, setSkipHitl] = useState(data.skipHitl);

  const addSourceUrl = () => {
    setSourceUrls([...sourceUrls, '']);
  };

  const removeSourceUrl = (index: number) => {
    setSourceUrls(sourceUrls.filter((_, i) => i !== index));
  };

  const updateSourceUrl = (index: number, value: string) => {
    const newUrls = [...sourceUrls];
    newUrls[index] = value;
    setSourceUrls(newUrls);
  };

  const handleNext = () => {
    const filteredUrls = sourceUrls.filter((url) => url.trim() !== '');
    updateData({
      sourceUrls: filteredUrls,
      currentSitecoreUrl,
      codeRepositoryUrl,
      xmcUrl,
      skipHitl,
    });
  };

  const canProceed =
    sourceUrls.some((url) => url.trim() !== '') &&
    currentSitecoreUrl.trim() !== '';

  return (
    <WizardStepContainer onNext={handleNext} canProceed={canProceed}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Live Sitemap URLs
            </CardTitle>
            <CardDescription>
              Add one or more live sitemap URLs to analyze your current site
              structure
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sourceUrls.map((url, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="https://example.com/sitemap.xml"
                  value={url}
                  onChange={(e) => updateSourceUrl(index, e.target.value)}
                  className="flex-1"
                />
                {sourceUrls.length > 1 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeSourceUrl(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              onClick={addSourceUrl}
              className="gap-2 bg-transparent"
            >
              <Plus className="h-4 w-4" />
              Add Another URL
            </Button>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Current Sitecore URL
              </CardTitle>
              <CardDescription>
                Your existing Sitecore instance URL
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="https://sitecore.example.com"
                value={currentSitecoreUrl}
                onChange={(e) => setCurrentSitecoreUrl(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                Code Repository URL
              </CardTitle>
              <CardDescription>
                Git repository containing your source code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="https://github.com/company/project"
                value={codeRepositoryUrl}
                onChange={(e) => setCodeRepositoryUrl(e.target.value)}
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              XMC URL
            </CardTitle>
            <CardDescription>
              Experience Management Cloud URL (optional)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="https://xmc.example.com"
              value={xmcUrl}
              onChange={(e) => setXmcUrl(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Migration Options</CardTitle>
            <CardDescription>
              Configure how the migration process should run
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="skip-hitl"
                checked={skipHitl}
                onCheckedChange={(checked) => setSkipHitl(!!checked)}
              />
              <Label
                htmlFor="skip-hitl"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Skip Human-in-the-Loop (HITL) reviews (Demo mode only)
              </Label>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              When enabled, the migration will proceed automatically without
              waiting for human approval at each step. This is recommended only
              for demonstration purposes.
            </p>
          </CardContent>
        </Card>
      </div>
    </WizardStepContainer>
  );
}
