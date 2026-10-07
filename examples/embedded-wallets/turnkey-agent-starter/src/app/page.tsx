"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Auth, useTurnkey, TurnkeyProvider } from "@turnkey/sdk-react";
import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar";
import { Toaster, toast } from "sonner";
import { Icon } from "@iconify/react";
import Image from "next/image";

interface SocialConfig {
  enabled: boolean;
  providers: {
    google: boolean;
    apple: boolean;
    facebook: boolean;
  };
}

interface Config {
  email: boolean;
  passkey: boolean;
  phone: boolean;
  wallet: boolean;
  socials: SocialConfig;
}

export default function AuthPage() {
  const router = useRouter();
  const { turnkey, authIframeClient } = useTurnkey();
  const [configOrder] = useState([
    "socials",
    "email",
    "phone",
    "passkey",
    "wallet",
  ]);

  const [config] = useState<Config>({
    email: true,
    phone: false,
    passkey: false,
    wallet: false,
    socials: {
      enabled: false,
      providers: {
        google: false,
        apple: false,
        facebook: false,
      },
    },
  });

  const handleAuthSuccess = async () => {
    router.push("/chat");
  };

  useEffect(() => {
    const manageSession = async () => {
      if (turnkey) {
        const session = await turnkey?.getSession();
        if (session && Date.now() < session.expiry) {
          router.push("/chat");
        }
        else {
          await turnkey?.logout();
        }
      }
    };
    manageSession();
  }, [turnkey, router]);

  const authConfig = {
    emailEnabled: config.email,
    passkeyEnabled: config.passkey,
    phoneEnabled: config.phone,
    walletEnabled: config.wallet,
    appleEnabled: config.socials.providers.apple,
    googleEnabled: config.socials.providers.google,
    facebookEnabled: config.socials.providers.facebook,
  };

  return (
    <TurnkeyProvider config={{
      apiBaseUrl: process.env.NEXT_PUBLIC_BASE_URL as string,
      defaultOrganizationId: process.env.NEXT_PUBLIC_ORGANIZATION_ID as string,
    }}>
      <div className="bg-[radial-gradient(circle,#242A37,#29313F,#2C3644,#3D4854)] min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="max-w-md w-full bg-[#20242D] rounded-xl border border-[rgba(255,255,255,0.1)] shadow-lg overflow-hidden p-6 m-4">
            <div className="mb-6 bg-[rgba(255,255,255,0.05)] rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 relative">
                <Icon 
                  icon="solar:key-minimalistic-square-3-bold-duotone"
                  width="24" 
                  height="24"
                  className="text-[#282c3a] bg-[#fff] rounded-md"
                />
                </div>
                <div className="text-white font-medium text-lg">Turnkey Authentication</div>
              </div>
              <p className="text-gray-400 text-xs mb-2">Sign in to use your Solana wallet using Turnkey</p>
            </div>

            <Auth
              authConfig={authConfig}
              configOrder={configOrder}
              onAuthSuccess={handleAuthSuccess}
              onError={(errorMessage: string) => toast.error(errorMessage)}
              customSmsMessage={"Your Turnkey AI Demo OTP is {{.OtpCode}}"}
            />
          </div>
        </div>
        <Toaster
          position="bottom-right"
          toastOptions={{ 
            className: "bg-[rgba(42,43,54,0.8)] text-white border border-[rgba(255,255,255,0.1)] shadow-lg", 
            duration: 2500 
          }}
        />
      </div>
    </TurnkeyProvider>
  );
}