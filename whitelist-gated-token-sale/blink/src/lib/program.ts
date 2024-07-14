import { AnchorProvider, Program } from "@coral-xyz/anchor";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { connection } from "./connection";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { getMerkleProof } from "./merkle-tree";
import { BN } from "bn.js";
import {
  IDL,
  WhitelistGatedTokenSale,
} from "@/types/whitelist_gated_token_sale";

export const PROGRAM_ID = new PublicKey(
  "GBTyYgyndirv9GVDiLsD1Ym7Z2PSLG5Ffm2maN5UWEhi"
);

export const MINT_TOKEN = new PublicKey(
  "7igtHwWhipfmUaVUmB9wR7pQLWmRZ76iZzuanAdY2oNK"
);

export const allowAddresses = [
  "63EEC9FfGyksm7PkVC6z8uAmqozbQcTzbkWJNsgqjkFs",
  "5AHKzmDcjeAAnafTivi5u7dWYw3jUQh2VBRDzSd9ztVr",
  "CDXLgstdVZJ7qUh3DC1mAGuCmTM3UiS1M24m44t3UViS",
  "3hZu5KH5CSAtnfERxbKnFMTRy1VwPkyEphkm2PRfZjTB",
  "6Bs6sz85RQtBVRsnsH11qSxmuR326S5jguEQVK7T73NJ",
];

export default class WhitelistGatedTokenSaleProgram {
  program: Program<WhitelistGatedTokenSale>;

  constructor() {
    const provider = new AnchorProvider(
      connection,
      new NodeWallet(Keypair.generate()),
      {
        preflightCommitment: "recent",
        commitment: "confirmed",
      }
    );

    this.program = new Program(IDL, PROGRAM_ID, provider);
  }

  async getMintInfo() {
    const [config] = PublicKey.findProgramAddressSync(
      [Buffer.from("config")],
      this.program.programId
    );

    const configAccount = await this.program.account.config.fetch(config);

    return {
      price: configAccount.tokenPrice,
      limitPerWallet: configAccount.limitPerWallet,
    };
  }

  async getMintTokenTx(minter: PublicKey, amount: number) {
    const [mintCounter] = PublicKey.findProgramAddressSync(
      [Buffer.from("mint_counter"), minter.toBuffer()],
      this.program.programId
    );

    const [config] = PublicKey.findProgramAddressSync(
      [Buffer.from("config")],
      this.program.programId
    );

    const proof = getMerkleProof(allowAddresses, minter.toBase58());

    const minterTokenAccount = getAssociatedTokenAddressSync(
      MINT_TOKEN,
      minter
    );

    return this.program.methods
      .mintToken(proof as any, new BN(amount))
      .accounts({
        config,
        mintCounter,
        mint: MINT_TOKEN,
        minterTokenAccount,
        minter,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .instruction();
  }
}
