// provider.tsx
'use client';
import { SessionProvider } from 'next-auth/react';

export function ProvidersAuth({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
