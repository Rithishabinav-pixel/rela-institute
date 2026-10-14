import {
  getExpertTalkByIdAdmin,
  updateExpertTalkAdmin,
  deleteExpertTalkAdmin,
  toggleExpertTalkField,
} from '@/lib/expert-talks'
import { createDetailRouteHandlers } from '@/lib/content-admin-routes'

export const { GET, PUT, PATCH, DELETE } = createDetailRouteHandlers({
  getByIdAdmin: getExpertTalkByIdAdmin,
  updateAdmin: updateExpertTalkAdmin,
  deleteAdmin: deleteExpertTalkAdmin,
  toggleField: toggleExpertTalkField,
  itemKey: 'item',
  notFoundMessage: 'Expert talk not found',
})
