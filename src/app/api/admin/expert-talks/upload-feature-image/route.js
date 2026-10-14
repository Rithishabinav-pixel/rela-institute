import { createFeatureImageUploadHandler } from '@/lib/content-admin-routes'

export const { POST } = createFeatureImageUploadHandler({ uploadFolder: 'expert-talks' })
