import useSWR from "swr"
import { connection, EscrowProgram } from "@/lib/program"
import { queryKeys } from "@/config/query-keys"
import { useProvider } from "./use-provider"
import { tokenList } from "@/config/tokens"
import { getAssociatedTokenAddressSync } from "@solana/spl-token"
import { Escrow } from "@/types"
import { BN } from "bn.js"

export function useEscrows() {
  const provider = useProvider()

  return useSWR<Escrow[]>(
    queryKeys.allEscrows,
    async () => {
      const program = new EscrowProgram(provider)
      const escrows = await program.getAllEscrows()

      const promises = escrows.map(async (escrow) => {
        const { account, publicKey } = escrow
        const mintAToken = tokenList.find((token) => token.address === escrow.account.mintA.toBase58())!
        const mintBToken = tokenList.find((token) => token.address === escrow.account.mintB.toBase58())!

        const vault = getAssociatedTokenAddressSync(escrow.account.mintA, escrow.publicKey, true)
        const deposit = await connection.getTokenAccountBalance(vault)
        const expectedAmountToReceive = account.receive.div(new BN(10 ** mintBToken.decimals)).toNumber()

        return {
          address: publicKey,
          maker: account.maker,
          mintA: account.mintA,
          mintAToken,
          mintB: account.mintB,
          mintBToken,
          seed: account.seed,
          deposit: deposit.value.uiAmount ?? 0,
          expectedAmountToReceive,
        } as Escrow
      })

      return Promise.all(promises)
    },
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  )
}
