"use client"

import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useWallet } from "@suiet/wallet-kit"
import { TransactionBlock } from '@mysten/sui.js/transactions'
import TickList from "@/components/tick-table"
import { Module } from "module"

const PACKAGE_ID = '0xa232b45b34e9048af210a78648ac01b178952270ae0b3758768528685c6c559f'
const DEPLOY_RECORD = '0xdcae58ee3c3829e10447c33df8f3ac1fabc5fa4d387be5edebfa641dd748466e'

export default function IndexPage() {
  const { connected, address, signAndExecuteTransactionBlock } = useWallet()
  const [refreshData, setRefreshData] = useState(false)

  const deploy_move = async () => {
    if (!connected) return

    // define a programmable transaction
    const tx = new TransactionBlock()

    tx.moveCall({
      target: `${PACKAGE_ID}::inscription::deploy`,
      arguments: [
        tx.object(DEPLOY_RECORD),
        tx.pure("move"),
        tx.pure(21000000),
        tx.pure(1000),
        tx.pure(0),
        tx.pure("")
      ],
      typeArguments: [],
    })

    try {
      // execute the programmable transaction
      const resData = await signAndExecuteTransactionBlock({
        // @ts-ignore
        transactionBlock: tx,
      })
      console.log('register dao successfully!', resData)
    } catch (e) {
      console.error('register dao failed', e)
    }
  }
  
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <TickList deploy_tick={deploy_move} />
    </section>
  )
}
