import crypto from 'node:crypto'
import { cookies } from 'next/headers'

export const SESSION_COOKIE_NAME = 'admin_session'
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000 // 8 hours

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) throw new Error('ADMIN_SESSION_SECRET environment variable is not set')
  return secret
}

function sign(payload) {
  return crypto.createHmac('sha256', getSecret()).update(payload).digest('hex')
}

function createSessionToken(username) {
  const expiresAt = Date.now() + SESSION_DURATION_MS
  const payload = `${username}.${expiresAt}`
  const signature = sign(payload)
  return `${Buffer.from(payload).toString('base64url')}.${signature}`
}

function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return false

  const [encodedPayload, signature] = token.split('.')
  if (!encodedPayload || !signature) return false

  let payload
  try {
    payload = Buffer.from(encodedPayload, 'base64url').toString('utf8')
  } catch {
    return false
  }

  const expectedSignature = sign(payload)
  const signatureBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)

  if (signatureBuffer.length !== expectedBuffer.length) return false
  if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) return false

  const expiresAt = Number(payload.split('.').pop())
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false

  return true
}

export function verifyCredentials(username, password) {
  const expectedUsername = process.env.ADMIN_USERNAME ?? ''
  const expectedPassword = process.env.ADMIN_PASSWORD ?? ''
  if (!expectedUsername || !expectedPassword) return false
  if (!username || !password) return false

  const usernameBuffer = Buffer.from(String(username))
  const expectedUsernameBuffer = Buffer.from(expectedUsername)
  const passwordBuffer = Buffer.from(String(password))
  const expectedPasswordBuffer = Buffer.from(expectedPassword)

  const usernameMatches =
    usernameBuffer.length === expectedUsernameBuffer.length &&
    crypto.timingSafeEqual(usernameBuffer, expectedUsernameBuffer)
  const passwordMatches =
    passwordBuffer.length === expectedPasswordBuffer.length &&
    crypto.timingSafeEqual(passwordBuffer, expectedPasswordBuffer)

  return usernameMatches && passwordMatches
}

export async function createSession(username) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, createSessionToken(username), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_DURATION_MS / 1000,
  })
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function isAuthenticated() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  return verifySessionToken(token)
}
