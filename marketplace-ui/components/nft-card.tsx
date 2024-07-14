"use client"
import { mutate } from "swr"

import { Card, CardContent, CardFooter } from "@/components/ui/card"

import Image from "next/image"

import { cn } from "@/utils/cn"
import { Listing } from "@/types"
import { Button } from "./ui/button"
import { useWallet } from "@solana/wallet-adapter-react"
import { useState } from "react"
import { MarketplaceProgram } from "@/lib/program"
import { useToast } from "./ui/use-toast"
import { useProvider } from "@/hooks/use-provider"
import { queryKeys } from "@/config/query-keys"
import { IconButton } from "./ui/icon-button"
import { Share2Icon } from "lucide-react"

interface NFTCardProps extends React.HTMLAttributes<HTMLDivElement> {
  listing: Listing
  aspectRatio?: "portrait" | "square"
  width?: number
  height?: number
}

export function NFTCard({ listing, aspectRatio = "portrait", width, height, className, ...props }: NFTCardProps) {
  const [delisting, setDelisting] = useState(false)
  const [purchasing, setPurchasing] = useState(false)

  const { publicKey } = useWallet()
  const provider = useProvider()
  const { toast } = useToast()

  async function handleDelist() {
    try {
      if (!publicKey) {
        alert("Please connect to your wallet first")
        return
      }
      setDelisting(true)

      const program = new MarketplaceProgram(provider)

      const result = await program.delist({ maker: publicKey, nftMint: listing.mint })

      console.log(result)

      toast({
        title: "Delisted Successfully",
        description: "Your NFT has been successfully removed from the marketplace",
        variant: "success",
      })

      await mutate(queryKeys.allListings)
    } catch (error: any) {
      toast({
        title: error?.message || "Unknown error",
        variant: "destructive",
      })
    } finally {
      setDelisting(false)
    }
  }

  async function handlePurchase() {
    try {
      if (!publicKey) {
        alert("Please connect to your wallet first")
        return
      }
      setPurchasing(true)

      const program = new MarketplaceProgram(provider)

      const result = await program.purchase({ maker: listing.maker, taker: publicKey, nftMint: listing.mint })

      console.log(result)

      toast({
        title: "NFT Purchase Successful",
        description: "Congratulations! You've successfully purchased an NFT.",
        variant: "success",
      })

      await mutate(queryKeys.allListings)
    } catch (error: any) {
      toast({
        title: error?.message || "Unknown error",
        variant: "destructive",
      })
    } finally {
      setPurchasing(false)
    }
  }

  return (
    <Card className={className} {...props}>
      <CardContent className="grid gap-4 pt-6">
        <div className="overflow-hidden rounded-md">
          <Image
            src={listing.asset.image}
            alt={listing.asset.name}
            width={width}
            height={height}
            className={cn(
              "h-auto w-auto object-cover transition-all hover:scale-105",
              aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
            )}
          />
        </div>
        <div className="space-y-1 text-sm">
          <h3 className="font-medium leading-none">{listing.asset.name}</h3>
        </div>
      </CardContent>
      <CardFooter>
        {publicKey?.toBase58() !== listing.maker.toBase58() && (
          <Button onClick={handlePurchase} className="w-full" loading={purchasing}>
            Buy Now
          </Button>
        )}
        {publicKey?.toBase58() === listing.maker.toBase58() && (
          <Button className="w-full" onClick={handleDelist} loading={delisting}>
            Delist
          </Button>
        )}
        <a
          href={`https://dial.to/devnet?action=${encodeURI(
            `solana-action:${process.env.NEXT_PUBLIC_FE_URL}/api/item/${listing.address.toBase58()}`
          )}`}
          target="_blank"
          rel="noopener"
        >
          <IconButton>
            <Share2Icon />
          </IconButton>
        </a>
      </CardFooter>
    </Card>
  )
}
