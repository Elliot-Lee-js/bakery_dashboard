import { User } from "lucide-react"
import Image from "next/image"

const Navbar = () => {
  return (
    <div className="flex justify-between p-2">
        {/* SEARCHBAR */}
        <div className="flex items-center px-2 py-1 gap-2 ring-[1.5px] ring-gray-300 rounded-full text-sm">
          <Image src="/search.png" width={14} height={14} alt="" />
          <input type="text" placeholder="Search..." className="outline-none w-[200px]" />
        </div>
        {/* ICONS */}
        <div className="flex justify-end items-center gap-4">
          <User />

        </div>
    </div>
  )
}

export default Navbar