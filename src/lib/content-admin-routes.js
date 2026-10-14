// Shared Next.js Route Handler builders for the four "content" admin modules
// (Media Articles, Success Stories, Expert Talks, Events). Keeps auth checks,
// request parsing, and error shaping consistent without four near-duplicate
// route.js files per module.
import { NextResponse } from 'next/server'
import { isAuthenticated } from './admin-session'
import { deleteUploadedFile } from './upload'
import { saveUploadedImage, isAllowedImageType } from './upload'
import { getImageDimensions } from './image-dimensions'

export function createListCreateRouteHandlers({ listAdmin, createAdmin, itemKey }) {
  return {
    async GET(request) {
      if (!(await isAuthenticated())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const search = request.nextUrl.searchParams.get('search') ?? ''
      const page = Number(request.nextUrl.searchParams.get('page')) || 1
      const pageSize = Number(request.nextUrl.searchParams.get('pageSize')) || 20

      const result = await listAdmin({ search, page, pageSize })
      return NextResponse.json(result)
    },

    async POST(request) {
      if (!(await isAuthenticated())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      let input
      try {
        input = await request.json()
      } catch {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
      }

      try {
        const item = await createAdmin(input)
        return NextResponse.json({ [itemKey]: item }, { status: 201 })
      } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
    },
  }
}

export function createDetailRouteHandlers({ getByIdAdmin, updateAdmin, deleteAdmin, toggleField, itemKey, notFoundMessage }) {
  return {
    async GET(request, { params }) {
      if (!(await isAuthenticated())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const { id } = await params
      const item = await getByIdAdmin(Number(id))

      if (!item) {
        return NextResponse.json({ error: notFoundMessage }, { status: 404 })
      }

      return NextResponse.json({ [itemKey]: item })
    },

    async PUT(request, { params }) {
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

      const previous = await getByIdAdmin(Number(id))
      if (!previous) {
        return NextResponse.json({ error: notFoundMessage }, { status: 404 })
      }

      try {
        const item = await updateAdmin(Number(id), input)

        if (previous.featureImage && previous.featureImage !== item.featureImage) {
          await deleteUploadedFile(previous.featureImage)
        }

        const keptPaths = new Set((input.gallery ?? []).map((image) => image.imagePath))
        const removedGalleryImages = previous.gallery.filter((image) => !keptPaths.has(image.imagePath))
        await Promise.all(removedGalleryImages.map((image) => deleteUploadedFile(image.imagePath)))

        return NextResponse.json({ [itemKey]: item })
      } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
    },

    async PATCH(request, { params }) {
      if (!(await isAuthenticated())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const { id } = await params
      let body
      try {
        body = await request.json()
      } catch {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
      }

      const { field, value } = body ?? {}
      if (typeof field !== 'string' || typeof value !== 'boolean') {
        return NextResponse.json({ error: 'field and a boolean value are required' }, { status: 400 })
      }

      try {
        const item = await toggleField(Number(id), field, value)
        return NextResponse.json({ [itemKey]: item })
      } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
    },

    async DELETE(request, { params }) {
      if (!(await isAuthenticated())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const { id } = await params
      const existing = await getByIdAdmin(Number(id))

      try {
        const deleted = await deleteAdmin(Number(id))
        if (existing?.featureImage) await deleteUploadedFile(existing.featureImage)
        if (existing?.gallery?.length) {
          await Promise.all(existing.gallery.map((image) => deleteUploadedFile(image.imagePath)))
        }
        return NextResponse.json({ ok: true, deleted })
      } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
    },
  }
}

export function createFeatureImageUploadHandler({ uploadFolder }) {
  return {
    async POST(request) {
      if (!(await isAuthenticated())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const formData = await request.formData()
      const file = formData.get('file')

      if (!file || typeof file === 'string') {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 })
      }

      if (!isAllowedImageType(file.type)) {
        return NextResponse.json({ error: 'Unsupported image type. Use PNG, JPEG, or WEBP.' }, { status: 400 })
      }

      const saved = await saveUploadedImage(file, uploadFolder)
      const dimensions = getImageDimensions(saved.buffer)

      return NextResponse.json({ url: saved.url, width: dimensions?.width ?? null, height: dimensions?.height ?? null })
    },
  }
}

export function createGalleryUploadHandler({ uploadFolder }) {
  return {
    async POST(request) {
      if (!(await isAuthenticated())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const formData = await request.formData()
      const files = formData.getAll('files').filter((f) => f && typeof f !== 'string')

      if (files.length === 0) {
        return NextResponse.json({ error: 'No files provided' }, { status: 400 })
      }

      const uploaded = []
      const failed = []

      for (const file of files) {
        if (!isAllowedImageType(file.type)) {
          failed.push({ name: file.name, error: 'Unsupported image type. Use PNG, JPEG, or WEBP.' })
          continue
        }

        try {
          const saved = await saveUploadedImage(file, uploadFolder)
          uploaded.push({ imagePath: saved.url, name: file.name })
        } catch (error) {
          failed.push({ name: file.name, error: error.message })
        }
      }

      return NextResponse.json({ uploaded, failed })
    },
  }
}
