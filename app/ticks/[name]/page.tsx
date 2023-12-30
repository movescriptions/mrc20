'use client';

import EpochTable from "@/components/epoch-table"
import { SiteHeader } from "@/components/site-header"
import TickStats from "@/components/tick-stats"
import { Button } from "@/components/ui/button"
import UserStats from "@/components/user-stats"
import { useEffect, useState } from "react"
import { useWallet } from "@suiet/wallet-kit"
import { TransactionBlock } from '@mysten/sui.js/transactions'
import { getOwnedObjects, getSuiObject } from "@/lib/apis";
import { ReloadIcon } from "@radix-ui/react-icons"

const PACKAGE_ID = '0xe586ecee5a848f304db9504ffe2ba529623047467edeb0d3fe1fe486a8b8b04c'
const DEPLOY_RECORD = '0x810790bf87223f5733cd6937d42ed9186c79d3f7f0bde98d18565054d526644f'
const TICK_RECORD = '0xe0420fd06b5e14c1d79dab3542aa869deb9a2dd0469ef155e1a85453da1a034c'

export default function Home({ params }: { params: { slug: string } }) {
    const { connected, address, signAndExecuteTransactionBlock } = useWallet()
    const [refreshData, setRefreshData] = useState(false)
    const [loading, setLoading] = useState(false)
    const [mintFee, setMintFee] = useState(0)
    const [tickInfo, setTickInfo] = useState([])
    const [userTickInfo, setUserTickInfo] = useState([])
    const [loadingUserTick, setLoadingUserTick] = useState(false)
    const name = params.name

    useEffect(() => {
        const tickData = [
            { id: 1, name: 'Total SUI Locked', value: '' },
            { id: 2, name: 'Current Epoch', value: '' },
            { id: 3, name: 'Total Transactions', value: '' },
        ]
        setLoading(true)
        getSuiObject(TICK_RECORD).then((res) => {
            console.dir(res.data?.content.fields)
            const data = res.data && res.data && res.data?.content ? res.data?.content.fields : null
            if (data) {
                tickData[0]['value'] = `${parseInt(data.total_transactions ?? 0)*parseInt(data.mint_fee)/1000000000}`
                tickData[1]['value'] = `${data.current_epoch}/${data.epoch_count}`
                tickData[2]['value'] = `${data.total_transactions ?? 0}`
                setMintFee(parseInt(data.mint_fee)/1000000000)
                setTickInfo(tickData)
            }
            setLoading(false)
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
        if (refreshData && address) {
            const tickData = [
                { id: 1, name: 'Total SUI Locked', value: '' },
                { id: 2, name: 'Current Epoch', value: '' },
                { id: 3, name: 'Total Transactions', value: '' },
            ]
            setLoading(true)
            getSuiObject(TICK_RECORD).then((res) => {
                console.dir(res.data?.content.fields)
                const data = res.data && res.data && res.data?.content ? res.data?.content.fields : null
                if (data) {
                    tickData[0]['value'] = `${parseInt(data.total_transactions ?? 0)*parseInt(data.mint_fee)/1000000000}`
                    tickData[1]['value'] = `${data.current_epoch}/${data.epoch_count}`
                    tickData[2]['value'] = `${data.total_transactions ?? 0}`
                    setTickInfo(tickData)
                }
                setLoading(false)
                setRefreshData(false)
            }).catch((err) => {
                console.log(err)
                setLoading(false)
                setRefreshData(false)
            })

            setLoadingUserTick(true)
            getOwnedObjects(address).then((res) => {
                const data = res.data
                if (data && data.length) {
                    const ownedTicks = data.filter((item: any) => item.data && item.data.content && item.data.content.type == `${PACKAGE_ID}::inscription::Inscription` && item.data.content.fields.tick.toLowerCase() == name.toLowerCase())
                    setUserTickInfo(ownedTicks)
                }
                setLoadingUserTick(false)
            }).catch ((err) => {
                console.log(err)
                setLoadingUserTick(false)
            })
        }
    }, [address, refreshData])

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
      Minting
    </Button> : <Button size={'lg'} onClick={() => mint(name)}>Mint</Button>}
          </div>
          
          <EpochTable />
    </section>
  )
}
