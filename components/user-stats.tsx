interface UserTickInfo {
    id: number,
    name: string,
    value: string,
}
  
interface UserTickStatsProps {
    data: UserTickInfo[]
}
  

  export default function UserStats(props: UserTickStatsProps) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <dl className="flex flex-row justify-center gap-x-1 gap-y-16 text-center lg:grid-cols-3">
            {props.data && props.data.map((stat) => (
              <div key={stat.id} className="mx-auto flex max-w-xs flex-col gap-y-4">
                <dt className="text-base leading-7 text-gray-600">{stat.name}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    )
  }
  