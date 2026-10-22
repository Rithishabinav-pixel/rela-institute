import { jobLocations } from '@/lib/job-options'
import { createJobOptionDetailRouteHandlers } from '@/lib/job-option-routes'

export const { PUT, DELETE } = createJobOptionDetailRouteHandlers(jobLocations)
