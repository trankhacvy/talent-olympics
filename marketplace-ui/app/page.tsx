import NewListingDialog from "@/components/new-listing-dialog"
import NewListings from "@/components/new-listings"
import { Sidebar } from "@/components/sidebar"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export default function HomePage() {
  return (
    <div className="grid grid-cols-5">
      <Sidebar />
      <div className="col-span-4 lg:border-l">
        <div className="h-full px-4 py-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">Trending</h2>
            </div>
            <NewListingDialog />
          </div>
          <Separator className="my-4" />
          <NewListings />
          <div className="mt-6 space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">New Collections</h2>
          </div>
          <Separator className="my-4" />
          <div className="relative">
            <ScrollArea>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}
