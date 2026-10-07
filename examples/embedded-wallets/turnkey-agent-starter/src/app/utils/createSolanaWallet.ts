import {
    type TurnkeyApiClient,
    TurnkeyActivityError,
} from "@turnkey/sdk-server";

export async function createNewSolanaWallet(client: TurnkeyApiClient, organizationId: string) {
    console.log("creating a new Solana wallet in your Turnkey organization...\n");

    const walletName = `${organizationId}`;

    const wallets = await client.getWallets();
    const existingWallet = wallets.wallets.find(wallet => wallet.walletName === walletName);

    if (existingWallet) {
        const walletId = existingWallet?.walletId;
        const response = await client.getWalletAccounts({ walletId: walletId })
        for (let i = 0; i < response.accounts.length; i++) {
            const accounts = response.accounts[i];
            if (accounts.addressFormat === "ADDRESS_FORMAT_SOLANA") {
                console.log(accounts.address);
                return accounts.address;
            }
        }
    }

    try {
        const response = await client.createWallet({
            walletName,
            accounts: [
                {
                    pathFormat: "PATH_FORMAT_BIP32",
                    path: "m/44'/501'/0'/0'",
                    curve: "CURVE_ED25519",
                    addressFormat: "ADDRESS_FORMAT_SOLANA",
                },
            ],
        });

        const walletId = response.walletId;
        if (!walletId) {
            console.error("response doesn't contain a valid wallet ID");
            process.exit(1);
        }

        const address = response.addresses[0];
        if (!address) {
            console.error("response doesn't contain a valid address");
            process.exit(1);
        }

        return address;
    } catch (error) {
        if (error instanceof TurnkeyActivityError) {
            throw error;
        }

        throw new TurnkeyActivityError({
            message: `Failed to create a new Solana wallet: ${(error as Error).message
                }`,
            cause: error as Error,
        });
    }
}