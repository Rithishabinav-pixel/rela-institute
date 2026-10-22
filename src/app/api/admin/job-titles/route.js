import { jobTitles } from '@/lib/job-options'
import { createJobOptionListRouteHandlers } from '@/lib/job-option-routes'

export const { GET, POST } = createJobOptionListRouteHandlers(jobTitles)
