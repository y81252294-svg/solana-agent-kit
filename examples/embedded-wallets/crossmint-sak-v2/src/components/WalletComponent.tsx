import { useWallet } from "@crossmint/client-sdk-react-ui";
import { Card } from "./ui/card";

function Status() {
  const { wallet, status, error } = useWallet();

  if (status === "loading-error") {
    return <div className="text-rose-500">Error: {error}</div>;
  }

  if (status === "in-progress") {
    return <div className="text-amber-500">Loading...</div>;
  }

  if (status === "loaded" && wallet) {
    const address = (wallet as any).address || (wallet as any).publicKey?.toString();
    return <div className="text-emerald-600">Connected: {address}</div>;
  }

  return <div className="text-zinc-400">Wallet not connected</div>;
}

export default function WalletComponent() {
  return (
    <Card className="p-4">
      <Status />
    </Card>
  );
} 