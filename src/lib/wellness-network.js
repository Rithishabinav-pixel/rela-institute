import { createContentModule } from './content-module-factory.js'

const wellnessNetworkModule = createContentModule({
  delegateName: 'wellnessNetwork',
  deptJoinDelegateName: 'wellnessNetworkDepartment',
  doctorJoinDelegateName: 'wellnessNetworkDoctor',
  galleryDelegateName: 'wellnessNetworkGalleryImage',
  fkField: 'wellnessNetworkId',
  cacheTag: 'wellness-network',
  csvFileName: 'rela-wellness-network.csv',
  uploadFolder: 'wellness-network',
  publicBasePath: '/wellness-network',
  slugFallback: 'wellness-network',
})

export const importWellnessNetworkFromCsv = wellnessNetworkModule.importFromCsv
export const listWellnessNetworkPublic = wellnessNetworkModule.listPublic
export const getWellnessNetworkBySlugPublic = wellnessNetworkModule.getBySlugPublic
export const getRelatedWellnessNetwork = wellnessNetworkModule.getRelated
export const getWellnessNetworkDepartmentsForFilter = wellnessNetworkModule.getDepartmentsForFilter
export const getWellnessNetworkDepartmentsForDropdown = wellnessNetworkModule.getDepartmentsForDropdown
export const listWellnessNetworkAdmin = wellnessNetworkModule.listAdmin
export const getWellnessNetworkByIdAdmin = wellnessNetworkModule.getByIdAdmin
export const createWellnessNetworkAdmin = wellnessNetworkModule.createAdmin
export const updateWellnessNetworkAdmin = wellnessNetworkModule.updateAdmin
export const deleteWellnessNetworkAdmin = wellnessNetworkModule.deleteAdmin
export const toggleWellnessNetworkField = wellnessNetworkModule.toggleField
