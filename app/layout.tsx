import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Palm92 Capital Intelligence',
  description: 'Governed capital readiness, funding and wealth-risk intelligence.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}