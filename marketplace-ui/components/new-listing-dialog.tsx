"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import useSWR from "swr"
import { mutate } from "swr"
import { DAS } from "helius-sdk"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/alert-dialog"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "./ui/use-toast"
import { useProvider } from "@/hooks/use-provider"
import { useWallet } from "@solana/wallet-adapter-react"
import { useState } from "react"
import { queryKeys } from "@/config/query-keys"
import { Card, CardContent } from "./ui/card"
import { cn } from "@/utils/cn"
import Image from "next/image"
import { helius } from "@/lib/helius"
import { Label } from "./ui/label"
import { MarketplaceProgram } from "@/lib/program"
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import { BN } from "bn.js"
import { PlusIcon } from "lucide-react"
import { Skeleton } from "./ui/skeleton"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"

const FormSchema = z.object({
  price: z.coerce.number().gt(0),
})

export default function NewListingDialog() {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const { publicKey } = useWallet()
  const provider = useProvider()

  const [selectedNFT, setSelectedNFT] = useState<DAS.GetAssetResponse | null>(null)

  const { data: nfts, isLoading } = useSWR(
    publicKey && open ? queryKeys.userNfts(publicKey.toBase58()) : null,
    async () => {
      const result = await helius.rpc.getAssetsByOwner({
        ownerAddress: publicKey?.toBase58() ?? "",
        page: 1,
        limit: 1000,
        displayOptions: {
          showCollectionMetadata: true,
          showUnverifiedCollections: false,
        },
      })

      return result.items.filter(
        (item) => item.interface === "V1_NFT" && !item.compression?.compressed && (item.grouping?.length ?? 0) > 0
      )
    },
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  )

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      if (!publicKey) {
        alert("Please connect to your wallet first")
        return
      }

      if (!selectedNFT) {
        alert("Please select the NFT you want to list")
        return
      }

      const collection = selectedNFT.grouping?.find((group) => group.group_key === "collection")

      if (!collection) {
        alert("No collection")
        return
      }

      const program = new MarketplaceProgram(provider)

      const tx = await program.listing({
        maker: publicKey,
        nftMint: new PublicKey(selectedNFT.id),
        collectionMint: new PublicKey(collection.group_value),
        price: new BN(data.price * LAMPORTS_PER_SOL),
      })

      console.log(tx)

      toast({
        title: "Your NFT has been successfully listed on the marketplace",
        variant: "success",
      })

      await mutate(queryKeys.allListings)

      setOpen(false)

      setTimeout(() => {
        form.reset()
      }, 200)
    } catch (error: any) {
      console.error(error)
      toast({
        title: error?.message || "Unknown error",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button startDecorator={<PlusIcon />}>New listing</Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>New listing</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="flex-[2]">
                    <FormLabel>Price (SOL)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter price" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label>NFT</Label>

                <ScrollArea className="-mx-6 max-w-lg whitespace-nowrap">
                  <div className="flex w-max space-x-4 px-6">
                    {isLoading
                      ? Array.from({ length: 5 }).map((_, index) => (
                          <div className="aspect-square w-56" key={index}>
                            <Skeleton className="h-full w-full" />
                          </div>
                        ))
                      : nfts?.map((asset) => (
                          <NFTCard
                            asset={asset}
                            className={selectedNFT?.id === asset.id ? "w-56 border-2 border-black" : "w-56"}
                            width={150}
                            height={150}
                            onClick={() => setSelectedNFT(asset)}
                          />
                        ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" loading={form.formState.isSubmitting}>
                List
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

interface NFTCardProps extends React.HTMLAttributes<HTMLDivElement> {
  asset: DAS.GetAssetResponse
  aspectRatio?: "portrait" | "square"
  width?: number
  height?: number
}

function NFTCard({ asset, aspectRatio = "square", width, height, className, ...props }: NFTCardProps) {
  return (
    <Card className={className} {...props}>
      <CardContent className="border-primary-500 flex aspect-square items-center justify-center p-3">
        <div className="space-y-3">
          <div className="overflow-hidden rounded-md">
            <Image
              src={asset.content?.files?.[0].uri ?? ""}
              alt={asset.content?.metadata.name ?? ""}
              width={width}
              height={height}
              className={cn(
                "h-auto w-auto bg-gray-100 object-cover transition-all hover:scale-105",
                aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
              )}
            />
          </div>
          <div className="space-y-1 text-sm">
            <h3 className="line-clamp-1 font-medium leading-none">{asset.content?.metadata.name}</h3>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
