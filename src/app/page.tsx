import { getServerSession } from "next-auth"
import { Alumni_Sans} from "next/font/google";
import { redirect } from "next/navigation"
// import { button } from "framer-motion/client"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

const alumni = Alumni_Sans({
  subsets: ["latin"],
  weight: ["400", "700"], // Specify the weights you need
});
export default async function Home() {
  const session = await getServerSession()
  
  if (session) {
    redirect("/dashboard/components")
  }

  return (
    <div className={`flex flex-col justify-center w-[100vw] h-[100vh] items-center ${alumni.className}`}>
      <header className="flex bg-white w-[98vw] justify-between h-20 items-center z-1000">
        <Link href={"/"} className="inline-flex left-2">
          <Image
            alt="Logo"
            src="/Logo.png"
            height={80}
            width={100}
          ></Image>
        </Link>
        <Link href={"auth/login"} className="inline-flex">
        <button className="text-white bg-gradient-to-t from-[#AB00D6] to-[#D322FF] rounded-[12px] py-2 px-6 text-2xl font-semibold flex items-center">Login<ArrowUpRight/></button>
        </Link>
      </header>
      <section className="flex justify-center w-[100vw] h-[90vh]">
        <div className=" h-full w-[98%] bg-gradient-to-t from-[#7A0099] to-[#D322FF] rounded-[12px] flex justify-center items-center shadow-inner">
          <div className="text-center ">
          <h1 className="text-white text-[120px] font-bold block">Ease Design.</h1>
          <h2 className="text-white text-[42px] font-light ">Build, manage, and scale your design language effortlessly.</h2>
          <Link href={"auth/signup"}><button className="bg-white text-2xl font-bold px-6 p-2 rounded-[12px] my-6">Get Started</button></Link>
          <div>
          </div>
          </div>
        </div>
      </section>
    </div>
  );
}
