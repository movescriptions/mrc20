'use client';

import EpochTable from "@/components/epoch-table"
import { SiteHeader } from "@/components/site-header"
import TickStats from "@/components/tick-stats"
import { Button } from "@/components/ui/button"
import UserStats from "@/components/user-stats"
import { useState } from "react"
import { useWallet } from "@suiet/wallet-kit"
import { TransactionBlock } from '@mysten/sui.js/transactions'

const PACKAGE_ID = '0xe586ecee5a848f304db9504ffe2ba529623047467edeb0d3fe1fe486a8b8b04c'
const DEPLOY_RECORD = '0x810790bf87223f5733cd6937d42ed9186c79d3f7f0bde98d18565054d526644f'
const TICK_RECORD = '0xe0420fd06b5e14c1d79dab3542aa869deb9a2dd0469ef155e1a85453da1a034c'

export default function Home({ params }: { params: { slug: string } }) {
    const { connected, address, signAndExecuteTransactionBlock } = useWallet()
    const [refreshData, setRefreshData] = useState(false)
    const name = params.name
  
    const mint = async (tick: string) => {
        if (!connected) return
    
        // define a programmable transaction
        const tx = new TransactionBlock()
        const [coin] = tx.splitCoins(tx.gas, [
          tx.pure(2000),
        ])
    
        tx.moveCall({
          target: `${PACKAGE_ID}::inscription::mint`,
          arguments: [
            tx.object(TICK_RECORD),
            tx.pure(tick),
            coin,
            tx.pure("0x6")
          ],
          typeArguments: [],
        })
    
        try {
          // execute the programmable transaction
          const resData = await signAndExecuteTransactionBlock({
            // @ts-ignore
            transactionBlock: tx,
          })
          console.log(`mint ${tick} successfully!`, resData)
        } catch (e) {
          console.error(`mint ${tick} failed`, e)
        }
    }
    
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
          <TickStats />
          <div className="flex flex-row justify-center">
            <Button size={'lg'} onClick={() => mint(name)}>Mint</Button>
          </div>
          <UserStats />
          <EpochTable />
    </section>
  )
}
