import { AnchorProvider, BN, Program } from "@coral-xyz/anchor"
import { MARKETPLACE_PROGRAM_ID, MARKETPLACE_NAME, MPL_TOKEN_METADATA_ID } from "@/config/constant"
import { AnchorMarketplace, IDL } from "@/types/marketplace"
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js"
import { ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from "@solana/spl-token"

export const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL!)

export class MarketplaceProgram {
  program: Program<AnchorMarketplace>

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

    this.program = new Program<AnchorMarketplace>(IDL, MARKETPLACE_PROGRAM_ID, innerProvider)
  }

  async init({ admin }: { admin: PublicKey }) {
    const [marketplace] = PublicKey.findProgramAddressSync(
      [Buffer.from("marketplace"), Buffer.from(MARKETPLACE_NAME)],
      this.program.programId
    )

    const [rewardsMint] = PublicKey.findProgramAddressSync(
      [Buffer.from("rewards"), marketplace.toBuffer()],
      this.program.programId
    )

    const [treasury] = PublicKey.findProgramAddressSync(
      [Buffer.from("treasury"), marketplace.toBuffer()],
      this.program.programId
    )

    const ix = SystemProgram.transfer({
      fromPubkey: admin,
      toPubkey: treasury,
      lamports: LAMPORTS_PER_SOL / 100,
    })

    try {
      return this.program.methods
        .initialize(MARKETPLACE_NAME, 10)
        .accounts({
          admin,
          marketplace,
          rewardsMint,
          treasury,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .preInstructions([ix])
        .rpc()
    } catch (error) {
      console.error(error)
    }
  }

  listing({
    maker,
    nftMint,
    collectionMint,
    price,
  }: {
    maker: PublicKey
    nftMint: PublicKey
    collectionMint: PublicKey
    price: BN
  }) {
    const [marketplace] = PublicKey.findProgramAddressSync(
      [Buffer.from("marketplace"), Buffer.from(MARKETPLACE_NAME)],
      this.program.programId
    )

    const [listing] = PublicKey.findProgramAddressSync(
      [marketplace.toBuffer(), nftMint.toBuffer()],
      this.program.programId
    )

    const makerAta = getAssociatedTokenAddressSync(nftMint, maker)

    const vault = getAssociatedTokenAddressSync(nftMint, listing, true)

    const [metadata] = PublicKey.findProgramAddressSync(
      [Buffer.from("metadata"), MPL_TOKEN_METADATA_ID.toBuffer(), nftMint.toBuffer()],
      MPL_TOKEN_METADATA_ID
    )

    const [masterEdition] = PublicKey.findProgramAddressSync(
      [Buffer.from("metadata"), MPL_TOKEN_METADATA_ID.toBuffer(), nftMint.toBuffer(), Buffer.from("edition")],
      MPL_TOKEN_METADATA_ID
    )

    return this.program.methods
      .list(price)
      .accounts({
        maker,
        marketplace,
        makerMint: nftMint,
        collectionMint,
        makerAta,
        vault,
        listing,
        metadata,
        masterEdition,
        metadataProgram: MPL_TOKEN_METADATA_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc()
  }

  delist({ maker, nftMint }: { maker: PublicKey; nftMint: PublicKey }) {
    const [marketplace] = PublicKey.findProgramAddressSync(
      [Buffer.from("marketplace"), Buffer.from(MARKETPLACE_NAME)],
      this.program.programId
    )

    const [listing] = PublicKey.findProgramAddressSync(
      [marketplace.toBuffer(), nftMint.toBuffer()],
      this.program.programId
    )

    const makerAta = getAssociatedTokenAddressSync(nftMint, maker)

    const vault = getAssociatedTokenAddressSync(nftMint, listing, true)

    return this.program.methods
      .delist()
      .accounts({
        maker,
        marketplace,
        makerMint: nftMint,
        makerAta,
        listing,
        vault,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc()
  }

  purchaseMethodBuiler({ maker, taker, nftMint }: { maker: PublicKey; taker: PublicKey; nftMint: PublicKey }) {
    const [marketplace] = PublicKey.findProgramAddressSync(
      [Buffer.from("marketplace"), Buffer.from(MARKETPLACE_NAME)],
      this.program.programId
    )

    const [listing] = PublicKey.findProgramAddressSync(
      [marketplace.toBuffer(), nftMint.toBuffer()],
      this.program.programId
    )

    const takerAta = getAssociatedTokenAddressSync(nftMint, taker)

    const vault = getAssociatedTokenAddressSync(nftMint, listing, true)

    const [rewards] = PublicKey.findProgramAddressSync(
      [Buffer.from("rewards"), marketplace.toBuffer()],
      this.program.programId
    )

    const [treasury] = PublicKey.findProgramAddressSync(
      [Buffer.from("treasury"), marketplace.toBuffer()],
      this.program.programId
    )

    return this.program.methods.purchase().accounts({
      maker,
      taker,
      marketplace,
      makerMint: nftMint,
      takerAta,
      vault,
      listing,
      rewards,
      treasury,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
  }

  purchase({ maker, taker, nftMint }: { maker: PublicKey; taker: PublicKey; nftMint: PublicKey }) {
    return this.purchaseMethodBuiler({ maker, taker, nftMint }).rpc()
  }

  async getListings() {
    return this.program.account.listing.all()
  }

  async getListing(address: PublicKey) {
    return this.program.account.listing.fetch(address)
  }
}
