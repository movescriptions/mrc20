import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid'

const people = [
  {
    name: 'Jane Cooper',
    title: 'Paradigm Representative',
    role: 'Admin',
    email: 'janecooper@example.com',
    telephone: '+1-202-555-0170',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
  // More people...
]

interface MyMRCListProps {
    data: any[]
    selected: any[]
    setSelected: (inscriptions:any[]) => void
}

export default function MyMRCList(props: MyMRCListProps) {
  return (
      <div>
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
                      <br />
                      {`Amount: ${inscription.data.content.fields.amount}`}
                      <br />
                {`Locked SUI: ${inscription.data.content.fields.acc/1000000000}`}
                  </div>
              <div>
                hello
              </div>
            </li>
        }
        return null

    })}
    </ul>
    </div>
  )
}
