import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

interface NavbarProps {
  selectedAccount?: string | null;
}

const Navbar: React.FC<NavbarProps> = ({ selectedAccount }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getBalance = async () => {
      if (selectedAccount) {
        try {
          const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL as string || "https://api.devnet.solana.com");
          const publicKey = new PublicKey(selectedAccount);
          const balance = await connection.getBalance(publicKey);
          setBalance(balance / LAMPORTS_PER_SOL);
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
    };

    getBalance();
  }, [selectedAccount]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...");
    
    // Redirect to login or clear session
    window.location.href = "/";
  };

  // Format wallet address for display
  const formatAddress = (address: string | null | undefined) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="fixed top-0 left-0 w-full z-[1000] bg-transparent backdrop-blur-sm flex items-center h-24 px-12">
      <div className="flex items-center">
        <a href="/" className="flex items-center gap-2">
          <div className="rounded-2xl flex items-center justify-center">
            <Icon 
              icon="solar:key-minimalistic-square-3-bold-duotone"
              width="40" 
              height="40"
              className="text-[#282c3a] bg-[#fff] rounded-xl"
            />
          </div>
          <span className="text-white font-bold text-lg">Turnkey AI</span>
        </a>
      </div>
      <div className="ml-auto relative" ref={dropdownRef}>
        <button 
          className="text-white rounded-full bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] p-2 transition-colors"
          onClick={toggleDropdown}
        >
          <Icon 
            icon="solar:box-minimalistic-broken"
            width="20" 
            height="20"
            className="text-white"
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#20242D] border border-[rgba(255,255,255,0.1)] shadow-lg overflow-hidden">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 relative">
                  <Image 
                    src="/logos/sol-logo.svg" 
                    alt="Solana" 
                    width={32} 
                    height={32} 
                    className="rounded-full"
                  />
                </div>
                <div className="text-white font-medium text-sm">Solana Wallet</div>
              </div>
              
              {selectedAccount ? (
                <>
                  <div className="bg-[rgba(255,255,255,0.05)] rounded-lg p-3 mb-3">
                    <div className="text-gray-400 text-xs mb-1">Wallet Address</div>
                    <div className="text-white text-sm font-mono">{formatAddress(selectedAccount)}</div>
                  </div>
                  <div className="bg-[rgba(255,255,255,0.05)] rounded-lg p-3 mb-4">
                    <div className="text-gray-400 text-xs mb-1">Balance</div>
                    <div className="text-white text-sm font-medium">
                      {balance !== null ? `${balance.toFixed(4)} SOL` : "Loading..."}
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-[rgba(255,255,255,0.05)] rounded-lg p-3 mb-4 text-center">
                  <div className="text-white text-sm">No wallet connected</div>
                </div>
              )}
              
              <button 
                onClick={handleLogout}
                className="w-full py-2 px-4 bg-[rgba(255,0,0,0.1)] hover:bg-[rgba(255,0,0,0.2)] text-red-400 rounded-lg transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
