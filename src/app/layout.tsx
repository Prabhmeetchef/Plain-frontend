import type { Metadata } from "next";
import { Alumni_Sans} from "next/font/google";
import "./globals.css";

const alumni_Sans = Alumni_Sans({ subsets: ['latin'] })
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
        className={alumni_Sans.className}
      >
        {children}
      </body>
    </html>
  );
}
