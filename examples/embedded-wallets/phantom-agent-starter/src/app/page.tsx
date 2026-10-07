"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar";
import { Toaster, toast } from "sonner";
import { Icon } from "@iconify/react";
import { usePhantomWallet } from "./components/PhantomWallet";
import Image from "next/image";



export default function AuthPage() {
  const router = useRouter();
  const { phantom, connected, publicKey , connect , disconnect} = usePhantomWallet();

  const handleAuthSuccess = async () => {
    router.push("/chat");
  };

  useEffect(() => {
    if (connected) {
      handleAuthSuccess();
    }
  }, [connected, handleAuthSuccess]);

  return (

    <div className="bg-[radial-gradient(circle,#242A37,#29313F,#2C3644,#3D4854)] min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex justify-center items-center">
        <div className="max-w-md w-full bg-[#20242D] rounded-xl border border-[rgba(255,255,255,0.1)] shadow-lg overflow-hidden p-6 m-4">
          <div className="mb-6 bg-[rgba(255,255,255,0.05)] rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-6 relative">
                <Image src="/sendai.jpg" alt="Sendai Logo" width={24} height={24} />
              </div>
              <div className="text-white font-medium text-lg">Phantom Authentication</div>
            </div>
            <p className="text-gray-400 text-xs mb-2">Sign in to use your Solana wallet using Phantom</p>
          </div>
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
  );
}