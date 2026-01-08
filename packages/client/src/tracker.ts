import type {
  TMATracksConfig,
  PaymentParams,
  AppOpenEvent,
  PaymentEvent,
  ApiResponse,
} from './types'
import { extractUtmParameter, getTelegramUser, getStartParam, retry } from './utils'

/**
 * TMA Tracker SDK main class
 */
export class TMATracker {
  private config: Required<TMATracksConfig>
  private utmParameter: string | null = null
  private initialized = false

  constructor() {
    this.config = {
      apiKey: '',
      apiEndpoint: '',
      debug: false,
      maxRetries: 3,
    }
  }

  /**
   * Initialize the SDK
   */
  async init(config: TMATracksConfig): Promise<void> {
    if (this.initialized) {
      this.log('SDK already initialized')
      return
    }

    this.config = {
      ...this.config,
      ...config,
    }

    if (!this.config.apiKey) {
      throw new Error('API key is required')
    }

    if (!this.config.apiEndpoint) {
      throw new Error('API endpoint is required')
    }

    this.log('Initializing TMA Tracker SDK')

    // Extract UTM parameter from start param
    const startParam = getStartParam()
    this.utmParameter = extractUtmParameter(startParam)

    this.log('UTM Parameter:', this.utmParameter)

    // Track app open automatically
    if (this.utmParameter) {
      await this.trackAppOpen()
    } else {
      this.log('No UTM parameter found, skipping app open tracking')
    }

    this.initialized = true
    this.log('SDK initialized successfully')
  }

  /**
   * Track app open event
   */
  private async trackAppOpen(): Promise<void> {
    if (!this.utmParameter) {
      this.log('No UTM parameter, skipping app open tracking')
      return
    }

    const user = getTelegramUser()
    if (!user) {
      this.log('No Telegram user found, skipping app open tracking')
      return
    }

    const event: AppOpenEvent = {
      utmParameter: this.utmParameter,
      telegramUserId: user.id,
      username: user.username,
      languageCode: user.languageCode,
    }

    this.log('Tracking app open:', event)

    try {
      await this.sendEvent('app_open', event)
      this.log('App open tracked successfully')
    } catch (error) {
      console.error('Failed to track app open:', error)
    }
  }

  /**
   * Track payment event
   */
  async trackPayment(params: PaymentParams): Promise<void> {
    if (!this.initialized) {
      throw new Error('SDK not initialized. Call init() first.')
    }

    if (!this.utmParameter) {
      this.log('No UTM parameter, skipping payment tracking')
      return
    }

    const user = getTelegramUser()
    if (!user) {
      throw new Error('No Telegram user found')
    }

    const event: PaymentEvent = {
      utmParameter: this.utmParameter,
      telegramUserId: user.id,
      amount: params.amount,
      paymentId: params.paymentId,
    }

    this.log('Tracking payment:', event)

    try {
      await this.sendEvent('payment', event)
      this.log('Payment tracked successfully')
    } catch (error) {
      console.error('Failed to track payment:', error)
      throw error
    }
  }

  /**
   * Send event to backend
   */
  private async sendEvent(
    eventType: 'app_open' | 'payment',
    eventData: AppOpenEvent | PaymentEvent
  ): Promise<void> {
    const url = `${this.config.apiEndpoint}/api/v1/events`

    const sendRequest = async () => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.config.apiKey,
        },
        body: JSON.stringify({
          event_type: eventType,
          data: eventData,
        }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(error.error || `HTTP ${response.status}`)
      }

      return response.json()
    }

    await retry(sendRequest, this.config.maxRetries)
  }

  /**
   * Get current UTM parameter
   */
  getUtmParameter(): string | null {
    return this.utmParameter
  }

  /**
   * Check if SDK is initialized
   */
  isInitialized(): boolean {
    return this.initialized
  }

  /**
   * Debug logging
   */
  private log(...args: any[]): void {
    if (this.config.debug) {
      console.log('[TMA Tracker]', ...args)
    }
  }
}
