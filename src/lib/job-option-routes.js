import { NextResponse } from 'next/server'
import { isAuthenticated } from './admin-session.js'

export function createJobOptionListRouteHandlers(optionModule) {
  return {
    async GET() {
      if (!(await isAuthenticated())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const items = await optionModule.list()
      return NextResponse.json({ items })
    },

    async POST(request) {
      if (!(await isAuthenticated())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      let body
      try {
        body = await request.json()
      } catch {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
      }

      try {
        const item = await optionModule.create(body.name)
        return NextResponse.json({ item }, { status: 201 })
      } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
    },
  }
}

export function createJobOptionDetailRouteHandlers(optionModule) {
  return {
    async PUT(request, { params }) {
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

      try {
        const item = await optionModule.update(Number(id), body.name)
        return NextResponse.json({ item })
      } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
    },

    async DELETE(request, { params }) {
      if (!(await isAuthenticated())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const { id } = await params

      try {
        await optionModule.remove(Number(id))
        return NextResponse.json({ ok: true })
      } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
    },
  }
}
