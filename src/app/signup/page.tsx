import Image from "next/image";
import Link from "next/link";

export default function Login() {
  return (
    <>
      <div className="flex justify-center w-[100vw] h-[100vh]">
        <div className="w-[50vw] flex flex-col items-center h-[100vh]">
          <Link href="/"><Image src="/Logo.png" alt="Logo" width={120} height={80} className="pt-[50px]"></Image></Link>
          <h1 className="text-black text-[40px] font-bold block pt-12">
            Hey There!
          </h1>
          <h2 className="text-[#949494] text-[26px] font-semibold block">
            Please enter your details to Signup.
          </h2>
            <form className="flex flex-col w-[29vw] pt-12">
                <input
                type="email"
                placeholder="Please enter your email"
                className="rounded-[8px] p-2 my-4 border-[#e7e7e7] border-[2px] text-[20px]"
                ></input>
                <input
                type="password"
                placeholder="Please enter your Password"
                className="rounded-[8px] p-2 my-4 border-[#e4e4e4] border-[2px] text-[20px]"
                ></input>
                <input
                type="password"
                placeholder="Please Re-enter your Password"
                className="rounded-[8px] p-2 my-4 border-[#e4e4e4] border-[2px] text-[20px]"
                >
                </input>
                <button className="bg-gradient-to-t from-[#AB00D6] to-[#D322FF] rounded-[8px] p-2 px-6 text-white text-[24px] font-semibold my-6"
                type="submit">
                Login
                </button>


                <button className="rounded-[8px] p-2 px-6 text-black text-[24px] font-semibold mb-12 border-gray-200 border-[2px] inline-flex items-center justify-center">
                Connect with Google
                <Image src="/google.svg" alt="Google" width={32} height={32} className="pl-2"></Image>
                </button>
                <div className="text-center"><h1 className="text-[20px] font-semibold">New here? <span className="text-blue-600 underline"><Link href="/login"><button className="underline">Login</button></Link></span></h1></div>
            </form>
        </div>
        <div className="flex flex-col justify-between w-[50vw] h-[full] bg-gradient-to-t from-[#AB00D6] to-[#D322FF]">
          <div className="text-white text-[42px] font-bold w-full p-8 text-center">
            Ease Design.
          </div>
          <div>
            <Image
              src="/Group 1.svg"
              alt="Logo"
              width={1000}
              height={600}
            ></Image>
          </div>
        </div>
      </div>
    </>
  );
}