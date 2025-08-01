import { NextResponse, NextRequest } from 'next/server'
import { getToken } from "next-auth/jwt"
export { default } from "next-auth/middleware"

 
export async function middleware(request: NextRequest) {
    const token = await getToken({req : request})
    const url = request.nextUrl

     //If user is NOT logged in, block access to dashboard.. pehle ! vala ayga nhi toh unreachable code ho jayga
  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

   // Redirect to dashboard if the user is already authenticated
  // and trying to access sign-in, sign-up, or home page

  if(
    // false&&  //should be removed
    token &&
    (
        url.pathname.startsWith('/(auth)/sign-in')||
        url.pathname.startsWith('/(auth)/sign-up')||
        url.pathname.startsWith('/verify')||
        url.pathname === '/'
    )
  )

  return NextResponse.redirect(new URL('/dashboard', request.url));

  //Otherwise allow request
  return NextResponse.next()
}

  // tells next.js where to apply middleware
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/(auth)/sign-in',
        '/(auth)/sign-up',
        '/verify/:path*',
        '/'
    ],
}