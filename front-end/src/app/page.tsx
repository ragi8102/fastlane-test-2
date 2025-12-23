import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserDisplayWrapper } from '@/components/user-display-wrapper';
import { AltudoLogo } from '@/components/altudo-logo';
import { ArrowRight, Shield, BarChart3, Workflow } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/lib/auth';

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <AltudoLogo />
            <div className="flex items-center gap-2">
              <Workflow className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-semibold text-foreground">
                Migration Wizard
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserDisplayWrapper session={session} />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="cover-headline altudo-grey-text hero-text-with-line mb-4">
            Streamline Your Content Migration
          </h2>
          <p className="sub-headline altudo-grey-text mb-8">
            AI-powered migration wizard that transforms your content migration
            process with intelligent automation and human oversight.
          </p>
          {session ? (
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground">
                Welcome back, {session.user?.name}! Ready to start your
                migration?
              </p>
              <Button size="lg" asChild>
                <Link href="/wizard" className="gap-2">
                  Start Migration <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <Button size="lg" asChild>
              <Link href="/auth/signin" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="altudo-card group cursor-pointer">
            <CardHeader>
              <Shield className="h-12 w-12 altudo-yellow-accent mb-4 group-hover:scale-110 transition-transform duration-300" />
              <CardTitle className="group-hover:text-primary transition-colors duration-300">Secure Authentication</CardTitle>
              <CardDescription className="altudo-grey-text group-hover:text-foreground transition-colors duration-300">
                Enterprise-grade security with Microsoft Azure AD integration
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="altudo-card group cursor-pointer">
            <CardHeader>
              <BarChart3 className="h-12 w-12 altudo-yellow-accent mb-4 group-hover:scale-110 transition-transform duration-300" />
              <CardTitle className="group-hover:text-primary transition-colors duration-300">Smart Dashboard</CardTitle>
              <CardDescription className="altudo-grey-text group-hover:text-foreground transition-colors duration-300">
                Track all your migration submissions and progress in one place
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="altudo-card group cursor-pointer">
            <CardHeader>
              <Workflow className="h-12 w-12 altudo-yellow-accent mb-4 group-hover:scale-110 transition-transform duration-300" />
              <CardTitle className="group-hover:text-primary transition-colors duration-300">9-Step Wizard</CardTitle>
              <CardDescription className="altudo-grey-text group-hover:text-foreground transition-colors duration-300">
                Guided migration process from content modeling to deployment
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  );
}
