import { AnchorProvider, BN, Program } from "@coral-xyz/anchor"
import { ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js"
import { ESCROW_PROGRAM_ID } from "@/config/constant"
import { AnchorEscrow, IDL } from "@/types/escrow"

export const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL!)

export class EscrowProgram {
  program: Program<AnchorEscrow>

  constructor(provider?: AnchorProvider) {
    let innerProvider

    if (provider) {
      innerProvider = provider
    } else {
      innerProvider = new AnchorProvider(
        connection,
        {
          signTransaction: connection.sendTransaction as any,
        } as any,
        {
          preflightCommitment: "recent",
          commitment: "confirmed",
        }
      )
    }

    this.program = new Program<AnchorEscrow>(IDL, ESCROW_PROGRAM_ID, innerProvider)
  }

  make({
    maker,
    mintA,
    mintB,
    depositAmount,
    expectedAmountToReceive,
  }: {
    maker: PublicKey
    mintA: PublicKey
    mintB: PublicKey
    depositAmount: BN
    expectedAmountToReceive: BN
  }) {
    const seed = new BN(Date.now())

    const makerAtaA = getAssociatedTokenAddressSync(mintA, maker)

    const escrow = PublicKey.findProgramAddressSync(
      [Buffer.from("escrow"), maker.toBuffer(), seed.toArrayLike(Buffer, "le", 8)],
      this.program.programId
    )[0]

    const vault = getAssociatedTokenAddressSync(mintA, escrow, true, TOKEN_PROGRAM_ID)

    return this.program.methods
      .make(seed, depositAmount, expectedAmountToReceive)
      .accounts({
        maker,
        mintA,
        mintB,
        makerAtaA,
        escrow,
        vault,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc()
  }

  refund({ maker, mintA, seed }: { maker: PublicKey; mintA: PublicKey; seed: BN }) {
    const makerAtaA = getAssociatedTokenAddressSync(mintA, maker)

    const escrow = PublicKey.findProgramAddressSync(
      [Buffer.from("escrow"), maker.toBuffer(), seed.toArrayLike(Buffer, "le", 8)],
      this.program.programId
    )[0]

    const vault = getAssociatedTokenAddressSync(mintA, escrow, true, TOKEN_PROGRAM_ID)

    return this.program.methods
      .refund()
      .accounts({
        maker,
        mintA,
        makerAtaA,
        escrow,
        vault,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc()
  }

  take({
    maker,
    taker,
    mintA,
    mintB,
    seed,
  }: {
    maker: PublicKey
    taker: PublicKey
    mintA: PublicKey
    mintB: PublicKey
    seed: BN
  }) {
    const makerAtaB = getAssociatedTokenAddressSync(mintB, maker)
    const takerAtaA = getAssociatedTokenAddressSync(mintA, taker)
    const takerAtaB = getAssociatedTokenAddressSync(mintB, taker)

    const escrow = PublicKey.findProgramAddressSync(
      [Buffer.from("escrow"), maker.toBuffer(), seed.toArrayLike(Buffer, "le", 8)],
      this.program.programId
    )[0]

    const vault = getAssociatedTokenAddressSync(mintA, escrow, true, TOKEN_PROGRAM_ID)

    return this.program.methods
      .take()
      .accounts({
        maker,
        taker,
        mintA,
        mintB,
        takerAtaA,
        takerAtaB,
        makerAtaB,
        escrow,
        vault,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc()
  }

  takeIx({
    maker,
    taker,
    mintA,
    mintB,
    seed,
  }: {
    maker: PublicKey
    taker: PublicKey
    mintA: PublicKey
    mintB: PublicKey
    seed: BN
  }) {
    const makerAtaB = getAssociatedTokenAddressSync(mintB, maker)
    const takerAtaA = getAssociatedTokenAddressSync(mintA, taker)
    const takerAtaB = getAssociatedTokenAddressSync(mintB, taker)

    const escrow = PublicKey.findProgramAddressSync(
      [Buffer.from("escrow"), maker.toBuffer(), seed.toArrayLike(Buffer, "le", 8)],
      this.program.programId
    )[0]

    const vault = getAssociatedTokenAddressSync(mintA, escrow, true, TOKEN_PROGRAM_ID)

    return this.program.methods
      .take()
      .accounts({
        maker,
        taker,
        mintA,
        mintB,
        takerAtaA,
        takerAtaB,
        makerAtaB,
        escrow,
        vault,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .instruction()
  }

  getAllEscrows() {
    return this.program.account.escrow.all()
  }

  getEscrowByKey(key: PublicKey) {
    return this.program.account.escrow.fetch(key)
  }
}
