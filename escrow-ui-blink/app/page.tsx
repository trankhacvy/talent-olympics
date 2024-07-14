import NewOrderDialog from "@/components/new-order-dialog"
import OrderList from "@/components/order-list"
import { Statistics } from "@/components/statistics"

export default function HomePage() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
        </div>
      </div>

      <Statistics />

      <div className="flex items-center justify-between space-y-2 mb-6">
        <h2 className="text-2xl font-bold tracking-tight">All orders</h2>
        <div className="flex items-center space-x-2">
          <NewOrderDialog />
        </div>
      </div>

      <OrderList />
    </div>
  )
}
