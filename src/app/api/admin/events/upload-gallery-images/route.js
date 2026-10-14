import { createGalleryUploadHandler } from '@/lib/content-admin-routes'

export const { POST } = createGalleryUploadHandler({ uploadFolder: 'events' })
