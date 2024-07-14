import { Cluster } from "@solana/web3.js"

export function getExplorerUrl(address: string, cluster: Cluster = "devnet"): string {
  let suffix = `?cluster=${cluster}`

  return `https://explorer.solana.com/address/${address}${suffix}`
}
