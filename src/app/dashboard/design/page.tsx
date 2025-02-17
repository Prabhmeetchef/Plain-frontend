import { getServerSession, NextAuthOptions } from "next-auth";
import { authOptions } from "@/lib/auth";
import Sidebar from "../../components/sidebar"; // ✅ Ensure correct import path

export default async function Design() {
  const session = await getServerSession(authOptions as NextAuthOptions);
  const username = session?.user?.name || "Guest"; // ✅ Fetch username securely

  if (!session) {
    return <p>Please log in</p>;
  }

  return (
    <div className="w-[100vw] h-[100vh] flex justify-between items-center">
      <div className="ml-[1vw]">
        <Sidebar username={username} /> {/* ✅ Pass username to Sidebar */}
      </div>
      <div></div>
    </div>
  );
}
