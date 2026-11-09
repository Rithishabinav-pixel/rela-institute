import {
  getWellnessNetworkByIdAdmin,
  updateWellnessNetworkAdmin,
  deleteWellnessNetworkAdmin,
  toggleWellnessNetworkField,
} from '@/lib/wellness-network'
import { createDetailRouteHandlers } from '@/lib/content-admin-routes'

export const { GET, PUT, PATCH, DELETE } = createDetailRouteHandlers({
  getByIdAdmin: getWellnessNetworkByIdAdmin,
  updateAdmin: updateWellnessNetworkAdmin,
  deleteAdmin: deleteWellnessNetworkAdmin,
  toggleField: toggleWellnessNetworkField,
  itemKey: 'item',
  notFoundMessage: 'Wellness network item not found',
})
