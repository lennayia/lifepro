/**
 * Root Layout - LifePro
 * MUI Theme + Czech Language
 */

import type { Metadata } from 'next';
import { ThemeProvider } from '@/shared/context/ThemeContext';
import { LifeAuthProvider } from '@/shared/context/LifeAuthContext';

export const metadata: Metadata = {
  title: 'LifePro - Najděte své životní poslání',
  description: 'Aplikace pro hledání životního poslání a radosti z práce. Systematicky prozkoumejte, co vás baví, co umíte a čemu se chcete věnovat.',
  keywords: ['životní poslání', 'kariéra', 'sebepoznání', 'život', 'práce', 'radost'],
  authors: [{ name: 'LifePro Team' }],
  openGraph: {
    title: 'LifePro - Najděte své životní poslání',
    description: 'Objevte, co vás v životě opravdu naplňuje',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
        <ThemeProvider>
          <LifeAuthProvider>
            {children}
          </LifeAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
