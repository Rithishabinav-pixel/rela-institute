import { listEventsAdmin, createEventAdmin } from '@/lib/events'
import { createListCreateRouteHandlers } from '@/lib/content-admin-routes'

export const { GET, POST } = createListCreateRouteHandlers({
  listAdmin: listEventsAdmin,
  createAdmin: createEventAdmin,
  itemKey: 'item',
})
