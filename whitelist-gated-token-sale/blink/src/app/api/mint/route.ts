import {
  ActionGetResponse,
  ActionPostRequest,
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
} from "@solana/actions";

import { LAMPORTS_PER_SOL, PublicKey, Transaction } from "@solana/web3.js";
import WhitelistGatedTokenSaleProgram from "@/lib/program";
import { NextResponse } from "next/server";
import { connection } from "@/lib/connection";

const Response = NextResponse;

export const GET = async (_req: Request) => {
  try {
    const { icon, title, description } = getTokenSaleInfo();

    const amountParameterName = "amount";

    const program = new WhitelistGatedTokenSaleProgram();

    const mintInfo = await program.getMintInfo();

    const response: ActionGetResponse = {
      icon,
      label: `Mint`,
      title,
      description,
      links: {
        actions: [
          {
            href: `/api/mint?amount={${amountParameterName}}`,
            label: `Mint (${mintInfo.price.toNumber() / LAMPORTS_PER_SOL} SOL)`,
            parameters: [
              {
                name: amountParameterName,
                label: "Enter amount",
              },
            ],
          },
        ],
      },
    };

    return Response.json(response, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new Response(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};

export const OPTIONS = GET;

export const POST = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);

    const amountStr = requestUrl.searchParams.get("amount");

    if (!amountStr) {
      return new Response("Invalid amount", {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    let amount = 0;

    try {
      amount = parseFloat(amountStr);
    } catch (error) {
      return new Response("Invalid amount", {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    if (amount <= 0) {
      return new Response("Invalid amount", {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const body: ActionPostRequest = await req.json();

    let minter: PublicKey;
    try {
      minter = new PublicKey(body.account);
    } catch (err) {
      return new Response('Invalid "account" provided', {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const program = new WhitelistGatedTokenSaleProgram();

    const ix = await program.getMintTokenTx(minter, amount);

    const transaction = new Transaction();
    transaction.add(ix);
    transaction.feePayer = minter;
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: `Purchase successfully`,
      },
    });

    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new Response(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};

function getTokenSaleInfo(): Pick<
  ActionGetResponse,
  "icon" | "title" | "description"
> {
  const icon =
    "https://earn.superteam.fun/assets/hackathon/talent-olympics/bg.png";

  const title = "Talent Olympics Token Sale";

  const description = "Complete Challenges. Earn Prizes. Get a Full-Time Job.";

  return { icon, title, description };
}
