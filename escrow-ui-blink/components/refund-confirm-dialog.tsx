import { useWallet } from "@solana/wallet-adapter-react"
import { useState } from "react"
import { mutate } from "swr"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
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
import { useToast } from "./ui/use-toast"

export default function RefundConfirmDialog({ escrow }: { escrow: Escrow }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { publicKey } = useWallet()
  const provider = useProvider()

  async function handleRefund() {
    try {
      if (!publicKey) {
        alert("Please connect to your wallet first")
        return
      }
      setLoading(true)

      const program = new EscrowProgram(provider)

      await program.refund({
        maker: publicKey,
        mintA: escrow.mintA,
        seed: escrow.seed,
      })

      toast({
        title: "Your order has been canceled and your deposit has been refunded.",
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
        <Button fullWidth>Refund</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your order and refund your deposit token.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={handleRefund} loading={loading}>
            Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
