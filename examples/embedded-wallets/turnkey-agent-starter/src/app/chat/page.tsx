"use client";

import {
  useTurnkey
} from "@turnkey/sdk-react";

import { AIChat } from "../components/Chat"

import { server } from "@turnkey/sdk-server";
import { useEffect, useState } from "react";
import {
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { Toaster, toast } from "sonner";
import { TurnkeyBrowserClient, User } from "@turnkey/sdk-browser";
import { Turnkey } from "@turnkey/sdk-server";
import { TurnkeySigner } from "@turnkey/solana";
import { createNewSolanaWallet } from "../utils/createSolanaWallet";

export default function Dashboard() {
  const router = useRouter();
  const { turnkey, getActiveClient } = useTurnkey();
  const [loading, setLoading] = useState(true);
  const [wallets, setWallets] = useState<any[]>([]);
  const [signer, setSigner] = useState<TurnkeySigner>();
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [suborgId, setSuborgId] = useState<string>("");
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [client, setClient] = useState<TurnkeyBrowserClient | undefined>();

  const ORGANIZATION_ID = process.env.NEXT_PUBLIC_ORGANIZATION_ID as string;
  const API_PUBLIC_KEY = process.env.NEXT_PUBLIC_TURNKEY_API_PUBLIC_KEY as string;
  const API_PRIVATE_KEY = process.env.NEXT_PUBLIC_TURNKEY_API_PRIVATE_KEY as string

  useEffect(() => {
    const getUser = async () => {
      if (turnkey) {
        const user = await turnkey.getCurrentUser();
        setUser(user);
      }
    }
    getUser();
  }, [turnkey]);

  useEffect(() => {
    const manageSession = async () => {
      try {
        if (turnkey && getActiveClient) {
          const activeClient = await getActiveClient();
          setClient(activeClient);
          const suborganizationId = user?.organization.organizationId as string;
          setSuborgId(suborganizationId);

          const turnkeyClient = new Turnkey({
            apiBaseUrl: process.env.NEXT_PUBLIC_BASE_URL!,
            apiPublicKey: API_PUBLIC_KEY,
            apiPrivateKey: API_PRIVATE_KEY,
            defaultOrganizationId: ORGANIZATION_ID,
          });

          const address = await createNewSolanaWallet(turnkeyClient.apiClient(), suborgId)
          setSelectedAccount(address);

          const turnkeySigner = new TurnkeySigner({
            organizationId: ORGANIZATION_ID,
            client: turnkeyClient.apiClient(),
          });
          setSigner(turnkeySigner);


        }
      } catch (error) {
        console.error(error);
        toast.error("Error loading wallet data");
      } finally {
        setLoading(false);
      }
    };
    manageSession();
  }, [turnkey, router, user]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex justify-center items-center bg-[var(--background)]">
        <Navbar selectedAccount={selectedAccount} />
        <CircularProgress
          size={60}
          thickness={4}
          className="text-blue-500"
        />
      </div>
    );
  }

  return (
    <div className="bg-[radial-gradient(circle,#242A37,#29313F,#2C3644,#3D4854)] min-h-screen flex flex-col">
      <Navbar selectedAccount={selectedAccount} />
      <div className="flex-1 flex flex-col">
        <AIChat
          selectedAccount={selectedAccount}
          signer={signer}
        />
      </div>
      <Toaster
        position="bottom-right"
        toastOptions={{ 
          className: "bg-[rgba(42,43,54,0.8)] text-white border border-[rgba(255,255,255,0.1)] shadow-lg", 
          duration: 2500 
        }}
      />
    </div>
  );
}