import { AnchorProvider, Wallet } from "@coral-xyz/anchor"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"

export function useProvider() {
  const { connection } = useConnection()
  const wallet = useWallet()

  return new AnchorProvider(connection, wallet as unknown as Wallet, {
    commitment: "confirmed",
  })
}
