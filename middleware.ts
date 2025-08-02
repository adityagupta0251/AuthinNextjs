import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    // Define public routes
    const publicPaths = ['/login', '/signup']

    // Get token from cookies
    const token = request.cookies.get('token')?.value || ''

    // If token exists and user tries to access login or signup, redirect to home
    if (publicPaths.includes(path) && token) {
        return NextResponse.redirect(new URL('/', request.nextUrl))
    }


    const protectedPaths = ['/', '/profile']
    if (protectedPaths.includes(path) && !token) {
        return NextResponse.redirect(new URL('/login', request.nextUrl))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/',          // protect homepage
        '/profile',   // protect profile page
        '/login',     // check redirection if already signed in
        '/signup'

    ]
}
