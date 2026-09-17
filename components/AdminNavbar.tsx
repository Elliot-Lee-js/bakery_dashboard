
import AddFinancials from "@/components/AddFinancials";
import EditFinancial from "@/components/EditFinancial";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";



const AdminNavbar = () => {


  return (
    <div className="flex items-center justify-between p-8">
      <div className="flex items-center gap-2 rounded-md p-2">
        <Link href="/"> 
        <Avatar className="size-16">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        </Link>
        <div>
          <h1 className="font-bold text-2xl">Welcome back Elliot!</h1>
          <p className="text-gray-400 text-sm">
            Check your messages and email for the latest update.
          </p>
        </div>
      </div>
      <div className="flex gap-4 ">
        <AddFinancials />
        <EditFinancial />
      </div>
    </div>
  );
};

export default AdminNavbar;
