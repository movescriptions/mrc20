import {Button} from './ui/button'
import { Checkbox } from './ui/checkbox'

interface MyMRCListProps {
  loading: boolean
  burn: (tick: string, objectId: string) => void
  data: any[]
  selected: any[]
  setSelected: (inscriptions: any[]) => void
  loadMore: () => void
  hasNextPage: boolean
}

export default function MyMRCList(props: MyMRCListProps) {
  return (
    <div>
      {props.loading ? 'Loading...' : props.data && props.data.length == 0 ? 'No Data' : <div>
        <div className='mb-4'>
          Total: {props.data && props.data.length}
        </div>
        <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {props.data && props.data.length && props.data.map((inscription) => {
            if (inscription.data.objectId) {
              return <li
                key={inscription.data.objectId}
                className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
              >
                <div className="flex flex-1 flex-col p-8">
                  {/* <img className="mx-auto h-32 w-32 flex-shrink-0 rounded-full" src={person.imageUrl} alt="" /> */}
                  {`Tick: ${inscription.data.content.fields.tick}`}
                  <br/>
                  {`Amount: ${inscription.data.content.fields.amount}`}
                  <br/>
                  {`Locked SUI: ${inscription.data.content.fields.acc / 1000000000}`}
                </div>
                <div className='flex justify-between p-2'>
                  <div className='flex flex-col justify-center'>
                    <Checkbox />
                  </div>
                  <div>
                    {/* <Button className='mr-1' size={'sm'}> Split </Button> */}
                    <Button variant={'destructive'} size={'sm'} onClick={() => {
                      props.burn(inscription.data.content.fields.tick, inscription.data.objectId)
                    }}> Burn </Button>
                  </div>
                </div>
              </li>
            }
            return null

          })}
        </ul>
      </div>}
      <div className='flex justify-center mt-5'>
        {!props.loading && props.hasNextPage && <Button className="w-24 bg-sky-700" onClick={props.loadMore}>Next Page</Button>}
      </div>
    </div>
  )
}
