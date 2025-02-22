import { getServerSession, NextAuthOptions } from "next-auth";
import { Frame } from "lucide-react";
import { authOptions } from "@/lib/auth";
import Sidebar from "../../components/sidebar";
import { User } from "lucide-react";
import Link from "next/link";
import { Archivo } from "next/font/google";
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "700"], // Specify the weights you need
});
export default async function Designguidelines() {

  const session = await getServerSession(authOptions as NextAuthOptions);
  const username = session?.user?.name || "Guest";
  if (!session) {
    return <p>Please log in</p>;
  }

  const allComponents = [
    {
      type: "Logos",
      element: (
        <div className="flex gap-2 font- text-[27px] p-2w-[38px] h-[38px] items-center justify-center my-[86px] mx-[60px]">
          <Frame className="text-purple-600"/>Example
        </div>
      ),
    },
    {
      type: "Typefaces",
      element: (
        <button className={`flex flex-col mx-[38px] my-[74px] ${archivo.className}`}>
          <h1 className="text-purple-600 italic">Lorem Ipsum</h1>
          <h2 className="font-bold text-[27px]">Lorem Ipsum</h2>
        </button>
      ),
    },
    {
      type: "Colors",
      element: (
        <div className="flex gap-2 items-center rounded-[6px] mx-[52px] my-[86px]">
        <button className="border-[#E6E6E6] border w-[40px] h-[40px] rounded-[6px] bg-[#ac1ce9]"></button>
        <button className="border-[#E6E6E6] border w-[40px] h-[40px] rounded-[6px] bg-[#000000]"></button>
        <button className="border-[#E6E6E6] border w-[40px] h-[40px] rounded-[6px] bg-[#ffffff]"></button>
        </div>
      ),
    },
    {
      type: "General",
      element: (
        <div className="flex flex-col items-center justify-center gap-1 rounded-[20px] mx-[70px] my-[35px]">
          <div className="bg-[#d4d4d4] w-[100px] h-[40px] rounded-[6px]"></div>
          <div className="bg-[#d4d4d4] w-[100px] h-[20px] rounded-[6px]"></div>
          <div className="bg-[#d4d4d4] w-[100px] h-[20px] rounded-[6px]"></div>
          <div className="bg-[#d4d4d4] w-[100px] h-[52px] rounded-[6px]"></div>
        </div>
      ),
    },
  ];

  return (
    <div className="h-[100vh] flex justify-between items-center">
      <div className="ml-[1vw] fixed">
        <Sidebar username={username} />
      </div>
      <div>
        <div className="w-[290px] h-[98vh]">.</div>
      </div>
      <div className="flex-grow flex-col h-full py-6">
        <h1 className="text-[32px] font-semibold">Design Guidelines</h1>
        <h2 className="opacity-60">
          All the guidelines to follow in the process of design
        </h2>

        {/* Grid for displaying connected component types */}
        <div className="flex flex-wrap gap-8 py-10">
          {/* Add new component button */}

          {/* Display only components that exist in `types_c` */}
          {allComponents
            .map((comp) => (
              <Link
                key={comp.type}
                href={`/designaspects/${comp.type.toLowerCase()}`}
                className="flex flex-col items-center justify-center h-[270px] w-[270px] border border-[#E6E6E6] rounded-[10px] hover:shadow-[0_2px_7px_2px_rgba(0,0,0,0.1)] transition cursor-pointer"
              >
                <div className="m-2 flex items-center justify-center rounded-[6px] bg-[#F0F0F0]">
                  {comp.element}
                </div>
                <h1>{comp.type}</h1>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}