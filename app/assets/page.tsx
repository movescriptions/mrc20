"use client"

import {useEffect, useState} from "react"
import {useWallet} from "@suiet/wallet-kit"
// @ts-ignore
import thousandify from "thousandify"

import {PACKAGE_ID} from "@/config/site"
import {getOwnedObjects} from "@/lib/apis"
import MyMRCList from "@/components/my-mrc-list"

export const runtime = "edge"

export default function Home({params}: { params: { name: string } }) {
  const {connected, address, signAndExecuteTransactionBlock} = useWallet()
  const [refreshData, setRefreshData] = useState(false)
  const [userTickInfo, setUserTickInfo] = useState([])
  const [loadingUserTick, setLoadingUserTick] = useState(false)
  const [selectedInscriptions, setSelectedInscriptions] = useState([])

  useEffect(() => {
    if (address) {
      setLoadingUserTick(true)
      getOwnedObjects(address)
        .then((res) => {
          const data = res
          if (data && data.length) {
            const ownedTicks = data.filter(
              (item: any) =>
                item.data &&
                item.data.content &&
                item.data.content.type ==
                `${PACKAGE_ID}::movescription::Movescription`
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
      getOwnedObjects(address)
        .then((res) => {
          const data = res
          if (data && data.length) {
            const ownedTicks = data.filter(
              (item: any) =>
                item.data &&
                item.data.content &&
                item.data.content.type ==
                `${PACKAGE_ID}::movescription::Movescription`
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
          setRefreshData(false)
          setLoadingUserTick(false)
        })
        .catch((err) => {
          console.log(err)
          setRefreshData(false)
          setLoadingUserTick(false)
        })
    }
  }, [address, refreshData])

  return (
    <section className="MContainer p-10">
          <MyMRCList
              data={userTickInfo}
              selected={selectedInscriptions}
              setSelected={setSelectedInscriptions}
          />
    </section>
  )
}
