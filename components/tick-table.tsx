import {Button} from "./ui/button"
// @ts-ignore
import thousandify from 'thousandify'
import moment from "moment"

interface TickTableProps {
  data: any[]
  deploy_tick: () => void
}

export default function TickTable(props: TickTableProps) {
  return (
    <div className="p-10">
      <div className="flex justify-between">
        <div className="flex items-center">
          <h1 className="text-base font-semibold leading-6 text-gray-900">MRC20 List</h1>
        </div>
        <div>
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
            <table className="min-w-full table-auto divide-y divide-gray-300">
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
                    <div className="flex flex-row">
                      <div className="justify-cente mr-1 flex flex-col pt-0.5">
                        {tick.tick}
                      </div>
                      {tick.tick.toLowerCase() == 'move' && <div className="flex flex-col justify-center">
                        <svg data-testid="icon-verified" viewBox="0 0 22 22" className="aspect-1 w-6">
                          <linearGradient id="a" x1="4.411" x2="18.083" y1="2.495" y2="21.508"
                                          gradientUnits="userSpaceOnUse">
                            <stop offset="0" stopColor="#f4e72a"></stop>
                            <stop offset=".539" stopColor="#cd8105"></stop>
                            <stop offset=".68" stopColor="#cb7b00"></stop>
                            <stop offset="1" stopColor="#f4ec26"></stop>
                            <stop offset="1" stopColor="#f4e72a"></stop>
                          </linearGradient>
                          <linearGradient id="b" x1="5.355" x2="16.361" y1="3.395" y2="19.133"
                                          gradientUnits="userSpaceOnUse">
                            <stop offset="0" stopColor="#f9e87f"></stop>
                            <stop offset=".406" stopColor="#e2b719"></stop>
                            <stop offset=".989" stopColor="#e2b719"></stop>
                          </linearGradient>
                          <g fillRule="evenodd" clipRule="evenodd">
                            <path fill="url(#a)"
                                  d="M13.324 3.848 11 1.6 8.676 3.848l-3.201-.453-.559 3.184L2.06 8.095 3.48 11l-1.42 2.904 2.856 1.516.559 3.184 3.201-.452L11 20.4l2.324-2.248 3.201.452.559-3.184 2.856-1.516L18.52 11l1.42-2.905-2.856-1.516-.559-3.184zm-7.09 7.575 3.428 3.428 5.683-6.206-1.347-1.247-4.4 4.795-2.072-2.072z"></path>
                            <path fill="url(#b)"
                                  d="M13.101 4.533 11 2.5 8.899 4.533l-2.895-.41-.505 2.88-2.583 1.37L4.2 11l-1.284 2.627 2.583 1.37.505 2.88 2.895-.41L11 19.5l2.101-2.033 2.895.41.505-2.88 2.583-1.37L17.8 11l1.284-2.627-2.583-1.37-.505-2.88zm-6.868 6.89 3.429 3.428 5.683-6.206-1.347-1.247-4.4 4.795-2.072-2.072z"></path>
                            <path fill="#d18800"
                                  d="m6.233 11.423 3.429 3.428 5.65-6.17.038-.033-.005 1.398-5.683 6.206-3.429-3.429-.003-1.405.005.003z"></path>
                          </g>
                        </svg>
                      </div>}
                    </div>
                  </td>
                  <td
                    className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{moment(parseInt(tick.start_time_ms)).utc().local().format('YYYY-MM-DD HH:mm:ss')}</td>
                  <td
                    className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{`${thousandify(tick.total_supply)}(${thousandify(tick.remain)})`}</td>
                  <td
                    className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{`${parseInt(tick.current_epoch) + 1}/${parseInt(tick.epoch_count)}`}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{tick.mint_fee / 1000000000}</td>
                  <td
                    className="relative flex justify-end whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                    <a href={`/ticks/${tick.tick.toLowerCase()}`}>
                      <Button
                        type="button"
                        className="w-24 bg-sky-700"
                      >
                        {tick.tick.toLowerCase() == 'move' ? 'Finish' : 'Go to Mint'}
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
