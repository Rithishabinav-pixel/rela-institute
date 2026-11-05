import style from './detail.module.css'
import { getHealthPackageBySlugPublic, listHealthPackagesPublic } from '@/lib/health-packages'
import { buildCanonicalUrl } from '@/lib/site-url'
import PackageDetailClient from './PackageDetailClient'

export const revalidate = 3600

export async function generateMetadata({ params }) {
  const { slug } = await params

  try {
    const pkg = await getHealthPackageBySlugPublic(slug)

    if (!pkg) {
      return { title: 'Health Package Not Found' }
    }

    return {
      title: pkg.metaTitle || pkg.testName,
      description: pkg.metaDescription || '',
      alternates: {
        canonical: pkg.canonicalUrl || buildCanonicalUrl(`/health-packages/${slug}`),
      },
    }
  } catch {
    return {}
  }
}

export default async function Page({ params }) {
  const { slug } = await params

  let pkg = null
  let error = ''

  try {
    pkg = await getHealthPackageBySlugPublic(slug)
  } catch {
    error = 'Could not load health package. Please try again.'
  }

  if (error) {
    return (
      <section className={`common_section ${style.packageDetail_section}`}>
        <div className={`container ${style.container}`}>
          <p>{error}</p>
        </div>
      </section>
    )
  }

  if (!pkg) {
    return (
      <section className={`common_section ${style.packageDetail_section}`}>
        <div className={`container ${style.container}`}>
          <p>Health package not found</p>
        </div>
      </section>
    )
  }

  const allPackages = await listHealthPackagesPublic().catch(() => [])
  const explorePackages = allPackages
    .filter((item) => item.id !== pkg.id)
    .map((item) => ({ ...item, link: `/health-packages/${item.slug}` }))

  return <PackageDetailClient pkg={pkg} explorePackages={explorePackages} />
}
