import EpochTable from "@/components/epoch-table"
import { SiteHeader } from "@/components/site-header"
import TickStats from "@/components/tick-stats"
import { Button } from "@/components/ui/button"
import UserStats from "@/components/user-stats"

export default function Home() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
          <TickStats />
          <div>
            <Button>Mint</Button>
          </div>
          <UserStats />
          <EpochTable />
    </section>
  )
}
