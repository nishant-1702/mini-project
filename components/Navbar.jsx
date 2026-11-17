import Link from "next/link";
import { Button } from "@/components/ui/button";
import {Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'

export default function Navbar() {
  return (
    <nav className="
  flex items-center justify-between
  border border-white/20
  px-6 py-4 
  fixed top-0 left-0.5 mx-auto z-60
  bg-gray-950/80
  backdrop-blur-md
  backdrop-saturate-150
  shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]
  w-full rounded-xl
">
      <Link href="/" className="text-3xl pt-2 font-extrabold font-serif text-gray-300 " >
        IndieFlix
      </Link>

      <div className="flex items-center gap-6 text-gray-400 font-bold text-lg">
        <Link href="/">Home</Link>
        <Link href="/browse">Browse</Link>
        <Link href="/pricing">Pricing</Link>

       <Show when="signed-out">
                <SignInButton className="outline px-4 py-2 rounded-3xl bg-purple-700  text-white
                  " />
                <SignUpButton>
                  <button className= " bg-yellow-500 text-white rounded-full font-bold text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                    Sign Up
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
      </div>
    </nav>
  );
}