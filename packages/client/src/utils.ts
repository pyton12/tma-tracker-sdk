/**
 * Decode base64 string
 * Supports both standard base64 and URL-safe base64
 */
export function decodeBase64(encoded: string): string {
  try {
    // Handle URL-safe base64
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/')

    // Add padding if needed
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')

    // Decode using native atob
    return atob(padded)
  } catch (error) {
    // If decoding fails, return original string
    return encoded
  }
}

/**
 * Check if string is base64 encoded
 */
export function isBase64(str: string): boolean {
  try {
    return btoa(atob(str)) === str || btoa(atob(str.replace(/-/g, '+').replace(/_/g, '/'))) === str
  } catch {
    return false
  }
}

/**
 * Extract UTM parameter from start_param
 * Handles both plain text and base64 encoded parameters
 */
export function extractUtmParameter(startParam?: string): string | null {
  if (!startParam) return null

  // Try to decode if it looks like base64
  if (isBase64(startParam)) {
    return decodeBase64(startParam)
  }

  return startParam
}

/**
 * Simple logging utility
 */
export class Logger {
  constructor(private debug: boolean = false) {}

  log(...args: unknown[]): void {
    if (this.debug) {
      console.log('[TMATracks]', ...args)
    }
  }

  error(...args: unknown[]): void {
    console.error('[TMATracks]', ...args)
  }

  warn(...args: unknown[]): void {
    if (this.debug) {
      console.warn('[TMATracks]', ...args)
    }
  }
}

/**
 * Retry logic for API calls
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error | null = null

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
      }
    }
  }

  throw lastError
}

/**
 * Get Telegram user data from WebApp
 */
export function getTelegramUser(): {
  id: number
  username?: string
  languageCode?: string
} | null {
  if (typeof window === 'undefined') return null

  try {
    const WebApp = (window as any).Telegram?.WebApp
    if (WebApp?.initDataUnsafe?.user) {
      const user = WebApp.initDataUnsafe.user
      return {
        id: user.id,
        username: user.username,
        languageCode: user.language_code,
      }
    }
  } catch (error) {
    console.error('Failed to get Telegram user:', error)
  }

  return null
}

/**
 * Get start param from Telegram WebApp
 */
export function getStartParam(): string | null {
  if (typeof window === 'undefined') return null

  try {
    const WebApp = (window as any).Telegram?.WebApp
    return WebApp?.initDataUnsafe?.start_param || null
  } catch (error) {
    console.error('Failed to get start param:', error)
    return null
  }
}
