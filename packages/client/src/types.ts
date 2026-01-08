/**
 * Configuration options for TMATracks SDK initialization
 */
export interface TMATracksConfig {
  /** API key for authentication with the backend */
  apiKey: string
  /** Backend API endpoint URL */
  apiEndpoint: string
  /** Enable debug logging (default: false) */
  debug?: boolean
  /** Maximum retry attempts for failed requests (default: 3) */
  maxRetries?: number
}

/**
 * Payment tracking parameters
 */
export interface PaymentParams {
  /** Amount in Telegram Stars */
  amount: number
  /** Optional payment ID from Telegram */
  paymentId?: string
}

/**
 * App open event data
 */
export interface AppOpenEvent {
  utmParameter: string
  telegramUserId: number
  username?: string
  languageCode?: string
}

/**
 * Payment event data
 */
export interface PaymentEvent {
  utmParameter: string
  telegramUserId: number
  amount: number
  paymentId?: string
}

/**
 * API response structure
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Telegram WebApp InitData structure
 */
export interface TelegramWebAppUser {
  id: number
  first_name?: string
  last_name?: string
  username?: string
  language_code?: string
}

export interface TelegramWebAppInitData {
  user?: TelegramWebAppUser
  start_param?: string
}
