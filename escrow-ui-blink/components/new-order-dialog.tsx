"use client"

import { BN } from "@coral-xyz/anchor"
import { zodResolver } from "@hookform/resolvers/zod"
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { PlusIcon } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { mutate } from "swr"
import { z } from "zod"

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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { queryKeys } from "@/config/query-keys"
import { tokenList } from "@/config/tokens"
import { useProvider } from "@/hooks/use-provider"
import { EscrowProgram } from "@/lib/program"
import { Input } from "./ui/input"
import { useToast } from "./ui/use-toast"

const FormSchema = z.object({
  deposit: z.coerce.number().gt(0),
  token: z.string().min(1, "Token is required"),
  expectedAmountToReceive: z.coerce.number().gt(0),
  expectedTokenToReceive: z.string().min(1, "Token is required"),
})

export default function NewOrderDialog() {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const { publicKey } = useWallet()
  const provider = useProvider()

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
      const program = new EscrowProgram(provider)

      const depositToken = tokenList.find((token) => token.address === data.token)
      const expectedTokenToReceive = tokenList.find((token) => token.address === data.expectedTokenToReceive)

      const depositAmount = new BN(data.deposit * 10 ** depositToken!.decimals)
      const expectedAmountToReceive = new BN(data.expectedAmountToReceive * 10 ** expectedTokenToReceive!.decimals)

      await program.make({
        maker: publicKey,
        mintA: new PublicKey(depositToken?.address!),
        mintB: new PublicKey(expectedTokenToReceive?.address!),
        depositAmount,
        expectedAmountToReceive,
      })

      toast({
        title: "Your order has been created successfully",
        variant: "success",
      })

      await mutate(queryKeys.allEscrows)

      setOpen(false)

      setTimeout(() => {
        form.reset()
      }, 200)
    } catch (error: any) {
      toast({
        title: error?.message || "Unknown error",
        variant: "destructive",
      })
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button startDecorator={<PlusIcon />}>New Escrow</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-xl">
        <button
          onClick={() =>
            toast({
              title: "Your order has been created successfully",
              variant: "success",
            })
          }
        >
          Ok
        </button>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <AlertDialogHeader>
              <AlertDialogTitle>New order</AlertDialogTitle>
              <div className="space-y-6">
                <div className="flex gap-4">
                  {/* deposit */}
                  <FormField
                    control={form.control}
                    name="deposit"
                    render={({ field }) => (
                      <FormItem className="flex-[2]">
                        <FormLabel>Deposit amount</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter amount" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* token */}
                  <FormField
                    control={form.control}
                    name="token"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Token</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select token" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tokenList.map((token) => (
                              <SelectItem value={token.address}>{token.symbol}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-4">
                  {/* expect */}
                  <FormField
                    control={form.control}
                    name="expectedAmountToReceive"
                    render={({ field }) => (
                      <FormItem className="flex-[2]">
                        <FormLabel>Expected tokens to receive</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter amount" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* token */}
                  <FormField
                    control={form.control}
                    name="expectedTokenToReceive"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Token</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select token" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tokenList.map((token) => (
                              <SelectItem value={token.address}>{token.symbol}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button variant="outline">Cancel</Button>
              </AlertDialogCancel>
              <Button loading={form.formState.isSubmitting} type="submit">
                Create
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
