"use client";


import { AIChat } from "../components/Chat"
import { SolanaTransactionExample } from "../components/SolanaTransactionExample";

import { useEffect, useState } from "react";
import {
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { Toaster, toast } from "sonner";


export default function Dashboard() {

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex justify-center items-center bg-[var(--background)]">
        <Navbar />
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
      <Navbar  />
      <div className="flex-1 flex flex-col">
        <SolanaTransactionExample />
        <AIChat/>
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