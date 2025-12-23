'use client';

import { UserDisplay } from './user-display';
import { Button } from './ui/button';
import Link from 'next/link';

interface UserDisplayWrapperProps {
  session: {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  } | null;
}

export function UserDisplayWrapper({ session }: UserDisplayWrapperProps) {
  if (session) {
    return <UserDisplay />;
  }

  return (
    <Button asChild>
      <Link href="/auth/signin">Sign In</Link>
    </Button>
  );
}
