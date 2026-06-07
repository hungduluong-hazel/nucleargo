import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// ─── MAINTENANCE MODE ────────────────────────────────────────────────────────
// Set MAINTENANCE_MODE=true in Vercel env vars to lock the site.
// Set MAINTENANCE_MODE=false (or remove it) to make the site fully public.
const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === 'true'
const MAINTENANCE_PASSWORD = process.env.MAINTENANCE_PASSWORD ?? 'nucleargo2024'
const COOKIE_NAME = 'nucleargo_access'
const UNLOCK_PATH = '/access'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Maintenance gate — runs before anything else (no Supabase needed)
  if (MAINTENANCE_MODE) {
    const isUnlockPage = pathname === UNLOCK_PATH
    const isAsset =
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.includes('.')
    if (!isUnlockPage && !isAsset) {
      const cookie = request.cookies.get(COOKIE_NAME)
      if (cookie?.value !== MAINTENANCE_PASSWORD) {
        const url = request.nextUrl.clone()
        url.pathname = UNLOCK_PATH
        url.searchParams.set('from', pathname)
        return NextResponse.redirect(url)
      }
    }
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Do not add any code between createServerClient and getUser().
  // A mistake here can cause users to be randomly logged out.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (pathname.startsWith('/dashboard') && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if ((pathname === '/login' || pathname === '/register') && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Must return supabaseResponse to propagate session cookie updates
  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
