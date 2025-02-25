"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
export default function MobileBlocker({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileDevices = /iphone|ipad|ipod|android|blackberry|opera mini|iemobile|mobile/;
    setIsMobile(mobileDevices.test(userAgent));
  }, []);
  if (isMobile === null) return null; // Prevent flickering
  if (isMobile)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#121212] text-white text-center p-6">
        <div className="max-w flex bg-gradient-to-b from-purple-600 to-[#290038] p-8 rounded-2xl shadow-lg flex-col items-center justify-center gap-10">
          <Image src="/phone.png" alt="phone" width={100} height={100}/>
          <p className="text-[20px] opacity-80">
            Sorry, This website is only accessible on a <span className="font-semibold">desktop browser</span>.
          </p>
        </div>
      </div>
    );

  return <>{children}</>;
}
