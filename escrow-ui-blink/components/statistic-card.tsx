import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type StatisticCardProps = {
  title?: string
  value?: string
  diff?: string
  icon?: React.ReactNode
}

export function StatisticCard({ title, value, diff, icon }: StatisticCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{diff}</p>
      </CardContent>
    </Card>
  )
}
