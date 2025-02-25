import { getServerSession } from "next-auth";
import { Alumni_Sans } from "next/font/google";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const alumni = Alumni_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default async function Home() {
  const session = await getServerSession();
  
  if (session) {
    redirect("/dashboard/components");
  }

  return (
    <div className={`flex flex-col justify-center w-screen h-screen items-center ${alumni.className}`}>
      <header className="flex bg-white w-[98vw] justify-between h-20 items-center z-1000 px-4 md:px-8">
        <Link href={"/"} className="inline-flex">
          <Image alt="Logo" src="/Logo.png" height={60} width={80} className="md:h-18 md:w-[100px]" />
        </Link>
        <Link href={"auth/login"} className="inline-flex">
          <button className="text-white bg-gradient-to-t from-[#AB00D6] to-[#D322FF] rounded-[12px] py-2 px-4 text-lg md:text-2xl font-semibold flex items-center">
            Login <ArrowUpRight className="ml-1" />
          </button>
        </Link>
      </header>
      <section className="flex justify-center w-full h-[90vh] px-4 md:px-0">
        <div className="h-full w-full max-w-[98%] bg-gradient-to-t from-[#7A0099] to-[#D322FF] rounded-[12px] flex justify-center items-center shadow-inner p-4 md:p-8">
          <div className="text-center">
            <h1 className="text-white text-[47px] md:text-[120px] font-bold">Ease Design.</h1>
            <h2 className="text-white text-lg md:text-[42px] font-light max-w-[90%] md:max-w-full mx-auto">
              Build, manage, and scale your design language effortlessly.
            </h2>
            <Link href={"auth/signup"}>
              <button className="bg-white text-lg md:text-2xl font-bold px-4 md:px-6 py-2 rounded-[12px] my-4 md:my-6">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}