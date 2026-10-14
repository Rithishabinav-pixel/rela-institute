import { createContentModule } from './content-module-factory.js'

const expertTalksModule = createContentModule({
  delegateName: 'expertTalk',
  deptJoinDelegateName: 'expertTalkDepartment',
  doctorJoinDelegateName: 'expertTalkDoctor',
  galleryDelegateName: 'expertTalkGalleryImage',
  fkField: 'expertTalkId',
  cacheTag: 'expert-talks',
  csvFileName: 'rela-expert-talks.csv',
  uploadFolder: 'expert-talks',
  publicBasePath: '/expert-talks',
  slugFallback: 'expert-talk',
})

export const importExpertTalksFromCsv = expertTalksModule.importFromCsv
export const listExpertTalksPublic = expertTalksModule.listPublic
export const getExpertTalkBySlugPublic = expertTalksModule.getBySlugPublic
export const getRelatedExpertTalks = expertTalksModule.getRelated
export const getExpertTalkDepartmentsForFilter = expertTalksModule.getDepartmentsForFilter
export const getExpertTalkDepartmentsForDropdown = expertTalksModule.getDepartmentsForDropdown
export const listExpertTalksAdmin = expertTalksModule.listAdmin
export const getExpertTalkByIdAdmin = expertTalksModule.getByIdAdmin
export const createExpertTalkAdmin = expertTalksModule.createAdmin
export const updateExpertTalkAdmin = expertTalksModule.updateAdmin
export const deleteExpertTalkAdmin = expertTalksModule.deleteAdmin
export const toggleExpertTalkField = expertTalksModule.toggleField
