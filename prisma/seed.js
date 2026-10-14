function logImportReport(label, result) {
  console.log(
    `${label} import: ${result.created} created, ${result.updated} updated, ` +
      `${result.skipped} skipped (${result.totalRows} rows in CSV).`
  )
  console.log(`  Feature images: ${result.featureImageDownloaded} downloaded, ${result.featureImageFailed} failed.`)
  console.log(`  Gallery images: ${result.galleryImageDownloaded} downloaded, ${result.galleryImageFailed} failed.`)
  if (result.unmatchedDepartments.length > 0) {
    console.log(`${label} import — unmatched departments:`)
    result.unmatchedDepartments.forEach((name) => console.log(`  - ${name}`))
  }
  if (result.unmatchedDoctors.length > 0) {
    console.log(`${label} import — unmatched doctors:`)
    result.unmatchedDoctors.forEach((name) => console.log(`  - ${name}`))
  }
  if (result.errors.length > 0) {
    console.log(`${label} import errors:`)
    result.errors.forEach((message) => console.log(`  - ${message}`))
  }
}

async function main() {
  const { importDepartmentsFromCsv } = await import('../src/lib/departments.js')
  const { importDoctorsFromCsv } = await import('../src/lib/doctors.js')
  const { importMediaArticlesFromCsv } = await import('../src/lib/media-articles.js')
  const { importSuccessStoriesFromCsv } = await import('../src/lib/success-stories.js')
  const { importExpertTalksFromCsv } = await import('../src/lib/expert-talks.js')
  const { importEventsFromCsv } = await import('../src/lib/events.js')

  const departmentResult = await importDepartmentsFromCsv()
  console.log(
    `Department import: ${departmentResult.created} created, ${departmentResult.skippedExisting} already existed ` +
      `(${departmentResult.totalInCsv} unique department names found in the CSV).`
  )

  const doctorResult = await importDoctorsFromCsv()
  console.log(
    `Doctor import: ${doctorResult.imported} imported, ${doctorResult.updated} updated, ` +
      `${doctorResult.skipped} skipped (${doctorResult.totalRows} rows in CSV).`
  )
  if (doctorResult.unmatchedDepartments.length > 0) {
    console.log('Unmatched departments:')
    doctorResult.unmatchedDepartments.forEach((name) => console.log(`  - ${name}`))
  }
  if (doctorResult.errors.length > 0) {
    console.log('Doctor import errors:')
    doctorResult.errors.forEach((message) => console.log(`  - ${message}`))
  }

  logImportReport('Media article', await importMediaArticlesFromCsv())
  logImportReport('Success story', await importSuccessStoriesFromCsv())
  logImportReport('Expert talk', await importExpertTalksFromCsv())
  logImportReport('Event', await importEventsFromCsv())
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    const { prisma } = await import('../src/lib/prisma.js')
    await prisma.$disconnect()
  })
