import {Button} from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {FEE_TICK_RECORD, OLD_PACKAGE_ID, PACKAGE_ID} from "@/config/site"
import {getOwnedObjectsByCursor} from "@/lib/apis"
import {calculate_deploy_fee} from "@/lib/utils"
import {useState} from "react"

interface DeployTickModalProps {
  address: string
  open: boolean
  setOpen: (open: boolean) => void
  deploy_tick: (tick: string, fee_tick_record: string, fee_inscription: string, supply: number, ts: number, epoch: number, fee: number) => void
}

export function DeployTickModal(props: DeployTickModalProps) {
  const [deployPayload, setDeployPayload] = useState({
    tick: '',
    supply: 0,
    epoch: 0,
    start_time: 0,
    mint_fee: 0,
  })
  const [step, setStep] = useState(0)
  const [validInscriptions, setValidInscriptions] = useState([])
  const [loadingUserTick, setLoadingUserTick] = useState(false)

  const checkMoveBalance = async () => {
    const result = []
    let next_cursor = null
    let has_next_page = false
    let has_valid_inscription = false
    setLoadingUserTick(true)
    while (!has_valid_inscription && !has_next_page) {
      const res = await getOwnedObjectsByCursor(props.address, next_cursor)
      const data = res.data
      next_cursor = res.nextCursor
      has_next_page = res.hasNextPage
      if (data && data.length) {
        const ownedTicks = data.filter(
          (item: any) =>
            item.data &&
            item.data.content &&
            (item.data.content.type ==
              `${PACKAGE_ID}::movescription::Movescription` || item.data.content.type ==
              `${OLD_PACKAGE_ID}::movescription::Movescription`) &&
            item.data.content.fields.tick.toLowerCase() == 'move'
        )

        if (ownedTicks.length) {
          const fee = calculate_deploy_fee(deployPayload.tick, deployPayload.epoch)
          console.dir(fee)
          for (let i = 0; i < ownedTicks.length; i++) {
            if (parseInt(ownedTicks[i].data.content.fields.amount) >= fee) {
              has_valid_inscription = true
              result.push(ownedTicks[i])
              break
            }
          }
        }
      }
    }
    setLoadingUserTick(false)

    console.dir(result)

    if (result.length) {
      setValidInscriptions(result)
      props.deploy_tick(deployPayload.tick, FEE_TICK_RECORD, result[0].data?.content.fields.id.id, deployPayload.supply, deployPayload.start_time, deployPayload.epoch, deployPayload.mint_fee * 1000000000)
    } else {
      setStep(2)
    }
  }

  const onClose = () => {
    setStep(0)
    setDeployPayload({
      tick: '',
      supply: 0,
      epoch: 0,
      start_time: 0,
      mint_fee: 0,
    })
    props.setOpen(!props.open)
  }

  return (
    <Dialog
      open={props.open}
      onOpenChange={onClose}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deploy New Tick</DialogTitle>
          <DialogDescription>
            Deploy an exciting new tick
          </DialogDescription>
        </DialogHeader>
        {step == 0 && <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tick" className="text-right">
              Tick Name
            </Label>
            <Input
              id="tick"
              value={deployPayload.tick}
              onChange={
                (e) => setDeployPayload({...deployPayload, tick: e.target.value})
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="supply" className="text-right">
              Supply
            </Label>
            <Input
              id="supply"
              value={deployPayload.supply}
              onChange={(e) => setDeployPayload({...deployPayload, supply: parseInt(e.target.value) ?? 0})}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="epoch" className="text-right">
              Epoch
            </Label>
            <Input
              id="epoch"
              type="number"
              value={deployPayload.epoch}
              onChange={(e) => setDeployPayload({...deployPayload, epoch: parseInt(e.target.value) ?? 0})}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="start_time" className="text-right">
              Start Time(ms)
            </Label>
            <Input
              id="start_time"
              value={deployPayload.start_time}
              onChange={(e) => setDeployPayload({...deployPayload, start_time: parseInt(e.target.value) ?? 0})}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mint_fee" className="text-right">
              Mint Fee
            </Label>
            <Input
              id="mint_fee"
              value={deployPayload.mint_fee}
              onChange={(e) => setDeployPayload({...deployPayload, mint_fee: parseInt(e.target.value ?? 0)})}
              className="col-span-3"
            />
          </div>
        </div>}
        {step == 2 && <div>
          {`Sorry, you don't have enough balance to deploy this tick.`}
        </div>}
        <DialogFooter>
          {step == 0 && <Button onClick={checkMoveBalance}>Deploy</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
