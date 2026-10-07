import { mplCore } from "@metaplex-foundation/mpl-core";
import { mplToolbox } from "@metaplex-foundation/mpl-toolbox";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  fromWeb3JsPublicKey,
  fromWeb3JsTransaction,
  toWeb3JsTransaction,
} from "@metaplex-foundation/umi-web3js-adapters";
import { SolanaAgentKit } from "@packages/core/dist";

export function initUmi(agent: SolanaAgentKit) {
  const umi = createUmi(agent.connection.rpcEndpoint)
    .use(mplCore())
    .use(mplToolbox());
  umi.identity = {
    publicKey: fromWeb3JsPublicKey(agent.wallet.publicKey),
    signTransaction: async (tx) =>
      fromWeb3JsTransaction(
        await agent.wallet.signTransaction(toWeb3JsTransaction(tx)),
      ),
    signAllTransactions: async (txs) => {
      const signedTxs = await agent.wallet.signAllTransactions(
        txs.map((tx) => toWeb3JsTransaction(tx)),
      );
      return signedTxs.map((tx) => fromWeb3JsTransaction(tx));
    },
    signMessage: agent.wallet.signMessage,
  };
  umi.payer = umi.identity;

  return umi;
}
