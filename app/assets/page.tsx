"use client"

import {useEffect, useState} from "react"
import {useWallet} from "@suiet/wallet-kit"
// @ts-ignore
import thousandify from "thousandify"
import {TransactionBlock} from "@mysten/sui.js/transactions"

import {DEPLOY_RECORD, OLD_PACKAGE_ID, PACKAGE_ID} from "@/config/site"
import {getOwnedObjectsByCursor, getSuiDynamicFields} from "@/lib/apis"
import MyMRCList from "@/components/my-mrc-list"

export const runtime = "edge"

export default function Home({params}: { params: { name: string } }) {
  const {connected, address, signAndExecuteTransactionBlock} = useWallet()
  const [refreshData, setRefreshData] = useState(false)
  const [userTickInfo, setUserTickInfo] = useState([])
  const [loadingUserTick, setLoadingUserTick] = useState(false)
  const [selectedInscriptions, setSelectedInscriptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [ticks, setTicks] = useState([])
  const [oldCursor, setOldCursor] = useState<string | null | undefined>(null)
  const [nextObjectId, setNextObjectId] = useState<string | null | undefined>("")
  const [hasNextPage, setHasNextPage] = useState<boolean>(false)

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

  useEffect(() => {
    if (address) {
      setLoadingUserTick(true)
      getOwnedObjectsByCursor(address, null)
        .then((res) => {
          const data = res.data
          setNextObjectId(res.nextCursor)
          setOldCursor(null)
          setHasNextPage(res.hasNextPage)
          if (data && data.length) {
            const ownedTicks = data.filter(
              (item: any) =>
                item.data &&
                item.data.content &&
                (item.data.content.type ==
                `${PACKAGE_ID}::movescription::Movescription` || item.data.content.type ==
                `${OLD_PACKAGE_ID}::movescription::Movescription`)
            )
            let acc = 0
            if (ownedTicks.length) {
              for (let i = 0; i < ownedTicks.length; i++) {
                acc += parseInt(ownedTicks[i].data.content.fields.acc)
              }
            }
            console.dir(ownedTicks)
            setUserTickInfo(ownedTicks)
          }
          setLoadingUserTick(false)
        })
        .catch((err) => {
          console.log(err)
          setLoadingUserTick(false)
        })
    }
  }, [address])

  useEffect(() => {
    if (address && refreshData) {
      setLoadingUserTick(true)
      getOwnedObjectsByCursor(address, oldCursor)
        .then((res) => {
          const data = res.data
          if (data && data.length) {
            const ownedTicks = data.filter(
              (item: any) =>
                item.data &&
                item.data.content &&
                (`${PACKAGE_ID}::movescription::Movescription` || item.data.content.type ==
                `${OLD_PACKAGE_ID}::movescription::Movescription`)
            )
            let acc = 0
            if (ownedTicks.length) {
              for (let i = 0; i < ownedTicks.length; i++) {
                acc += parseInt(ownedTicks[i].data.content.fields.acc)
              }
            }
            setUserTickInfo(ownedTicks)
          }
          setRefreshData(false)
          setLoadingUserTick(false)
        })
        .catch((err) => {
          console.log(err)
          setRefreshData(false)
          setLoadingUserTick(false)
        })
    }
  }, [address, oldCursor, refreshData])

  const burn = async (tick: string, object_id: string) => {
    if (!connected) return
    const filteredTick = ticks.find((item: any) => item.tick.toLowerCase() == tick.toLowerCase())
    if (!filteredTick) return
    // define a programmable transaction
    const tx = new TransactionBlock()


    tx.moveCall({
      target: `${PACKAGE_ID}::movescription::burn`,
      arguments: [tx.object(filteredTick.id.id), tx.object(object_id)],
      typeArguments: [],
    })

    try {
      // execute the programmable transaction
      const resData = await signAndExecuteTransactionBlock({
        // @ts-ignore
        transactionBlock: tx,
      })
      setRefreshData(true)
      console.log(`burn ${tick} successfully!`, resData)
    } catch (e) {
      setRefreshData(true)
      console.error(`burn ${tick} failed`, e)
    }
  }

  const loadMore = async () => {
    if (!hasNextPage) return
    setLoadingUserTick(true)
    getOwnedObjectsByCursor(address, nextObjectId)
      .then((res) => {
        const data = res.data
        setNextObjectId(res.nextCursor)
        setOldCursor(nextObjectId)
        setHasNextPage(res.hasNextPage)
        if (data && data.length) {
          const ownedTicks = data.filter(
            (item: any) =>
              item.data &&
              item.data.content &&
              (`${PACKAGE_ID}::movescription::Movescription` || item.data.content.type ==
                `${OLD_PACKAGE_ID}::movescription::Movescription`)
          )
          let acc = 0
          if (ownedTicks.length) {
            for (let i = 0; i < ownedTicks.length; i++) {
              acc += parseInt(ownedTicks[i].data.content.fields.acc)
            }
          }
          console.dir(ownedTicks)
          setUserTickInfo(ownedTicks)
        }
        setLoadingUserTick(false)
      })
      .catch((err) => {
        console.log(err)
        setLoadingUserTick(false)
      })
  }

  return (
    <section className="MContainer p-10">
      <MyMRCList
        loading={loadingUserTick || loading}
        burn={burn}
        data={userTickInfo}
        selected={selectedInscriptions}
        setSelected={setSelectedInscriptions}
        loadMore={loadMore}
        hasNextPage={hasNextPage}
      />
    </section>
  )
}
