import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

interface NavbarProps {
}

const Navbar: React.FC<NavbarProps> = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);


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
            <Image
              src="/sendai.jpg"
              width={40}
              height={40}
              alt="Sendai Logo"
              className="rounded-xl"
            />
          </div>
          <span className="text-white font-bold text-lg">Solana Agent Kit | Phantom</span>
        </a>
      </div>
    </div>
  );
};

export default Navbar;
