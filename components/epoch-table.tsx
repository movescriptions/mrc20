const epochs = [
  {
    epoch: 1,
    start_time: '2021-10-10',
    total_txns: 80,
    user_txns: 10000,
    user_minted: 100000,
    status: 'active'
  }
]

interface EpochTableProps {

}

export default function EpochTable(props: EpochTableProps) {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Epoch Stats</h1>
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
                  Epoch
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Start Time
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Total Transactions
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Your Transactions
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Your Minted Tokens
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>

              </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
              {epochs.map((epoch) => (
                <tr key={epoch.epoch}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                    {epoch.epoch}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{epoch.start_time}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{epoch.total_txns}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{epoch.user_txns}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{epoch.user_minted}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{epoch.status}</td>
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
