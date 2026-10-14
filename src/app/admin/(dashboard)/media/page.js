import { listMedia } from '@/lib/media'
import MediaClient from './MediaClient'
import style from './media.module.css'

export const metadata = {
  title: 'Media — Admin',
}

export default async function MediaPage() {
  const media = await listMedia()

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Media</h1>
      </div>
      <MediaClient initialMedia={media} />
    </>
  )
}
