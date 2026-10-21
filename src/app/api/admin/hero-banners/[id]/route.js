import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-session'
import { getHeroBannerByIdAdmin, updateHeroBannerAdmin, deleteHeroBannerAdmin } from '@/lib/hero-banners'
import { deleteUploadedFile } from '@/lib/upload'

export async function GET(request, { params }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const banner = await getHeroBannerByIdAdmin(Number(id))

  if (!banner) {
    return NextResponse.json({ error: 'Hero banner not found' }, { status: 404 })
  }

  return NextResponse.json({ banner })
}

export async function PUT(request, { params }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  let input
  try {
    input = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  try {
    const previous = await getHeroBannerByIdAdmin(Number(id))
    const banner = await updateHeroBannerAdmin(Number(id), input)

    if (previous?.desktopImage && previous.desktopImage !== banner.desktopImage) {
      await deleteUploadedFile(previous.desktopImage)
    }
    if (previous?.mobileImage && previous.mobileImage !== banner.mobileImage) {
      await deleteUploadedFile(previous.mobileImage)
    }

    return NextResponse.json({ banner })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request, { params }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const deleted = await deleteHeroBannerAdmin(Number(id))
    if (deleted.desktopImage) await deleteUploadedFile(deleted.desktopImage)
    if (deleted.mobileImage) await deleteUploadedFile(deleted.mobileImage)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
