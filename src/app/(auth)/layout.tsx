/**
 * Auth Layout
 * Layout pro přihlášení a registraci
 */

import { AnimatedGradient } from '@/shared';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <AnimatedGradient />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
        }}
      >
        {children}
      </div>
    </div>
  );
}
