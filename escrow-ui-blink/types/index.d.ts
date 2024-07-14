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

export type Token = {
  name: string
  symbol: string
  address: string
  isNative: boolean
  decimals: number
  icon: string
}

export type Escrow = {
  address: PublicKey
  maker: PublicKey
  mintA: PublicKey
  mintAToken: Token
  mintB: PublicKey
  mintBToken: Token
  seed: BN
  deposit: string | number
  expectedAmountToReceive: string | number
}
