'use client'




import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'
export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/' })}
      className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-black flex gap-2 items-center"
    >
      Log out <LogOut className='size-[18px]'/>
    </button>
  )
}