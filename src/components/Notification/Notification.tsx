import { PiBell } from "react-icons/pi";

export function Notification() {
  return (


    <div className="dropdown dropdown-hover dropdown-end">

      <div   tabIndex={0} role="button" className="btn btn-ghost btn-square shadow-[0_4px_4px_2px_rgba(0,0,0,0.25)] border-[2px] border-base-300 m-1">
        <PiBell className="w-6 h-6" />
      </div>

      <ul className="dropdown-content  bg-base-100 rounded-md  menu z-[2] w-52 shadow">
        <div className="h-60 w-full  overflow-y-scroll p-2">

        </div>
      </ul>
    </div >
  )
}