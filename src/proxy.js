import { NextResponse } from 'next/server'

// Keep in sync with SUPPORTED_LANGUAGES in src/app/components/Header/Header.js.
const SUPPORTED_LOCALES = ['ta', 'hi', 'te', 'bn', 'ar']

// Every locale prefix rewrites to the same underlying (unprefixed) route, so
// locale-prefixed URLs (e.g. /hi/doctors) resolve instead of 404ing. The
// GTranslate widget (see src/app/layout.js and Header.js) then translates the
// rendered page client-side based on the same locale.
export function proxy(request) {
  const { pathname } = request.nextUrl
  const segments = pathname.split('/').filter(Boolean)
  const [first, ...rest] = segments

  if (!SUPPORTED_LOCALES.includes(first)) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = `/${rest.join('/')}`

  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    '/ta', '/ta/:path*', '/hi', '/hi/:path*', '/te', '/te/:path*',
    '/bn', '/bn/:path*', '/ar', '/ar/:path*',
  ],
}
