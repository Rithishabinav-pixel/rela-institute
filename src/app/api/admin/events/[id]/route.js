import { getEventByIdAdmin, updateEventAdmin, deleteEventAdmin, toggleEventField } from '@/lib/events'
import { createDetailRouteHandlers } from '@/lib/content-admin-routes'

export const { GET, PUT, PATCH, DELETE } = createDetailRouteHandlers({
  getByIdAdmin: getEventByIdAdmin,
  updateAdmin: updateEventAdmin,
  deleteAdmin: deleteEventAdmin,
  toggleField: toggleEventField,
  itemKey: 'item',
  notFoundMessage: 'Event not found',
})
