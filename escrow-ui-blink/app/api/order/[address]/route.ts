import { IdlAccounts } from "@coral-xyz/anchor"
import {
  ActionGetResponse,
  ActionPostRequest,
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
} from "@solana/actions"

import { getAssociatedTokenAddressSync } from "@solana/spl-token"
import { PublicKey, Transaction } from "@solana/web3.js"
import { BN } from "bn.js"
import { tokenList } from "@/config/tokens"
import { connection, EscrowProgram } from "@/lib/program"
import { AnchorEscrow } from "@/types/escrow"
import { NextResponse } from "next/server"

type Params = {
  address: string
}

const Response = NextResponse

export const GET = async (_req: Request, context: { params: Params }) => {
  try {
    const payload: ActionGetResponse = {
      title: "Talent Olympics Escrow",
      icon: "https://i.ibb.co/3y5FZYY/Screenshot-2024-07-14-at-19-44-35.png",
      description: "Talent Olympics Escrow",
      label: "Take Order",
    }

    let orderAddress: PublicKey | null = null

    try {
      orderAddress = new PublicKey(context.params.address)
    } catch (error) {
      // just ignore
    }

    if (!orderAddress) {
      payload.label = "Invalid order address"
      payload.disabled = true

      return Response.json(payload, {
        headers: ACTIONS_CORS_HEADERS,
      })
    }

    const program = new EscrowProgram()

    let escrow: IdlAccounts<AnchorEscrow>["escrow"] | null = null

    try {
      escrow = await program.getEscrowByKey(orderAddress)
    } catch (error) {
      // just ignore
    }

    if (!escrow) {
      payload.label = "Invalid order address"
      payload.disabled = true

      return Response.json(payload, {
        headers: ACTIONS_CORS_HEADERS,
      })
    }

    const depositToken = tokenList.find((token) => token.address === escrow!.mintA.toBase58())!
    const expectedTokenToReceive = tokenList.find((token) => token.address === escrow!.mintB.toBase58())!

    const vault = getAssociatedTokenAddressSync(escrow!.mintA, orderAddress, true)
    const token = await connection.getTokenAccountBalance(vault)
    const expectedAmountToReceive = escrow!.receive.div(new BN(10 ** expectedTokenToReceive?.decimals!)).toNumber()

    const description = `You send: ${token.value.uiAmount} ${
      expectedTokenToReceive.symbol
    }\nYou receive: ${expectedAmountToReceive} ${depositToken.symbol}\nMaker: ${escrow!.maker.toBase58()}`
    payload.description = description

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

    let orderAddress: PublicKey | null = null

    try {
      orderAddress = new PublicKey(context.params.address)
    } catch (error) {
      // just ignore
    }

    if (!orderAddress) {
      return new Response("Invalid order address", {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      })
    }

    const program = new EscrowProgram()
    let escrow: IdlAccounts<AnchorEscrow>["escrow"] | null = null

    try {
      escrow = await program.getEscrowByKey(orderAddress)
    } catch (error) {
      // just ignore
    }

    if (!escrow) {
      return new Response("Invalid order address", {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      })
    }

    if (escrow.maker.toBase58() === taker.toBase58()) {
      return new Response("It's your order", {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      })
    }

    const ix = await program.takeIx({
      maker: escrow.maker,
      taker: taker,
      mintA: escrow.mintA,
      mintB: escrow.mintB,
      seed: escrow.seed,
    })

    const transaction = new Transaction()
    transaction.add(ix)
    
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
