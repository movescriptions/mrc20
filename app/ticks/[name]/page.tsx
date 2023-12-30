'use client';

import EpochTable from "@/components/epoch-table"
import { SiteHeader } from "@/components/site-header"
import TickStats from "@/components/tick-stats"
import { Button } from "@/components/ui/button"
import UserStats from "@/components/user-stats"
import { useState } from "react"
import { useWallet } from "@suiet/wallet-kit"
import { TransactionBlock } from '@mysten/sui.js/transactions'

const PACKAGE_ID = '0x6c995291a90cb0c2142f95706c54b3ecf7fd46ef4189a2318b442afbd5ad7f2f'
const DEPLOY_RECORD = '0xc7e804a1fd593321514255a944bd51c0edcad85fabefafc629ff68daec002993'
const TICK_RECORD = '0xfb7de210354b1b559536edf2de4020966025e1bd7b21dc84be5cc24264ea7c76'

export default function Home() {
    const { connected, address, signAndExecuteTransactionBlock } = useWallet()
    const [refreshData, setRefreshData] = useState(false)
  
    const mint = async (tick: string) => {
        if (!connected) return
    
        // define a programmable transaction
        const tx = new TransactionBlock()
        const [coin] = tx.splitCoins(tx.gas, [
          tx.pure(1000),
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
            <Button size={'lg'} onClick={() => mint('MOVES')}>Mint</Button>
          </div>
          <UserStats />
          <EpochTable />
    </section>
  )
}
