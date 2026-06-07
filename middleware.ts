import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ─── MAINTENANCE MODE ────────────────────────────────────────────────────────
// Set MAINTENANCE_MODE=true in Vercel environment variables to lock the site.
// Set MAINTENANCE_MODE=false (or remove it) to make the site fully public.
const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === 'true'
const MAINTENANCE_PASSWORD = process.env.MAINTENANCE_PASSWORD ?? 'nucleargo2024'

const COOKIE_NAME = 'nucleargo_access'
const UNLOCK_PATH = '/access'

export function middleware(request: NextRequest) {
  if (!MAINTENANCE_MODE) return NextResponse.next()

  const { pathname } = request.nextUrl

  // Always allow the unlock page and its POST action
  if (pathname === UNLOCK_PATH) return NextResponse.next()

  // Allow static assets and API routes through
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Check for valid access cookie
  const cookie = request.cookies.get(COOKIE_NAME)
  if (cookie?.value === MAINTENANCE_PASSWORD) return NextResponse.next()

  // Redirect to unlock page, preserving intended destination
  const url = request.nextUrl.clone()
  url.pathname = UNLOCK_PATH
  url.searchParams.set('from', pathname)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
