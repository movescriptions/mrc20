export default function Logos() {
  return (
    <div className="bg-white py-5">
      <div className="mx-8 px-6 lg:px-8">
        <h2 className="text-center text-lg font-semibold leading-8 text-gray-900">
          Made in ❤️ with the support of
        </h2>
        <div
          className="mx-8 mt-10 grid grid-cols-4 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">

          <a href="https://movefuns.org/" target="_blank">
            <img
              className="col-span-1 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1"
              src="https://notion.movefuns.org/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Ffcb2d709-2592-4bb9-93c2-58039d3a6988%2Fmovefuns.png?table=block&id=e24a4882-ef10-42af-b29d-fad2377a2f4a&spaceId=794debe9-36a5-4418-a7af-775b92e3180d&width=1400&userId=&cache=v2"
              alt="MoveFunsDAO"
              width={80}
              height={48}
            />
          </a>
          <a href="https://surf.tech/" target="_blank">
            <img
              className="col-span-1 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1"
              src="sft_labs.svg"
              alt="Surf Wallet"
              width={80}
              height={48}
            />
          </a>
          <a href="https://surf.tech/" target="_blank">
            <img
              className="col-span-1 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1"
              src="surf.png"
              alt="Surf Wallet"
              width={80}
              height={48}
            />
          </a>
        </div>
      </div>
    </div>
  )
}
