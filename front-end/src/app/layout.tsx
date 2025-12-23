import type React from 'react';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Bebas_Neue, Poppins } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/components/auth-provider';
import { ToastProvider } from '@/components/notifications/toast-provider';
import { Footer } from '@/components/footer';
import { Suspense } from 'react';
import './globals.css';

const bebasKai = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas-kai',
});

const poppins = Poppins({
  weight: '600', // Semi Bold
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Migration Wizard - Content Migration Platform',
  description: 'Streamline your content migration with AI-powered tools',
  generator: 'v0.app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${bebasKai.variable} ${poppins.variable}`}>
        <Suspense fallback={null}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              {children}
              <Footer />
              <ToastProvider />
            </AuthProvider>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
