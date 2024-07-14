import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { generateSigner, percentAmount } from "@metaplex-foundation/umi";
import {
  toWeb3JsKeypair,
  toWeb3JsTransaction,
} from "@metaplex-foundation/umi-web3js-adapters";
import { AnchorProvider } from "@coral-xyz/anchor";

const umi = createUmi("http://127.0.0.1:8899").use(mplTokenMetadata());

export async function mintNFT(provider: AnchorProvider) {
  umi.use(walletAdapterIdentity(provider.wallet));

  const mint = generateSigner(umi);

  let builder = await createNft(umi, {
    mint,
    name: "My NFT",
    uri: "https://example.com/my-nft.json",
    sellerFeeBasisPoints: percentAmount(5.5),
  });

  builder = await builder.setLatestBlockhash(umi);
  const tx = await builder.buildAndSign(umi);

  return {
    mint: toWeb3JsKeypair(mint),
    transaction: toWeb3JsTransaction(tx),
  };
}
