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
  const { importWellnessNetworkFromCsv } = await import('../src/lib/wellness-network.js')
  const { importNewslettersFromSource } = await import('../src/lib/newsletters.js')
  const { importResourcesFromSource } = await import('../src/lib/resources.js')
  const { importPatientExperiencesFromSource } = await import('../src/lib/patient-experience.js')
  const { importTestimonialsFromSource } = await import('../src/lib/testimonials.js')
  const { newsletterRows } = await import('./seed-data/newsletters.js')
  const { resourceCategoryRows } = await import('./seed-data/resources.js')
  const { patientExperienceRows, patientExperienceFallbackCategory } = await import('./seed-data/patient-experience.js')
  const { testimonialRows, testimonialFallbackCategory, testimonialFallbackUserImage } = await import('./seed-data/testimonials.js')

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
  logImportReport('Wellness network', await importWellnessNetworkFromCsv())

  const newsletterResult = await importNewslettersFromSource(newsletterRows)
  console.log(
    `Newsletter import: ${newsletterResult.created} created, ${newsletterResult.skipped} skipped ` +
      `(${newsletterResult.totalRows} rows). Images: ${newsletterResult.imageDownloaded} downloaded, ` +
      `${newsletterResult.imageFailed} failed. PDFs: ${newsletterResult.pdfDownloaded} downloaded, ${newsletterResult.pdfFailed} failed.`
  )
  if (newsletterResult.errors.length > 0) {
    console.log('Newsletter import errors:')
    newsletterResult.errors.forEach((message) => console.log(`  - ${message}`))
  }

  const resourceResult = await importResourcesFromSource(resourceCategoryRows)
  console.log(
    `Resource import: ${resourceResult.categoriesCreated} categories created (of ${resourceResult.totalCategories}), ` +
      `${resourceResult.created} resources created, ${resourceResult.skipped} skipped (${resourceResult.totalResources} total resources). ` +
      `Images: ${resourceResult.imageDownloaded} downloaded, ${resourceResult.imageFailed} failed. ` +
      `PDFs: ${resourceResult.pdfDownloaded} downloaded, ${resourceResult.pdfFailed} failed.`
  )
  if (resourceResult.errors.length > 0) {
    console.log('Resource import errors:')
    resourceResult.errors.forEach((message) => console.log(`  - ${message}`))
  }

  const patientExperienceResult = await importPatientExperiencesFromSource(patientExperienceRows, patientExperienceFallbackCategory)
  console.log(
    `Patient experience import: ${patientExperienceResult.created} created, ${patientExperienceResult.skipped} skipped ` +
      `(${patientExperienceResult.totalRows} rows). Images: ${patientExperienceResult.imageDownloaded} downloaded, ` +
      `${patientExperienceResult.imageFailed} failed.`
  )
  if (patientExperienceResult.errors.length > 0) {
    console.log('Patient experience import errors:')
    patientExperienceResult.errors.forEach((message) => console.log(`  - ${message}`))
  }

  const testimonialResult = await importTestimonialsFromSource(testimonialRows, testimonialFallbackCategory, testimonialFallbackUserImage)
  console.log(
    `Testimonial import: ${testimonialResult.created} created, ${testimonialResult.skipped} skipped ` +
      `(${testimonialResult.totalRows} rows). Images: ${testimonialResult.imageDownloaded} downloaded, ` +
      `${testimonialResult.imageFailed} failed.`
  )
  if (testimonialResult.errors.length > 0) {
    console.log('Testimonial import errors:')
    testimonialResult.errors.forEach((message) => console.log(`  - ${message}`))
  }
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
