import { ACTIONS_CORS_HEADERS, ActionsJson } from "@solana/actions"
import { NextResponse } from "next/server"

export const GET = async () => {
  const payload: ActionsJson = {
    rules: [],
  }

  return NextResponse.json(payload, {
    headers: ACTIONS_CORS_HEADERS,
  })
}

export const OPTIONS = GET
