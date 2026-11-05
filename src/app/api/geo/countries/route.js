import { NextResponse } from 'next/server'
import { getAllCountries } from '@/lib/geo'

export async function GET() {
  const countries = getAllCountries()
  return NextResponse.json({ countries })
}
