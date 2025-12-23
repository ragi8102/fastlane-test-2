'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface AltudoLogoProps {
  className?: string;
}

export function AltudoLogo({ className = '' }: AltudoLogoProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same dimensions during SSR
    return (
      <div 
        className={`bg-muted animate-pulse rounded ${className}`}
        style={{ width: 100, height: 24 }}
      />
    );
  }

  // Use resolvedTheme to get the actual theme (handles system theme)
  const isDark = resolvedTheme === 'dark';
  
  const logoSrc = isDark 
    ? "https://altudo-marketing-prod-367860-single.azurewebsites.net/-/media/project/altudo/altudo/header/altudo-logo_white-(2).svg?iar=0&hash=8A45B916B9AC8B18161C6A6637A6FF18"
    : "https://altudo-marketing-prod-367860-single.azurewebsites.net/-/media/project/altudo/altudo/header/altudo-logo_grey-(2).svg?iar=0&hash=60FF9596FBF19F6D7B424A29A14ECBE2";

  return (
    <Image
      src={logoSrc}
      alt="Altudo Logo"
      width={100}
      height={24}
      className={`${className}`}
      priority
    />
  );
}
