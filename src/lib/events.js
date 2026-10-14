import { createContentModule } from './content-module-factory.js'

const eventsModule = createContentModule({
  delegateName: 'event',
  deptJoinDelegateName: 'eventDepartment',
  doctorJoinDelegateName: 'eventDoctor',
  galleryDelegateName: 'eventGalleryImage',
  fkField: 'eventId',
  cacheTag: 'events',
  csvFileName: 'rela-events.csv',
  uploadFolder: 'events',
  publicBasePath: '/events',
  slugFallback: 'event',
})

export const importEventsFromCsv = eventsModule.importFromCsv
export const listEventsPublic = eventsModule.listPublic
export const getEventBySlugPublic = eventsModule.getBySlugPublic
export const getRelatedEvents = eventsModule.getRelated
export const getEventDepartmentsForFilter = eventsModule.getDepartmentsForFilter
export const getEventDepartmentsForDropdown = eventsModule.getDepartmentsForDropdown
export const listEventsAdmin = eventsModule.listAdmin
export const getEventByIdAdmin = eventsModule.getByIdAdmin
export const createEventAdmin = eventsModule.createAdmin
export const updateEventAdmin = eventsModule.updateAdmin
export const deleteEventAdmin = eventsModule.deleteAdmin
export const toggleEventField = eventsModule.toggleField
