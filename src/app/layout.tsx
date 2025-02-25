import type { Metadata } from "next";
import PortableBlocker from "@/app/components/PortableBlocker";
import React from "react";
import { Roboto_Condensed } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/app/components/SessionProvider";
const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["400", "700"],
});
export const metadata: Metadata = {
  title: "Plain: We ease and organize!",
  description: "App",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={robotoCondensed.className}>
        <PortableBlocker>
          <AuthProvider>{children}</AuthProvider>
        </PortableBlocker>
      </body>
    </html>
  );
}
