import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StormSense AI - Multi-Spectral GIS Cyclone Intelligence Dashboard',
  description:
    'High-impact GIS and AI Operational Cockpit for Tropical Cyclone tracking, SigLIP zero-shot visual pattern classification, IBTrACS trajectory prediction, and Autonomous Copilot.',
  icons: {
    icon: [],
  },
  keywords: [
    'Cyclone Tracking',
    'GIS Dashboard',
    'StormSense AI',
    'IMD Tropical Cyclone',
    'SigLIP Vision AI',
    'MapLibre GL',
    'North Indian Ocean Cyclones',
    'Bay of Bengal Cyclones',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-slate-950 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
