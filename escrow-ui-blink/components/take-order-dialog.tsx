import { useWallet } from "@solana/wallet-adapter-react"
import { useState } from "react"
import { mutate } from "swr"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { queryKeys } from "@/config/query-keys"
import { useProvider } from "@/hooks/use-provider"
import { EscrowProgram } from "@/lib/program"
import { Escrow } from "@/types"
import { Typography } from "./ui/typography"
import { useToast } from "./ui/use-toast"

type TakeOrderDialogProps = {
  escrow: Escrow
}

export default function TakeOrderDialog({ escrow }: TakeOrderDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { publicKey } = useWallet()
  const provider = useProvider()

  async function handleTakeOrder() {
    try {
      if (!publicKey) {
        alert("Please connect to your wallet first")
        return
      }
      setLoading(true)

      const program = new EscrowProgram(provider)

      await program.take({
        maker: escrow.maker,
        taker: publicKey,
        mintA: escrow.mintA,
        mintB: escrow.mintB,
        seed: escrow.seed,
      })

      toast({
        title: "Swap successful.",
        variant: "success",
      })

      await mutate(queryKeys.allEscrows)

      setOpen(false)
    } catch (error: any) {
      toast({
        title: error?.message || "Unknown error",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button fullWidth>Take it</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Order</AlertDialogTitle>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <Typography color="secondary">Your send</Typography>
              <Typography className="font-semibold">
                {escrow.expectedAmountToReceive} {escrow.mintBToken.symbol}
              </Typography>
            </div>
            <div className="flex items-center justify-between">
              <Typography color="secondary">You receive</Typography>
              <Typography className="font-semibold">
                {escrow.deposit} {escrow.mintAToken.symbol}
              </Typography>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={handleTakeOrder} loading={loading}>
            Accept
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
