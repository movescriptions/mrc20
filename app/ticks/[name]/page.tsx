'use client';

import EpochTable from "@/components/epoch-table"
import { SiteHeader } from "@/components/site-header"
import TickStats from "@/components/tick-stats"
import { Button } from "@/components/ui/button"
import UserStats from "@/components/user-stats"
import { useEffect, useState } from "react"
import { useWallet } from "@suiet/wallet-kit"
import { TransactionBlock } from '@mysten/sui.js/transactions'
import { getOwnedObjects, getSuiDynamicFields, getSuiObject } from "@/lib/apis";
import { ReloadIcon } from "@radix-ui/react-icons"
import { PACKAGE_ID, DEPLOY_RECORD } from "@/config/site";

export const runtime = 'edge'

export default function Home({ params }: { params: { name: string } }) {
    const { connected, address, signAndExecuteTransactionBlock } = useWallet()
    const [refreshData, setRefreshData] = useState(false)
    const [loading, setLoading] = useState(false)
    const [mintFee, setMintFee] = useState(0)
    const [tickInfo, setTickInfo] = useState([])
    const [userTickInfo, setUserTickInfo] = useState([])
    const [loadingUserTick, setLoadingUserTick] = useState(false)
    const [tickRecord, setTickRecord] = useState('')
    const name = params.name

    useEffect(() => {
        setLoading(true)
        getSuiDynamicFields(DEPLOY_RECORD, 'record').then((res) => {
            console.log(res)  
            const tick = res.find((item: any) => item.tick.toLowerCase() == name.toLowerCase())
            if (tick) {
                setTickRecord(tick.id.id)
                const tickData = [
                    { id: 1, name: 'Total SUI Locked', value: '' },
                    { id: 2, name: 'Current Epoch', value: '' },
                    { id: 3, name: 'Total Transactions', value: '' },
                ]
                setLoading(true)
                getSuiObject(tick.id.id).then((res) => {
                    // @ts-ignore
                    const data = res.data && res.data && res.data?.content ? res.data?.content.fields : null
                    if (data) {
                        tickData[0]['value'] = `${parseInt(data.total_transactions ?? 0)*parseInt(data.mint_fee)/1000000000}`
                        tickData[1]['value'] = `${data.current_epoch}/${data.epoch_count}`
                        tickData[2]['value'] = `${data.total_transactions ?? 0}`
                        setMintFee(parseInt(data.mint_fee)/1000000000)
                        // @ts-ignore
                        setTickInfo(tickData)
                    }
                    setLoading(false)
                }).catch((err) => {
                    console.log(err)
                    setLoading(false)
                })
            }
        }).catch((err) => {
            console.log(err)
            setLoading(false)
        })
    }, [])

    useEffect(() => {
        if (address) {
            const userStats = [
                { id: 1, name: 'Your Transactions', value: '0' },
                { id: 2, name: 'Minted Tokens', value: '0' },
            ]
            setLoadingUserTick(true)
            getOwnedObjects(address).then((res) => {
                const data = res.data
                if (data && data.length) {
                    const ownedTicks = data.filter((item: any) => item.data && item.data.content && item.data.content.type == `${PACKAGE_ID}::inscription::Inscription` && item.data.content.fields.tick.toLowerCase() == name.toLowerCase())
                    userStats[0]['value'] = `${ownedTicks.length}`
                    userStats[1]['value'] = `${ownedTicks.length*mintFee}`
                    // @ts-ignore
                    setUserTickInfo(userStats)
                }
                setLoadingUserTick(false)
            }).catch ((err) => {
                console.log(err)
                setLoadingUserTick(false)
            })
        }
    }, [address])

    useEffect(() => {
        if (address && refreshData) {
            const userStats = [
                { id: 1, name: 'Your Transactions', value: '0' },
                { id: 2, name: 'Minted Tokens', value: '0' },
            ]
            setLoadingUserTick(true)
            getOwnedObjects(address).then((res) => {
                const data = res.data
                if (data && data.length) {
                    const ownedTicks = data.filter((item: any) => item.data && item.data.content && item.data.content.type == `${PACKAGE_ID}::inscription::Inscription` && item.data.content.fields.tick.toLowerCase() == name.toLowerCase())
                    userStats[0]['value'] = `${ownedTicks.length}`
                    userStats[1]['value'] = `${ownedTicks.length*mintFee}`
                    // @ts-ignore
                    setUserTickInfo(userStats)
                }
                setRefreshData(false)
                setLoadingUserTick(false)
            }).catch ((err) => {
                console.log(err)
                setLoadingUserTick(false)
                setRefreshData(false)
            })
        }
    }, [address, refreshData])

    useEffect(() => {
        if (refreshData && address) {
            const tickData = [
                { id: 1, name: 'Total SUI Locked', value: '' },
                { id: 2, name: 'Current Epoch', value: '' },
                { id: 3, name: 'Total Transactions', value: '' },
            ]
            setLoading(true)
            getSuiObject(tickRecord).then((res) => {
                // @ts-ignore
                const data = res.data && res.data && res.data?.content ? res.data?.content.fields : null
                if (data) {
                    tickData[0]['value'] = `${parseInt(data.total_transactions ?? 0)*parseInt(data.mint_fee)/1000000000}`
                    tickData[1]['value'] = `${data.current_epoch}/${data.epoch_count}`
                    tickData[2]['value'] = `${data.total_transactions ?? 0}`
                    // @ts-ignore
                    setTickInfo(tickData)
                }
                setLoading(false)
                setRefreshData(false)
            }).catch((err) => {
                console.log(err)
                setLoading(false)
                setRefreshData(false)
            })
        }
    }, [tickRecord, refreshData])

    const mint = async (tick: string) => {
        if (!connected) return

        setLoading(true)
        // define a programmable transaction
        const tx = new TransactionBlock()
        const [coin] = tx.splitCoins(tx.gas, [
          tx.pure(2000),
        ])
    
        tx.moveCall({
          target: `${PACKAGE_ID}::inscription::mint`,
          arguments: [
            tx.object(tickRecord),
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
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
          <TickStats data={tickInfo} />
          <UserStats data={userTickInfo}/>
          <div className="flex flex-row justify-center">
            {loading ? <Button disabled>
      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
      Wait for a moment
    </Button> : <Button size={'lg'} onClick={() => mint(name)}>Mint</Button>}
          </div>
    </section>
  )
}
