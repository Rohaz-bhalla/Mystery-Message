'use client'

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from './ui/button'
import { User } from 'next-auth'

export default function MyNavbar() {
  const { data: session } = useSession()
  const user: User = session?.user as User

  return (
    <nav className="bg-gray-950 text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Logo / Title */}
        <Link href="/" className="text-xl font-semibold tracking-wide">
          MYSTERIOS - MESSAGE
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="text-sm hidden sm:inline">
                Welcome, {user?.username || user?.email}
              </span>
              <Button
                onClick={() => signOut()}
                variant="outline"
                className="bg-slate-100 text-black hover:bg-slate-200"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button className="bg-gray-700 hover:bg-gray-600">Login</Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-gray-700 hover:bg-gray-600">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
