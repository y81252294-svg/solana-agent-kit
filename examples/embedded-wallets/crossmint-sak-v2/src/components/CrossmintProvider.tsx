import {
  CrossmintProvider as CrossmintSDKProvider,
  CrossmintAuthProvider,
} from "@crossmint/client-sdk-react-ui";

export function CrossmintProvider({ children }: { children: React.ReactNode }) {
  const crossmintApiKey = import.meta.env.VITE_CROSSMINT_API_KEY;

  return (
    <CrossmintSDKProvider apiKey={crossmintApiKey}>
      <CrossmintAuthProvider
        embeddedWallets={{
          type: "solana-smart-wallet",
          createOnLogin: "all-users",
        }}
      >
        {children}
      </CrossmintAuthProvider>
    </CrossmintSDKProvider>
  );
} 