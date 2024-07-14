import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { NftMinter } from "../target/types/nft_minter";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import { MPL_TOKEN_METADATA_PROGRAM_ID } from "./constant";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { BN } from "bn.js";

describe.only("All flows", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.NftMinter as Program<NftMinter>;

  const taker = Keypair.generate();
  console.log("taker: ", taker.publicKey.toBase58());

  const [platform] = PublicKey.findProgramAddressSync(
    [Buffer.from("platform")],
    program.programId
  );

  const [treasury] = PublicKey.findProgramAddressSync(
    [Buffer.from("treasury")],
    program.programId
  );

  // nft
  const royalty = 10000;
  const name = "Fox #6116";
  const symbol = "FFF";
  const uri = "https://famousfoxes.com/metadata/6116.json";
  const nftMint = Keypair.generate();
  console.log("nftMint: ", nftMint.publicKey.toBase58());

  before(async () => {
    const signature = await provider.connection.requestAirdrop(
      taker.publicKey,
      LAMPORTS_PER_SOL * 10
    );
    await provider.connection.confirmTransaction(signature, "confirmed");
  });

  it("init platform", async () => {
    const ix = SystemProgram.transfer({
      fromPubkey: provider.publicKey,
      toPubkey: treasury,
      lamports: LAMPORTS_PER_SOL / 100,
    });

    const tx = await program.methods
      .initPlatform(null)
      .accounts({
        platform,
        treasury,
        admin: provider.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .preInstructions([ix])
      .rpc();

    console.log("Your transaction signature", tx);
  });

  it("Mint NFT", async () => {
    const [nftMetadata] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        MPL_TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        nftMint.publicKey.toBuffer(),
      ],
      MPL_TOKEN_METADATA_PROGRAM_ID
    );

    const [nftMasterEdition] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        MPL_TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        nftMint.publicKey.toBuffer(),
        Buffer.from("edition"),
      ],
      MPL_TOKEN_METADATA_PROGRAM_ID
    );

    const nftTokenAccount = getAssociatedTokenAddressSync(
      nftMint.publicKey,
      provider.publicKey
    );

    const tx = await program.methods
      .mintNft(name, symbol, uri, royalty)
      .accounts({
        nftMint: nftMint.publicKey,
        nftMetadata,
        nftMasterEdition,
        payer: provider.publicKey,
        token: nftTokenAccount,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenMetadataProgram: MPL_TOKEN_METADATA_PROGRAM_ID,
        sysvarInstructions: new PublicKey(
          "Sysvar1nstructions1111111111111111111111111"
        ),
      })
      .signers([nftMint])
      .rpc();

    console.log("Your transaction signature", tx);
  });

  it("Lock NFT", async () => {
    const price = new BN(LAMPORTS_PER_SOL);

    const nftTokenAccount = getAssociatedTokenAddressSync(
      nftMint.publicKey,
      provider.publicKey
    );

    const [vault] = PublicKey.findProgramAddressSync(
      [Buffer.from("nft_vault"), nftMint.publicKey.toBuffer()],
      program.programId
    );

    const [platform] = PublicKey.findProgramAddressSync(
      [Buffer.from("platform")],
      program.programId
    );

    const vaultTokenAccount = getAssociatedTokenAddressSync(
      nftMint.publicKey,
      vault,
      true
    );

    const tx = await program.methods
      .lockNft(price)
      .accounts({
        nftMint: nftMint.publicKey,
        nftTokenAccount,
        vault,
        vaultTokenAccount,
        platform,
        treasury,
        maker: provider.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .rpc();

    console.log("Your transaction signature", tx);
  });

  it.skip("Unlock NFT success", async () => {
    try {
      const nftTokenAccount = getAssociatedTokenAddressSync(
        nftMint.publicKey,
        provider.publicKey
      );

      const [vault] = PublicKey.findProgramAddressSync(
        [Buffer.from("nft_vault"), nftMint.publicKey.toBuffer()],
        program.programId
      );

      const vaultTokenAccount = getAssociatedTokenAddressSync(
        nftMint.publicKey,
        vault,
        true
      );

      const tx = await program.methods
        .unlockNft()
        .accounts({
          nftMint: nftMint.publicKey,
          nftTokenAccount,
          vault,
          vaultTokenAccount,
          payer: provider.publicKey,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .rpc();

      console.log("Your transaction signature", tx);
    } catch (error) {
      console.error(error);
    }
  });

  it.skip("Re-Lock NFT", async () => {
    const price = new BN(LAMPORTS_PER_SOL / 1000);

    const nftTokenAccount = getAssociatedTokenAddressSync(
      nftMint.publicKey,
      provider.publicKey
    );

    const [vault] = PublicKey.findProgramAddressSync(
      [Buffer.from("nft_vault"), nftMint.publicKey.toBuffer()],
      program.programId
    );

    const [platform] = PublicKey.findProgramAddressSync(
      [Buffer.from("platform")],
      program.programId
    );

    const vaultTokenAccount = getAssociatedTokenAddressSync(
      nftMint.publicKey,
      vault,
      true
    );

    const tx = await program.methods
      .lockNft(price)
      .accounts({
        nftMint: nftMint.publicKey,
        nftTokenAccount,
        vault,
        vaultTokenAccount,
        platform,
        treasury,
        maker: provider.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .rpc();

    console.log("Your transaction signature", tx);
  });

  it("Swap NFT", async () => {
    const nftTokenAccount = getAssociatedTokenAddressSync(
      nftMint.publicKey,
      taker.publicKey
    );

    const [vault] = PublicKey.findProgramAddressSync(
      [Buffer.from("nft_vault"), nftMint.publicKey.toBuffer()],
      program.programId
    );

    const vaultTokenAccount = getAssociatedTokenAddressSync(
      nftMint.publicKey,
      vault,
      true
    );

    const tx = await program.methods
      .swap()
      .accounts({
        nftMint: nftMint.publicKey,
        nftTokenAccount,
        vault,
        vaultTokenAccount,
        taker: taker.publicKey,
        maker: provider.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .signers([taker])
      .rpc();

    console.log("Your transaction signature", tx);
  });
});
