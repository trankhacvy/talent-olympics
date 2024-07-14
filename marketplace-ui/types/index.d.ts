import { PublicKey } from "@solana/web3.js"
import BN from "bn.js"

export type SiteConfig = {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter: string
    github: string
  }
}


export type Listing = {
  address: PublicKey
  maker: PublicKey
  price: BN
  mint: PublicKey
  asset: {
    name: string
    image: string
  }
}
