import { CircleUser } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useCopyToClipboard } from "usehooks-ts";
import { toast } from "./Toast";
import { toast as sonnerToast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { useAuth, useWallet } from "@crossmint/client-sdk-react-ui";
import { useState, useEffect, useRef } from "react";
import { fetchSession, signupFn } from "~/functions/session";
import { Icon } from "./ui/icon";
import { Connection, PublicKey } from "@solana/web3.js";

interface UserLoginButtonProps {
  context?: "sidebar" | "modal";
}

export default function UserLoginButton({
  context = "sidebar",
}: UserLoginButtonProps) {
  const { login, logout, jwt, status: crossMintAuthStatus, user } = useAuth();
  const { wallet, status } = useWallet();
  const nav = useNavigate();
  const [_, copyToClipboard] = useCopyToClipboard();
  const [balance, setBalance] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>('bottom');

  const walletAddress = wallet
    ? (wallet as any).address || (wallet as any).publicKey?.toString()
    : null;

  // Check if dropdown should open upward or downward
  const checkDropdownPosition = () => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const spaceBelow = windowHeight - buttonRect.bottom;
      
      // If there's less than 200px below the button, show dropdown above
      if (spaceBelow < 200) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    }
  };

  // Handle clicks outside the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch SOL balance when wallet is connected
  useEffect(() => {
    if (walletAddress) {
      const fetchBalance = async () => {
        try {
          const connection = new Connection(import.meta.env.VITE_RPC_URL as string, "confirmed");
          const publicKey = new PublicKey(walletAddress);
          const balanceInLamports = await connection.getBalance(publicKey);
          setBalance(balanceInLamports / 1_000_000_000); // Convert lamports to SOL
        } catch (error) {
          console.error("Error fetching SOL balance:", error);
        }
      };
      
      fetchBalance();
      
      // Optional: Set up a refresh interval
      const intervalId = setInterval(fetchBalance, 30000); // Refresh every 30 seconds
      
      return () => clearInterval(intervalId);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (crossMintAuthStatus === "logged-in") {
      fetchSession().then((v) => {
        if (v?.email || v?.walletAddress) {
          return;
        }

        signupFn({
          data: {
            walletAddress: wallet?.address as string,
            email: user?.email,
            redirectUrl: "/chats",
          },
        }).then((v) => {
          if (v.error) {
            return sonnerToast.error(v.message);
          }

          nav({ href: "/chats" });
        });
      });
    }
  }, [crossMintAuthStatus, user, wallet]);

  if (status === "loading-error") {
    return <div className="text-rose-500">Error loading wallet</div>;
  }

  if (status === "in-progress") {
    return <div className="text-amber-500">Loading...</div>;
  }

  // Function to truncate wallet address
  const truncateAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleCopyAddress = () => {
    if (walletAddress) {
      copyToClipboard(walletAddress);
      sonnerToast.success("Address copied to clipboard");
      setIsOpen(false);
    } else {
      sonnerToast.error("No wallet address found");
    }
  };

  const toggleDropdown = () => {
    if (!isOpen) {
      checkDropdownPosition();
    }
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  const isSidebar = context === "sidebar";

  return (
    <>
      {jwt ? (
        <div className="px-0 relative" ref={dropdownRef}>
          <Button 
            ref={buttonRef}
            variant="ghost" 
            className="w-full flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm bg-[#1E9BB9]/10 hover:bg-[#1E9BB9]/20 text-[#1E9BB9] transition-colors duration-200 font-['SF_Pro_Text',system-ui,sans-serif]"
            onClick={toggleDropdown}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Icon name="wallet-money-linear" className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{truncateAddress(walletAddress || "")}</span>
            </div>
            {balance !== null && (
              <div className="flex items-center gap-1 ml-1 flex-shrink-0">
                <Icon name="bitcoin-circle-linear" className="w-4 h-4 text-[#1E9BB9]" />
                <span>{balance.toFixed(3)}</span>
              </div>
            )}
          </Button>
          
          {isOpen && (
            <div 
              className={`absolute ${dropdownPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} right-0 w-48 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg z-50 py-1 font-['SF_Pro_Text',system-ui,sans-serif]`}
            >
              <div 
                className="flex justify-between items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleMenuItemClick(() => nav({ href: "/profile" }))}
              >
                <span>Profile</span>
                <Icon name="user-linear" className="w-4 h-4 ml-2" />
              </div>
              
              <div 
                className="flex justify-between items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleMenuItemClick(() => nav({ href: "/settings" }))}
              >
                <span>Settings</span>
                <Icon name="settings-linear" className="w-4 h-4 ml-2" />
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
              
              <div 
                className="flex justify-between items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleMenuItemClick(handleCopyAddress)}
              >
                <span>Copy Address</span>
                <Icon name="copy-linear" className="w-4 h-4 ml-2" />
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
              
              <div 
                className="flex justify-between items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
                onClick={() => handleMenuItemClick(() => {
                  sonnerToast.promise(
                    async () => {
                      logout();
                      nav({ href: "/", replace: true });
                    },
                    {
                      loading: "Disconnecting wallet...",
                      success: "Wallet disconnected successfully",
                      error: "Failed to disconnect wallet",
                    }
                  );
                })}
              >
                <span>Disconnect Wallet</span>
                <Icon name="logout-3-linear" className="w-4 h-4 ml-2" />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="px-0">
          <Button 
            className="w-full rounded-md bg-[#1E9BB9] px-3 py-2 text-white hover:bg-[#1E9BB9]/80 transition-colors duration-200 font-['SF_Pro_Text',system-ui,sans-serif]"
            onClick={login}
          >
            Connect
          </Button>
        </div>
      )}
    </>
  );
}
