import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { WhitelistGatedTokenSale } from "../target/types/whitelist_gated_token_sale";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
  getMerkleRoot,
  tokenMint,
  allowAddresses,
  TOKEN_METADATA_PROGRAM_ID,
} from "./heper";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

describe("1.init-distributor", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace
    .WhitelistGatedTokenSale as Program<WhitelistGatedTokenSale>;

  it.only("init success", async () => {
    const root = getMerkleRoot(allowAddresses);
    const tokenPrice = new anchor.BN(LAMPORTS_PER_SOL / 100); // 0.01 sol
    const limitPerWallet = new anchor.BN(1000);
    const tokenName = "Superteam";
    const symbol = "NFTPro";
    const uri =
      "https://ki5ol47zogvasqoa37zh7df7jhdzgsw6f5kiit6mh66mfrx4tnoq.arweave.net/Ujrl8_lxqglBwN_yf4y_SceTSt4vVIRPzD-8wsb8m10?ext=json%27";

    const [config] = PublicKey.findProgramAddressSync(
      [Buffer.from("config")],
      program.programId
    );

    const [metadataAccount] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        tokenMint.publicKey.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

    const tx = await program.methods
      .initDistributor(
        root as any,
        tokenPrice,
        limitPerWallet,
        tokenName,
        symbol,
        uri
      )
      .accounts({
        config,
        mint: tokenMint.publicKey,
        metadataAccount,
        payer: provider.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      })
      .signers([tokenMint])
      .rpc();

    console.log("Your transaction signature", tx);
  });
});
