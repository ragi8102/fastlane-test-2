import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserNav } from '@/components/user-nav';
import { AltudoLogo } from '@/components/altudo-logo';
import { Workflow, Plus } from 'lucide-react';
import Link from 'next/link';

export function DashboardHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <AltudoLogo />
          <Link href="/dashboard" className="flex items-center gap-2">
            <Workflow className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold text-foreground">
              Migration Wizard
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button asChild className="gap-2">
            <Link href="/wizard">
              <Plus className="h-4 w-4" />
              New Migration
            </Link>
          </Button>
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
