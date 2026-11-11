import { importDoctorsFromWebsite } from '../src/lib/doctors-website-import.js'
import { prisma } from '../src/lib/prisma.js'

async function main() {
  const report = await importDoctorsFromWebsite()

  console.log(`Doctors found on site: ${report.totalOnSite}`)
  console.log(`Created: ${report.created}`)
  console.log(`Updated: ${report.updated}`)
  console.log(`Skipped: ${report.skipped}`)
  console.log(`Tab sections created: ${report.tabsCreated}`)
  console.log(`Tab sections updated: ${report.tabsUpdated}`)

  if (report.unmatchedDepartments.length > 0) {
    console.log('Unmatched department names (no existing Department record):')
    report.unmatchedDepartments.forEach((name) => console.log(`  - ${name}`))
  }

  if (report.unknownProfileSections.length > 0) {
    console.log('Unknown profile section ids encountered (not imported):')
    report.unknownProfileSections.forEach((id) => console.log(`  - ${id}`))
  }

  if (report.errors.length > 0) {
    console.log('Errors:')
    report.errors.forEach((message) => console.log(`  - ${message}`))
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
