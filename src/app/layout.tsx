import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/shared/Navigation';
import { Footer } from '@/components/shared/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'CarbonWise - Personal Sustainability Companion',
  description: 'Understand, track, and reduce your carbon footprint through simple assessments and actionable guidance.',
  keywords: ['carbon footprint', 'sustainability', 'climate change', 'carbon calculator', 'eco-friendly'],
  authors: [{ name: 'CarbonWise Team' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-screen bg-background text-foreground font-sans flex flex-col antialiased">
        <Navigation />
        <main className="flex-1 flex flex-col pb-16 md:pb-0">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
