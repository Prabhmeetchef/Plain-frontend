import { getServerSession, NextAuthOptions } from "next-auth";
import LogoutButton from '@/app/components/LogoutButton';
import { authOptions } from "@/lib/auth";

export default async function Dashboard() {
  const session = await getServerSession(authOptions as NextAuthOptions);
  if (!session) {
    return <p>Please log in</p>;
  }
  return <div className="w-[100vw] h-[100vh] flex-col justify-center items-center flex">
    <div className="text-2xl font-semibold">Welcome, {session.user?.name}!</div>  <div className="text-xl m-2"><LogoutButton /></div>
    </div>;
}