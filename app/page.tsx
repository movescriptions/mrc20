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

const PACKAGE_ID = '0xe586ecee5a848f304db9504ffe2ba529623047467edeb0d3fe1fe486a8b8b04c'
const DEPLOY_RECORD = '0x810790bf87223f5733cd6937d42ed9186c79d3f7f0bde98d18565054d526644f'

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
        tx.pure("tests"),
        tx.pure(100_0000_0000),
        tx.pure(Date.now()+120000),
        tx.pure(60*24*15),
        tx.pure(1000),
        tx.pure(""),
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
      console.log('deploy successfully!', resData)
    } catch (e) {
      console.error('deploy failed', e)
    }
  }
  
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <TickList deploy_tick={deploy_move} />
    </section>
  )
}
