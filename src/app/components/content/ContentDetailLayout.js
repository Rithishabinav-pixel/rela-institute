import React from 'react'
import style from './content-detail.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { headers } from 'next/headers'
import ArticleImage from '../ArticleImage'
import ContentRichText from './ContentRichText'
import Button from '@/app/components/UI/Button'
import DepartmentCard from '@/app/components/UI/DepartmentCard'
import DoctorCard from '@/app/components/UI/DoctorCard'
import GalleryLightbox from '@/app/components/GalleryLightbox'
import { slugify } from '@/lib/slug'
import ContentForm from '../ContentForm/ContentForm'

const FEATURE_FALLBACK_IMAGE = '/assets/images/sample-article-img.png'

function formatDate(value) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

async function getPageUrl(basePath, slug) {
  const requestHeaders = await headers()
  const host = requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host')
  const protocol = requestHeaders.get('x-forwarded-proto') ?? 'http'
  return `${protocol}://${host}${basePath}/${slug}`
}

function getShareLinks(url, title) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  }
}

function mapDepartmentToCard(department, doctors) {
  const departmentSlug = department.slug || slugify(department.name)
  const matchedDoctor = doctors.find((doctor) => doctor.speciality?.id === department.id)

  return {
    name: department.name,
    icon: department.icon || '/assets/images/dept-sample-icon.svg',
    specialities: department.symptoms?.map((symptom) => symptom.name) ?? [],
    doctorLink: matchedDoctor ? `/doctors/${matchedDoctor.slug}` : '/doctors',
    departmentLink: `/departments/${departmentSlug}`,
  }
}

function mapDoctorToCard(doctor) {
  return {
    image: doctor.image,
    name: doctor.name,
    speciality: doctor.speciality?.name ?? '',
    position: doctor.position,
    link: `/doctors/${doctor.slug}`,
  }
}

/**
 * Generic public detail-page layout shared by Media Articles, Success
 * Stories, Expert Talks, and Events. Reproduces the original Media Article
 * detail markup/classNames exactly — only the data source, base path, and
 * related-items heading differ per module.
 *
 * @param {object} props
 * @param {object} props.item - serialized detail record (title, slug, publishedAt, featureType,
 *   featureImage, youtubeUrl, readMoreUrl, content, departments, doctors, gallery)
 * @param {object[]} props.relatedItems - serialized list items (slug, thumbnailUrl, publishedAt, title)
 * @param {string} props.basePath - e.g. '/media', '/success-stories', '/expert-talks', '/events'
 * @param {string} props.relatedHeading - e.g. 'Related Media', 'Related Success Stories'
 */
export default async function ContentDetailLayout({ item, relatedItems, basePath, relatedHeading }) {
  const shareLinks = getShareLinks(await getPageUrl(basePath, item.slug), item.title)

  const related = relatedItems.map((relatedItem) => ({
    slug: relatedItem.slug,
    image: relatedItem.thumbnailUrl || FEATURE_FALLBACK_IMAGE,
    formattedDate: formatDate(relatedItem.publishedAt),
    title: relatedItem.title,
  }))

  const departments = item.departments.map((department) => mapDepartmentToCard(department, item.doctors))
  const doctors = item.doctors.map(mapDoctorToCard)

  return (
    <div className="static_page">
      <section className={style.articleDetail}>
        <div className={`container ${style.container}`}>
          <div className={style.contentArea}>
            <div className={style.topContent}>
              <div className={style.taxonomies_container}>
                <h1 className="common_heading">{item.title}</h1>

                {item.publishedAt && (
                  <div className={style.date}>
                    <p>{formatDate(item.publishedAt)}</p>
                  </div>
                )}
              </div>

              <div className={style.share}>
                <p>Share :</p>
                <ul>
                  <li>
                    <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer">
                      <Image src="/assets/images/whatsapp.svg" width={24} height={24} alt="" />
                    </a>
                  </li>
                  <li>
                    <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
                      <Image src="/assets/images/facebook.svg" width={24} height={24} alt="" />
                    </a>
                  </li>
                  <li>
                    <a href={shareLinks.x} target="_blank" rel="noopener noreferrer">
                      <Image src="/assets/images/x.svg" width={24} height={24} alt="" />
                    </a>
                  </li>
                  <li>
                    <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer">
                      <Image src="/assets/images/linkedin.svg" width={24} height={24} alt="" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {item.featureType === 'video' && item.youtubeUrl ? (
              <div className={style.featureImage}>
                <iframe
                  src={item.youtubeUrl}
                  title={item.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : item.featureImage ? (
              <div className={style.featureImage}>
                <ArticleImage
                  src={item.featureImage}
                  width={1140}
                  height={639}
                  alt={item.title}
                  fallback={FEATURE_FALLBACK_IMAGE}
                />
              </div>
            ) : null}

            {item.readMoreUrl && (
              <Button link={item.readMoreUrl} classname="common_btn orange_btn" text="Read The Articles" />
            )}

            {item.content && <ContentRichText content={item.content} />}

            {item.gallery.length > 0 && (
              <GalleryLightbox
                images={item.gallery}
                galleryClassName={style.gallery}
                cardsClassName={style.cards}
                imageClassName={style.singleImage}
              />
            )}

            {departments.length > 0 && (
              <div className={style.department}>
                <h2>Departments</h2>
                <div className={style.cards}>
                  {departments.map((dept, index) => (
                    <DepartmentCard key={index} cardStyle="threeCard" dept={dept} />
                  ))}
                </div>
              </div>
            )}

            {doctors.length > 0 && (
              <div className={style.doctors}>
                <h2>Doctors</h2>
                <div className={style.cards}>
                  {doctors.map((doctor, index) => (
                    <React.Fragment key={index}>
                      <DoctorCard doctor={doctor} cardStyle="doctorGridCard" />
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>

          {related.length > 0 && (
            <aside id={style.sidebar}>
              <h2>{relatedHeading}</h2>
              <div className={style.cards}>
                {related.map((relatedItem) => (
                  <Link key={relatedItem.slug} href={`${basePath}/${relatedItem.slug}`} className={style.card}>
                    <div className={style.image}>
                      <ArticleImage src={relatedItem.image} alt={relatedItem.title} />
                    </div>
                    <div className={style.content}>
                      <p className={style.date}>{relatedItem.formattedDate}</p>
                      <h3>{relatedItem.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>

              <div className={style.formArea}>
                  <ContentForm/>
              </div>

            </aside>
          )}
        </div>
      </section>
    </div>
  )
}
