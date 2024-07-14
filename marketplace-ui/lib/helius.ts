import { Helius } from "helius-sdk"

export const helius = new Helius(process.env.NEXT_PUBLIC_HELIUS_API_KEY!, "devnet")
