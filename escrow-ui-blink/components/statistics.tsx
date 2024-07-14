"use client"

import { BN } from "bn.js"
import { LandmarkIcon } from "lucide-react"
import { useEscrows } from "@/hooks/use-escrows"
import { StatisticCard } from "./statistic-card"

export function Statistics() {
  const { data: escrows } = useEscrows()

  const tvl = escrows?.reduce((cur, item) => cur.add(new BN(item.deposit)), new BN(0))

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <StatisticCard
        title="Total Escrow"
        value={String(escrows?.length ?? 0)}
        icon={<LandmarkIcon />}
        diff="+20.1% from last month"
      />
      <StatisticCard
        title="Total Value Lock"
        value={String(tvl?.toNumber() ?? 0)}
        icon={<LandmarkIcon />}
        diff="+5% from last month"
      />
    </div>
  )
}
