import { IdlAccounts } from "@coral-xyz/anchor"
import {
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
  ActionGetResponse,
  ActionPostRequest,
} from "@solana/actions"

import { LAMPORTS_PER_SOL, PublicKey, Transaction } from "@solana/web3.js"
import { connection, MarketplaceProgram } from "@/lib/program"
import { AnchorMarketplace } from "@/types/marketplace"
import { helius } from "@/lib/helius"
import { NextResponse } from "next/server"

type Params = {
  address: string
}

const Response = NextResponse

export const GET = async (_req: Request, context: { params: Params }) => {
  try {
    const payload: ActionGetResponse = {
      title: "Talent Olympics Marketplace",
      icon: "https://earn.superteam.fun/assets/hackathon/talent-olympics/bg.png",
      description: "Talent Olympics Marketplace",
      label: "Purchase",
    }

    let listingAddress: PublicKey | null = null

    try {
      listingAddress = new PublicKey(context.params.address)
    } catch (error) {
      // just ignore
    }

    if (!listingAddress) {
      payload.label = "Invalid listing address"
      payload.disabled = true

      return Response.json(payload, {
        headers: ACTIONS_CORS_HEADERS,
      })
    }

    const program = new MarketplaceProgram()
    let listing: IdlAccounts<AnchorMarketplace>["listing"] | null = null

    try {
      listing = await program.getListing(listingAddress)
    } catch (error) {
      // just ignore
    }

    if (!listing) {
      payload.label = "Invalid listing address"
      payload.disabled = true

      return Response.json(payload, {
        headers: ACTIONS_CORS_HEADERS,
      })
    }

    const asset = await helius.rpc.getAsset({ id: listing.mint.toBase58() })

    payload.title = asset.content?.metadata?.name ?? "NFT name"
    payload.icon = asset.content?.files?.[0].uri ?? payload.icon
    payload.description = asset.content?.metadata?.description ?? ""
    payload.label = `Purchase (${listing.price.toNumber() / LAMPORTS_PER_SOL} SOL)`

    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    })
  } catch (err) {
    console.log(err)
    let message = "An unknown error occurred"
    if (typeof err == "string") message = err
    return new Response(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    })
  }
}

export const OPTIONS = GET

export const POST = async (req: Request, context: { params: Params }) => {
  try {
    const body = (await req.json()) as ActionPostRequest

    let taker: PublicKey
    try {
      taker = new PublicKey(body.account)
    } catch (err) {
      return new Response('Invalid "account" provided', {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      })
    }

    let listingAddress: PublicKey | null = null

    try {
      listingAddress = new PublicKey(context.params.address)
    } catch (error) {
      // just ignore
    }

    if (!listingAddress) {
      return new Response("Invalid listing address", {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      })
    }

    const program = new MarketplaceProgram()
    let listing: IdlAccounts<AnchorMarketplace>["listing"] | null = null

    try {
      listing = await program.getListing(listingAddress)
    } catch (error) {
      // just ignore
    }

    if (!listing) {
      return new Response("Invalid listing address", {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      })
    }

    if (listing.maker.toBase58() === taker.toBase58()) {
      return new Response("It's your listing", {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      })
    }

    const ix = await program.purchaseMethodBuiler({
      maker: listing.maker,
      taker,
      nftMint: listing.mint,
    })

    const transaction = new Transaction()
    transaction.add(await ix.instruction())
    transaction.feePayer = taker
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: `Thank you`,
      },
    })

    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    })
  } catch (err) {
    console.log(err)
    let message = "An unknown error occurred"
    if (typeof err == "string") message = err
    return new Response(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    })
  }
}
