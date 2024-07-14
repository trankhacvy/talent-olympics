import { useWallet } from "@solana/wallet-adapter-react"
import { ArrowLeftToLineIcon, ArrowRightToLineIcon, Share2Icon, UserIcon } from "lucide-react"
import { Escrow } from "@/types"
import { getExplorerUrl } from "@/utils/explorer"
import truncateWallet from "@/utils/truncate"
import RefundConfirmDialog from "./refund-confirm-dialog"
import TakeOrderDialog from "./take-order-dialog"
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Separator } from "./ui/separator"
import { Skeleton } from "./ui/skeleton"

export default function OrderCard({ escrow }: { escrow: Escrow }) {
  const { publicKey } = useWallet()

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">Escrow Address</p>
          <a
            className="underline"
            href={getExplorerUrl(escrow.address.toBase58())}
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="text-sm font-medium leading-none">{truncateWallet(escrow.address.toBase58(), 12, true)}</p>
          </a>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">Seeds</p>
          <p className="text-sm font-medium leading-none">{escrow.seed.toString()}</p>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="py-3 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <UserIcon className="size-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Maker</p>
          </div>

          <a
            className="underline"
            href={getExplorerUrl(escrow.maker.toBase58())}
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="text-sm font-medium leading-none">{truncateWallet(escrow.maker.toBase58(), 12, true)}</p>
          </a>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ArrowRightToLineIcon className="size-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Depisit Amount</p>
          </div>
          <div className="flex items-center gap-1">
            <p className="text-sm font-medium leading-none">{escrow.deposit}</p>
            <img src={escrow.mintAToken.icon} className="size-5 rounded-full object-cover" />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ArrowLeftToLineIcon className="size-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Expected Amount To Receive</p>
          </div>
          <div className="flex items-center gap-1">
            <p className="text-sm font-medium leading-none">{escrow.expectedAmountToReceive}</p>
            <img src={escrow.mintBToken.icon} className="size-5 rounded-full object-cover" />
          </div>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="pt-3 gap-4">
        {publicKey && publicKey.toBase58() === escrow.maker.toBase58() ? (
          <RefundConfirmDialog escrow={escrow} />
        ) : (
          <TakeOrderDialog escrow={escrow} />
        )}
        <a
          href={`https://dial.to/devnet?action=solana-action:${encodeURI(
            `${process.env.NEXT_PUBLIC_FE_URL!}/api/order/${escrow.address.toBase58()}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button size="icon">
            <Share2Icon className="size-5" />
          </Button>
        </a>
      </CardFooter>
    </Card>
  )
}

export function OrderCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <Skeleton className="w-1/2 h-4" />
        <Skeleton className="w-1/3 h-4" />
      </CardHeader>
      <CardContent className="py-3 space-y-4">
        <Skeleton className="w-1/2 h-4" />
        <Skeleton className="w-1/3 h-4" />
      </CardContent>
      <CardFooter className="pt-3 gap-4">
        <Skeleton className="w-1/2 h-4" />
        <Skeleton className="w-1/3 h-4" />
      </CardFooter>
    </Card>
  )
}
