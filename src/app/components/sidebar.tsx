import { getServerSession, NextAuthOptions } from "next-auth";
import LogoutButton from '@/app/components/LogoutButton';
import { authOptions } from "@/lib/auth";import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Component, FileText, Settings, User } from "lucide-react";
export default async function Sidebar() {
    const session = await getServerSession(authOptions as NextAuthOptions);
  return (
    <div className="flex-col flex bg-[#f7f7f7] w-60 border-[#e6e6e6] border-[2px] rounded-[10px] h-[98vh] justify-between">
      <div>
        <div className="flex m-[12px]">
          <Image src="/logo.png" alt="logo" width={100} height={45} />
        </div>
        <nav className="mt-6">
          <a
            href="#"
            className="flex items-center text-black opacity-[60%] py-4 pl-[12px] nav-item"
          >
            <i className="fas fa-tachometer-alt"></i>
            <span className="mx-[10px] flex justify-center items-center gap-2 text-[20px] font-semibold">
              <Component className="size-[20px] " />
              Components
            </span>
          </a>
          <a
            href="#"
            className="flex items-center text-black opacity-[60%] py-4 pl-[12px] nav-item"
          >
            <i className="fas fa-users"></i>
            <span className="mx-[10px] flex justify-center items-center gap-2 text-[20px] font-semibold">
              <FileText className="size-[20px] " />
              Design Guidelines
            </span>
          </a>
        </nav>
      </div>
      <div
        id="profile"
        className="bg-white flex text-white p-[12px] rounded-[10px] border-[#efafff] border-2 w-full items-center justify-between"
      >
        <div className="flex items-center">
          <button className="flex rounded-full font-semibold text-[20px] p-2 bg-gradient-to-t from-[#AB00D6] to-[#D322FF] w-10 h-10 items-center justify-center">
            <User className="size-[20px] " />
          </button>
          {session && <p className="text-black ml-2 text-[20px] font-normal">{session.user?.name}</p>}
        </div>
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="border-none"><Settings className="text-black opacity-[60%]"/></DropdownMenuTrigger>
            <DropdownMenuContent className="size-40">
              <DropdownMenuLabel className="text-[20px]">Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-[20px]"><LogoutButton /></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
