/**
 * TMA Tracker SDK
 * Client-side tracking for Telegram Mini Apps
 */

import { TMATracker } from './tracker'
import type { TMATracksConfig, PaymentParams } from './types'

// Create singleton instance
const trackerInstance = new TMATracker()

/**
 * TMA Tracks SDK interface
 */
export const TMATracks = {
  /**
   * Initialize the SDK
   * @param config - Configuration options
   */
  init: (config: TMATracksConfig) => trackerInstance.init(config),

  /**
   * Track a payment
   * @param params - Payment parameters
   */
  trackPayment: (params: PaymentParams) => trackerInstance.trackPayment(params),

  /**
   * Get current UTM parameter
   */
  getUtmParameter: () => trackerInstance.getUtmParameter(),

  /**
   * Check if SDK is initialized
   */
  isInitialized: () => trackerInstance.isInitialized(),
}

// Export types
export type { TMATracksConfig, PaymentParams }
export type { AppOpenEvent, PaymentEvent, ApiResponse, TelegramWebAppUser } from './types'

// Default export for UMD build
export default TMATracks
