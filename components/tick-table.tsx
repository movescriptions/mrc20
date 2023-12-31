import { Button } from "./ui/button"
// @ts-ignore
import thousandify from 'thousandify'
import moment from "moment"

interface TickTableProps {
  data: any[]
  deploy_tick: () => void
}
  
export default function TickTable(props: TickTableProps) {
    return (
      <div className="p-5 ">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">MRC20 List</h1>   
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Button
              disabled
              type="button"
              className="w-24 bg-sky-700"
              onClick={props.deploy_tick}
            >
              Deploy
            </Button>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                    >
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Start Time
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Total Supply(Remain)
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Progress
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Mint Fee(SUI)
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {props.data && props.data.map((tick) => (
                    <tr key={tick.tick}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                        {tick.tick}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{moment(parseInt(tick.start_time_ms)).utc().local().format('YYYY-MM-DD HH:mm:ss')}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{`${thousandify(tick.total_supply)}(${thousandify(tick.remain)})`}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{`${parseInt(tick.current_epoch)+1}/${parseInt(tick.epoch_count)+1}`}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{tick.mint_fee/1000000000}</td>
                      <td className="relative flex justify-end whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                        <a href={`/ticks/${tick.tick.toLowerCase()}`}>
                        <Button
                          type="button"
                          className="w-24 bg-sky-700"
                        >
                          Go to Mint
                          </Button>
                          </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
  