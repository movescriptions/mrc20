"use client"

import {DEPLOY_RECORD, PACKAGE_ID} from "@/config/site"
import {useEffect, useState} from "react"
import {useWallet} from "@suiet/wallet-kit"
import {TransactionBlock} from '@mysten/sui.js/transactions'
import TickList from "@/components/tick-table"
import {getSuiDynamicFields} from "@/lib/apis"

export default function IndexPage() {
  const {connected, address, signAndExecuteTransactionBlock} = useWallet()
  const [loading, setLoading] = useState(false)
  const [ticks, setTicks] = useState([])
  const [refreshData, setRefreshData] = useState(false)
  const [openDeployTickModal, setOpenDeployTickModal] = useState(false)

  useEffect(() => {
    setLoading(true)
    getSuiDynamicFields(DEPLOY_RECORD, 'record').then((res) => {
      console.log(res)
      // @ts-ignore
      setTicks(res)
      setLoading(false)
    }).catch((err) => {
      console.log(err)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (refreshData) {
      setLoading(true)
      getSuiDynamicFields(DEPLOY_RECORD, 'record').then((res) => {
        // @ts-ignore
        setTicks(res)
        setLoading(false)
        setRefreshData(false)
      }).catch((err) => {
        console.log(err)
        setLoading(false)
        setRefreshData(false)
      })
    }
  }, [refreshData])

  const deploy_move = async (tick: string, fee_tick_record: string, fee_inscription: string, supply: number, ts: number, epoch: number, fee: number) => {
    if (!connected) return

    // define a programmable transaction
    const tx = new TransactionBlock()

    tx.moveCall({
      target: `${PACKAGE_ID}::movescription::deploy_v2`,
      arguments: [
        tx.object(DEPLOY_RECORD),
        tx.object(fee_tick_record),
        tx.object(fee_inscription),
        tx.pure(tick),
        tx.pure(supply),
        tx.pure(ts),
        tx.pure(epoch),
        tx.pure(fee),
        tx.object("0x6")
      ],
      typeArguments: [],
    })

    try {
      // execute the programmable transaction
      const resData = await signAndExecuteTransactionBlock({
        // @ts-ignore
        transactionBlock: tx,
      })
      setRefreshData(true)
      console.log('deploy successfully!', resData)
    } catch (e) {
      setRefreshData(true)
      console.error('deploy failed', e)
    }
  }

  return (
    <section className="MContainer">
      <TickList
        address={address}
        open={openDeployTickModal}
        setOpen={setOpenDeployTickModal}
        deploy_tick={deploy_move}
        data={ticks}
      />
    </section>
  )
}
