import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { WhitelistGatedTokenSale } from "../target/types/whitelist_gated_token_sale";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { getMerkleProof, tokenMint, allowAddresses } from "./heper";
import { BN } from "bn.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

describe("2.Mint token", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace
    .WhitelistGatedTokenSale as Program<WhitelistGatedTokenSale>;

  it("Mint success", async () => {
    const [config] = PublicKey.findProgramAddressSync(
      [Buffer.from("config")],
      program.programId
    );

    const [mintCounter] = PublicKey.findProgramAddressSync(
      [Buffer.from("mint_counter"), provider.publicKey.toBuffer()],
      program.programId
    );

    const proof = getMerkleProof(allowAddresses, provider.publicKey.toBase58());

    const minterTokenAccount = getAssociatedTokenAddressSync(
      tokenMint.publicKey,
      provider.publicKey
    );

    const tx = await program.methods
      .mintToken(proof as any, new BN(100))
      .accounts({
        config,
        mintCounter,
        mint: tokenMint.publicKey,
        minterTokenAccount,
        minter: provider.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .rpc();

    console.log("Your transaction signature: ", tx);
  });

  it("Mint failed", async () => {
    const [config] = PublicKey.findProgramAddressSync(
      [Buffer.from("config")],
      program.programId
    );

    const [mintCounter] = PublicKey.findProgramAddressSync(
      [Buffer.from("mint_counter"), provider.publicKey.toBuffer()],
      program.programId
    );

    const proof = getMerkleProof(allowAddresses, provider.publicKey.toBase58());

    const minterTokenAccount = getAssociatedTokenAddressSync(
      tokenMint.publicKey,
      provider.publicKey
    );

    const tx = await program.methods
      .mintToken(proof as any, new BN(1000))
      .accounts({
        config,
        mintCounter,
        mint: tokenMint.publicKey,
        minterTokenAccount,
        minter: provider.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .rpc();

    console.log("Your transaction signature: ", tx);
  });
});
