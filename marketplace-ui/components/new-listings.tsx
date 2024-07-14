"use client"

import { NFTCard } from "@/components/nft-card"
import { queryKeys } from "@/config/query-keys"
import { useProvider } from "@/hooks/use-provider"
import { helius } from "@/lib/helius"
import { MarketplaceProgram } from "@/lib/program"
import { Listing } from "@/types"
import useSWR from "swr"
import { Skeleton } from "./ui/skeleton"

export default function NewListings() {
  const provider = useProvider()
  const { data: listings, isLoading } = useSWR<Listing[]>(queryKeys.allListings, async () => {
    const program = new MarketplaceProgram(provider)
    const listings = await program.getListings()

    const mints = listings.map((listing) => listing.account.mint)

    const assets = await helius.rpc.getAssetBatch({
      ids: mints.map((key) => key.toBase58()),
    })

    return listings
      .map((listing) => {
        const mint = listing.account.mint
        const asset = assets.find((asset) => asset.id === mint.toBase58())

        return {
          address: listing.publicKey,
          maker: listing.account.maker,
          price: listing.account.price,
          mint,
          asset: {
            name: asset?.content?.metadata.name ?? "",
            image: asset?.content?.links?.image ?? asset?.content?.files?.[0].uri ?? "",
          },
        }
      })
      .sort((a, b) => a.asset.name.localeCompare(b.asset.name))
  })

  return (
    <div className="relative grid grid-cols-3 gap-6">
      {isLoading
        ? Array.from({ length: 3 }).map((_, index) => (
            <div className="aspect-square w-[280px]" key={index}>
              <Skeleton className="h-full w-full" />
            </div>
          ))
        : listings?.map((listing) => (
            <NFTCard
              key={listing.address.toBase58()}
              listing={listing}
              className="w-full"
              aspectRatio="square"
              width={250}
              height={250}
            />
          ))}
    </div>
  )
}
