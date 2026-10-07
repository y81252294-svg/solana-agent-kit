"use client";

import "./globals.css";
import { PhantomWalletProvider } from './components/PhantomWallet';

interface RootLayoutProps {
  children: React.ReactNode;
}

function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <head>
        <title>Phantom AI</title>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="h-full font-['Inter',sans-serif]">
        <PhantomWalletProvider>
          {children}
        </PhantomWalletProvider>
      </body>
    </html>
  );
}

export default RootLayout;
