import { listHealthPackagesPublic } from '@/lib/health-packages'
import HealthPackagesClient from './HealthPackagesClient'

export const revalidate = 3600

export default async function HealthPackagesPage() {
  const packages = await listHealthPackagesPublic()
  const packagesWithLink = packages.map((pkg) => ({ ...pkg, link: `/health-packages/${pkg.slug}` }))

  return <HealthPackagesClient packages={packagesWithLink} />
}
