import { listWellnessNetworkAdmin, createWellnessNetworkAdmin } from '@/lib/wellness-network'
import { createListCreateRouteHandlers } from '@/lib/content-admin-routes'

export const { GET, POST } = createListCreateRouteHandlers({
  listAdmin: listWellnessNetworkAdmin,
  createAdmin: createWellnessNetworkAdmin,
  itemKey: 'item',
})
