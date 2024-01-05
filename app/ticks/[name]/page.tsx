"use client";

import {useEffect, useState} from "react";
import {TransactionBlock} from "@mysten/sui.js/transactions";
import {ReloadIcon} from "@radix-ui/react-icons";
import * as Progress from "@radix-ui/react-progress";
import {useWallet} from "@suiet/wallet-kit";
import NP from "number-precision";
// @ts-ignore
import thousandify from "thousandify";


import {DEPLOY_RECORD, OLD_PACKAGE_ID, PACKAGE_ID} from "@/config/site";
import {getOwnedObjects, getSuiDynamicFields, getSuiObject} from "@/lib/apis";
import {Button} from "@/components/ui/button";
import TickStats from "@/components/tick-stats";
import UserStats from "@/components/user-stats";

import "../../progress.css";

export const runtime = "edge"

export default function Home({params}: { params: { name: string } }) {
  const {connected, address, signAndExecuteTransactionBlock} = useWallet()
  const [refreshData, setRefreshData] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mintFee, setMintFee] = useState(0)
  const [tickInfo, setTickInfo] = useState([])
  const [userTickInfo, setUserTickInfo] = useState([])
  const [loadingUserTick, setLoadingUserTick] = useState(false)
  const [tickRecord, setTickRecord] = useState("")
  const [progress, setProgress] = useState(0)

  const name = params.name

  useEffect(() => {
    setLoading(true)
    getSuiDynamicFields(DEPLOY_RECORD, "record")
      .then((res) => {
        const tick = res.find(
          (item: any) => item.tick.toLowerCase() == name.toLowerCase()
        )
        if (tick) {
          setTickRecord(tick.id.id)
          console.log(tick.id.id)
          const tickData = [
            {id: 1, name: "Total SUI Locked", value: ""},
            {id: 2, name: "Current Epoch", value: ""},
            {id: 3, name: "Total Transactions", value: ""},
          ]
          setLoading(true)
          getSuiObject(tick.id.id)
            .then((res) => {
              // @ts-ignore
              const data =
                res.data && res.data && res.data?.content
                  ? res.data?.content.fields
                  : null
              if (data) {
                console.log(data);
                tickData[0]["value"] = `${
                  (parseInt(data.current_supply ?? 0) / 10000)
                }`
                tickData[1]["value"] = `${
                  parseInt(data.current_epoch) + 1
                }/${parseInt(data.epoch_count)}`
                let progress =
                  (Number(data.current_epoch) / Number(data.epoch_count)) * 100 > 100 ? 100 : (Number(data.current_epoch) / Number(data.epoch_count)) * 100

                setProgress(progress)
                tickData[2]["value"] = `${data.total_transactions ?? 0}`
                setMintFee(parseInt(data.mint_fee) / 1000000000)
                // @ts-ignore
                setTickInfo(tickData)
              }
              setLoading(false)
            })
            .catch((err) => {
              console.log(err)
              setLoading(false)
            })
        }
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (address && mintFee) {
      const userStats = [
        {id: 1, name: "Your Inscriptions", value: "0"},
        {id: 2, name: "Minted Tokens", value: "0"},
        {id: 3, name: "Locked SUI", value: "0"},
      ]
      setLoadingUserTick(true)
      getOwnedObjects(address)
        .then((res) => {
          const data = res
          if (data && data.length) {
            const ownedTicks = data.filter(
              (item: any) =>
                item.data &&
                item.data.content &&
                (item.data.content.type ==
                  `${PACKAGE_ID}::movescription::Movescription` || item.data.content.type ==
                  `${OLD_PACKAGE_ID}::movescription::Movescription`) &&
                item.data.content.fields.tick.toLowerCase() ==
                name.toLowerCase()
            )
            let acc = 0
            let amount = 0
            if (ownedTicks.length) {
              for (let i = 0; i < ownedTicks.length; i++) {
                acc += parseInt(ownedTicks[i].data.content.fields.acc)
                amount += parseInt(ownedTicks[i].data.content.fields.amount)
              }
            }
            userStats[0]["value"] = `${ownedTicks.length}`
            userStats[2]["value"] = `${NP.strip(acc / 1000000000)}`
            userStats[1]["value"] = `${thousandify(amount)}`
            // @ts-ignore
            setUserTickInfo(userStats)
          }
          setLoadingUserTick(false)
        })
        .catch((err) => {
          console.log(err)
          setLoadingUserTick(false)
        })
    }
  }, [address, mintFee])

  useEffect(() => {
    if (address && refreshData) {
      const userStats = [
        {id: 1, name: "Your Inscriptions", value: "0"},
        {id: 2, name: "Minted Tokens", value: "0"},
        {id: 3, name: "Locked SUI", value: "0"},
      ]
      setLoadingUserTick(true)
      getOwnedObjects(address)
        .then((res) => {
          const data = res
          if (data && data.length) {
            const ownedTicks = data.filter(
              (item: any) =>
                item.data &&
                item.data.content &&
                (item.data.content.type ==
                  `${PACKAGE_ID}::movescription::Movescription` || item.data.content.type ==
                  `${OLD_PACKAGE_ID}::movescription::Movescription`) &&
                item.data.content.fields.tick.toLowerCase() ==
                name.toLowerCase()
            )
            let acc = 0
            let amount = 0
            if (ownedTicks.length) {
              for (let i = 0; i < ownedTicks.length; i++) {
                acc += parseInt(ownedTicks[i].data.content.fields.acc)
                amount += parseInt(ownedTicks[i].data.content.fields.amount)
              }
            }
            userStats[0]["value"] = `${ownedTicks.length}`
            userStats[2]["value"] = `${NP.strip(acc / 1000000000)}`
            userStats[1]["value"] = `${thousandify(amount)}`
            // @ts-ignore
            setUserTickInfo(userStats)
          }
          setRefreshData(false)
          setLoadingUserTick(false)
        })
        .catch((err) => {
          console.log(err)
          setLoadingUserTick(false)
          setRefreshData(false)
        })
    }
  }, [address, refreshData])

  useEffect(() => {
    if (refreshData && address) {
      const tickData = [
        {id: 1, name: "Total SUI Locked", value: ""},
        {id: 2, name: "Current Epoch", value: ""},
        {id: 3, name: "Total Transactions", value: ""},
      ]
      setLoading(true)
      getSuiObject(tickRecord)
        .then((res) => {
          // @ts-ignore
          const data =
            res.data && res.data && res.data?.content
              ? res.data?.content?.fields
              : null
          if (data) {
            tickData[0]["value"] = `${
              parseInt(data.current_supply ?? 0) / 10000
            }`
            tickData[1]["value"] = `${
              parseInt(data.current_epoch) + 1
            }/${parseInt(data.epoch_count)}`
            tickData[2]["value"] = `${data.total_transactions ?? 0}`
            // @ts-ignore
            setTickInfo(tickData)
          }
          setLoading(false)
          setRefreshData(false)
        })
        .catch((err) => {
          console.log(err)
          setLoading(false)
          setRefreshData(false)
        })
    }
  }, [tickRecord, refreshData])

  const mint = async (tick: string, mintFee: number) => {
    if (!connected) return

    setLoading(true)
    // define a programmable transaction
    const tx = new TransactionBlock()
    const [coin] = tx.splitCoins(tx.gas, [tx.pure(mintFee * 1000000000)])

    tx.moveCall({
      target: `${PACKAGE_ID}::movescription::mint`,
      arguments: [tx.object(tickRecord), tx.pure(tick), coin, tx.object("0x6")],
      typeArguments: [],
    })

    try {
      // execute the programmable transaction
      const resData = await signAndExecuteTransactionBlock({
        // @ts-ignore
        transactionBlock: tx,
      })
      setRefreshData(true)
      setLoading(false)
      console.log(`mint ${tick} successfully!`, resData)
    } catch (e) {
      setRefreshData(true)
      setLoading(false)
      console.error(`mint ${tick} failed`, e)
    }
  }

  return (
    <section className="MContainer p-10">
      {progress !== 0 && (
        <div className="mb-5 flex w-full flex-col items-center justify-center">
          <Progress.Root className="ProgressRoot" value={progress}>
            <Progress.Indicator
              className="ProgressIndicator"
              style={{transform: `translateX(-${100 - progress}%)`}}
            />
          </Progress.Root>
          <div className="mt-4 font-bold">{progress.toFixed(2)} %</div>
        </div>
      )}
      <TickStats data={tickInfo}/>
      <UserStats data={userTickInfo}/>
      <div className="m-10 flex flex-row justify-center">
        {loading ? (
          <Button disabled>
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>
            Wait for a moment
          </Button>
        ) : (
          <Button
            className="h-16 w-48 bg-sky-700 text-2xl font-bold"
            onClick={() => mint(name, mintFee)}
            disabled={name == "move"}
          >
            Mint
          </Button>
        )}
      </div>
      <div className="flex flex-row justify-center text-center">
        All mint fees stored in your inscriptions.
        <br/>
        You can burn your move inscriptions to get back your mint fees.
        <br/>
        Your inscriptions will be sent to your address after the end of the
        epoch.
      </div>
    </section>
  )
}
