import { PublicKey } from "@solana/web3.js";
import { SolanaAgentKit } from "solana-agent-kit";
import type { DisplayOptions, SortOptions } from "../types";

/**
 * Fetch assets by owner using the Helius Digital Asset Standard (DAS) API
 *
 * see details here: https://docs.helius.dev/compression-and-das-api/digital-asset-standard-das-api/get-assets-by-owner
 * @param agent SolanaAgentKit instance
 * @param ownerPublicKey Owner's Solana wallet PublicKey
 * @param limit Number of assets to retrieve per request
 * @param page Page number to retrieve
 * @param displayOptions Display options for the assets
 * @param sortOptions Sort options for the assets
 * @returns Assets owned by the specified address
 */
export async function getAssetsByOwner(
  agent: SolanaAgentKit,
  ownerPublicKey: PublicKey,
  limit: number,
  page = 1,
  displayOptions: DisplayOptions = {
    showFungible: true,
  },
  sortOptions?: SortOptions,
): Promise<any> {
  try {
    const apiKey = agent.config?.HELIUS_API_KEY;
    if (!apiKey) {
      throw new Error("HELIUS_API_KEY not found in environment variables");
    }

    const url = `https://mainnet.helius-rpc.com/?api-key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "get-assets",
        method: "getAssetsByOwner",
        params: {
          ownerAddress: ownerPublicKey.toString(),
          page,
          limit,
          displayOptions,
          sortOptions,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch: ${response.status} - ${response.statusText}`,
      );
    }

    const data = await response.json();

    return data.result.items;
  } catch (error: any) {
    console.error("Error retrieving assets: ", error.message);
    throw new Error(`Assets retrieval failed: ${error.message}`);
  }
}
