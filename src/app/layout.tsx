import type { Metadata } from "next";
import {Roboto_Condensed} from "next/font/google";
import "./globals.css";

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["400", "700"], // Specify the weights you need
});
export const metadata: Metadata = {
  title: "Plain",
  description: "App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={robotoCondensed.className}
      >
        {children}
      </body>
    </html>
  );
}
