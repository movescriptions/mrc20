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

const PACKAGE_ID = '0x6c995291a90cb0c2142f95706c54b3ecf7fd46ef4189a2318b442afbd5ad7f2f'
const DEPLOY_RECORD = '0xc7e804a1fd593321514255a944bd51c0edcad85fabefafc629ff68daec002993'

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
        tx.pure("moves"),
        tx.pure(100_0000_0000),
        tx.pure(1704038400*1000),
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

  const mint = async (tick: string) => {
    if (!connected) return

    // define a programmable transaction
    const tx = new TransactionBlock()
    const [coin] = tx.splitCoins(tx.gas, [
      tx.pure(0),
    ])

    tx.moveCall({
      target: `${PACKAGE_ID}::inscription::mint`,
      arguments: [
        tx.object(DEPLOY_RECORD),
        tx.pure(tick),
        tx.pure(1000),
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
      <TickList deploy_tick={deploy_move} mint={mint} />
    </section>
  )
}
