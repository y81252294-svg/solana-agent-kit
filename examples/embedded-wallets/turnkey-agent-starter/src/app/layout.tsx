"use client";

import "./globals.css";
import "@turnkey/sdk-react/styles";
import { TurnkeyProvider, TurnkeyThemeProvider } from "@turnkey/sdk-react";
import { EthereumWallet } from "@turnkey/wallet-stamper";

const wallet = new EthereumWallet();
const turnkeyConfig = {
  apiBaseUrl: process.env.NEXT_PUBLIC_BASE_URL!,
  defaultOrganizationId: process.env.NEXT_PUBLIC_ORGANIZATION_ID!,
  rpId: process.env.NEXT_PUBLIC_RPID!,
  iframeUrl:
    process.env.NEXT_PUBLIC_AUTH_IFRAME_URL ?? "https://auth.turnkey.com",
  wallet,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <head>
        <title>Turnkey AI</title>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <TurnkeyThemeProvider>
        <body className="h-full font-['Inter',sans-serif]">
          <TurnkeyProvider config={turnkeyConfig}>{children}</TurnkeyProvider>
        </body>
      </TurnkeyThemeProvider>
    </html>
  );
}

export default RootLayout;
