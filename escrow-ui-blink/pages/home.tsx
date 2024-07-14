import NewOrderDialog from "@/components/new-order-dialog"
import OrderList from "@/components/order-list"
import { Typography } from "@/components/ui/typography"

export default function HomePage() {
  return (
    <div className="w-full">
      <div className="mb-10 flex items-center justify-between">
        <Typography as="h2" level="h6" className="font-bold">
          Orders
        </Typography>
        <NewOrderDialog />
      </div>

      <OrderList />
    </div>
  )
}
