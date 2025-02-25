"use client"; // ✅ Client component for better interactivity

import Image from "next/image";
import { usePathname } from "next/navigation"; // ✅ Instant page detection
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Component, FileText, Settings, User } from "lucide-react";
import LogoutButton from "@/app/components/LogoutButton";

export default function Sidebar({ username }: { username?: string }) {
  const pathname = usePathname(); // ✅ Detects active page

  return (
    <div className="flex-col sm:flex bg-[#FEFBFF] w-60 border-[#F9E7FD] border-[2px] rounded-[10px] h-[98vh] justify-between hidden">
      <div>
        <div className="flex m-[12px]">
          <Image src="/Logo.png" alt="logo" width={100} height={56} />
        </div>
        <nav className="my-6">
          <a
            href="/dashboard/components"
            className={`flex items-center py-4 pl-[12px] nav-item ${
              pathname === "/dashboard/components"
                ? "text-black opacity-100 font-semibold bg-white shadow-[0px_2px_2px_2px_#F9E7FD]"
                : "text-black opacity-[80%]"
            }`}
          >
            <Component className="size-[20px]" />
            <span className="mx-[10px] flex justify-center items-center gap-2 text-[18px]">
              Components
            </span>
          </a>
          <a
            href="/dashboard/design"
            className={`flex items-center py-4 pl-[12px] nav-item ${
              pathname === "/dashboard/design"
                ? "text-black opacity-100 font-semibold bg-white shadow-[0px_2px_2px_2px_#F9E7FD]"
                : "text-black opacity-[80%]"
            }`}
          >
            <FileText className="size-[20px]" />
            <span className="mx-[10px] flex justify-center items-center gap-2 text-[18px]">
              Design Guidelines
            </span>
          </a>
        </nav>
      </div>
      <div
        id="profile"
        className="bg-white flex text-white p-[12px] rounded-[10px] border-t-2 border-[#F6D3FF] w-full items-center justify-between"
      >
        <div className="flex items-center">
          <button className="flex rounded-full font-semibold text-[18px] p-2 bg-gradient-to-t from-[#AB00D6] to-[#D322FF] w-[38px] h-[38px] items-center justify-center">
            <User className="size-[20px]" />
          </button>
          {/* ✅ Username is passed from the server component */}
          {username && (
            <p className="text-black ml-2 text-[17px] font-normal">
              {username}
            </p>
          )}
        </div>
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="border-none">
              <Settings className="text-black opacity-[52%]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel className="text-[18px]">
                Settings
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-[18px]">
                <LogoutButton />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
