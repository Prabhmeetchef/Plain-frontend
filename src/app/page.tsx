import { button } from "framer-motion/client";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center w-[100vw] h-[100vh]">
      <header className="flex bg-white w-[98vw] justify-between fixed h-20 items-center">
        <Link href={"/"} className="inline-flex left-2">
          <Image
            alt="Logo"
            src="/logo.png"
            height={80}
            width={100}
          ></Image>
        </Link>
        <Link href={"/login"} className="inline-flex">
        <button className="text-white bg-gradient-to-t from-[#AB00D6] to-[#D322FF] rounded-[12px] py-2 px-6 text-2xl font-semibold">Login</button>
        </Link>
      </header>
      <section className="flex justify-center w-[100vw] h-[90vh] translate-y-20">
        <div className=" h-full w-[98%] bg-gradient-to-t from-[#7A0099] to-[#D322FF] rounded-[12px] flex justify-center items-center shadow-inner">
          <div className="text-center -translate-y-20">
          <h1 className="text-white text-[120px] font-bold block">Ease Design.</h1>
          <h2 className="text-white text-[42px] font-light -translate-y-6">Build, manage, and scale your design language effortlessly.</h2>
          <Link href={"/signup"}><button className="bg-white text-2xl font-bold px-6 p-2 rounded-[12px] my-6">Get Started</button></Link>
          <div>
          </div>
          </div>
        </div>
      </section>
    </div>
  );
}
