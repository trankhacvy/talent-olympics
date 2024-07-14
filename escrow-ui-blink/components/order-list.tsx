"use client"

import { useEscrows } from "@/hooks/use-escrows"
import OrderCard, { OrderCardSkeleton } from "./order-card"

export default function OrderList() {
  const { data: escrows, isLoading } = useEscrows()

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
      {isLoading
        ? Array.from({ length: 3 }).map((_, idx) => <OrderCardSkeleton key={idx} />)
        : escrows?.map((escrow) => <OrderCard key={escrow.address.toBase58()} escrow={escrow} />)}
    </div>
  )
}
