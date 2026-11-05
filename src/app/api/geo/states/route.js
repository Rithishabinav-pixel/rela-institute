import { NextResponse } from 'next/server'
import { getStatesForCountry } from '@/lib/geo'

export async function GET(request) {
  const countryIso = request.nextUrl.searchParams.get('country') ?? ''
  const states = getStatesForCountry(countryIso)
  return NextResponse.json({ states })
}
