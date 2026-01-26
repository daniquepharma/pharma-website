import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Check if user is accessing an admin route (except login)
    if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
        // Check for session cookie
        const session = request.cookies.get('admin-session');

        if (!session || session.value !== 'authenticated') {
            // Redirect to login if not authenticated
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    // If accessing login while already authenticated, redirect to admin
    if (request.nextUrl.pathname === '/admin/login') {
        const session = request.cookies.get('admin-session');
        if (session && session.value === 'authenticated') {
            return NextResponse.redirect(new URL('/admin', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
}
