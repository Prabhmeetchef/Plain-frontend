import { getServerSession, NextAuthOptions } from "next-auth";
import LogoutButton from '@/app/components/LogoutButton';
import { authOptions } from "@/lib/auth";
import Sidebar from "../components/sidebar";

export default async function Dashboard() {
  const session = await getServerSession(authOptions as NextAuthOptions);

  if (!session) {
    return <p>Please log in</p>;
  }

  return (
  <div className="w-[100vw] h-[100vh] justify-between items-center flex">
    <div className="ml-2"><Sidebar /></div>
    <div>
    </div>
  </div>
  )
}