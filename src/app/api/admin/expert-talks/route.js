import { listExpertTalksAdmin, createExpertTalkAdmin } from '@/lib/expert-talks'
import { createListCreateRouteHandlers } from '@/lib/content-admin-routes'

export const { GET, POST } = createListCreateRouteHandlers({
  listAdmin: listExpertTalksAdmin,
  createAdmin: createExpertTalkAdmin,
  itemKey: 'item',
})
