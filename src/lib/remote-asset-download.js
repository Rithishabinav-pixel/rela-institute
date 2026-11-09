import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import sharp from 'sharp'
import { savePdfBuffer } from './upload.js'

async function fetchBuffer(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`)
  return Buffer.from(await res.arrayBuffer())
}

export async function downloadAndNormalizeImage(url, destinationFolder, targetDimensions) {
  const buffer = await fetchBuffer(url)
  const meta = await sharp(buffer).metadata()
  const outputFormat = meta.format === 'png' ? 'png' : 'jpeg'
  const extension = outputFormat === 'png' ? 'png' : 'jpg'

  let output = buffer
  if (targetDimensions?.width && targetDimensions?.height) {
    output = await sharp(buffer)
      .resize(targetDimensions.width, targetDimensions.height, { fit: 'cover', position: 'centre' })
      .toFormat(outputFormat)
      .toBuffer()
  }

  const fileName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${extension}`
  const destinationDir = path.join(process.cwd(), 'public', 'uploads', destinationFolder)
  await fs.mkdir(destinationDir, { recursive: true })
  await fs.writeFile(path.join(destinationDir, fileName), output)

  return {
    url: `/uploads/${destinationFolder}/${fileName}`,
    width: targetDimensions?.width ?? meta.width,
    height: targetDimensions?.height ?? meta.height,
    sourceWidth: meta.width,
    sourceHeight: meta.height,
  }
}

export async function downloadAndSavePdf(url, destinationFolder) {
  const buffer = await fetchBuffer(url)
  return savePdfBuffer(buffer, destinationFolder)
}
