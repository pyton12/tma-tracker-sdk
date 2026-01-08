import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../db/client'
import { validateApiKey, requireClientKey } from '../middleware/auth'
import { eventsRateLimiter } from '../middleware/rateLimit'

const router = Router()

// Validation schemas
const appOpenSchema = z.object({
  utmParameter: z.string().min(1),
  telegramUserId: z.number().int().positive(),
  username: z.string().optional(),
  languageCode: z.string().optional(),
})

const paymentSchema = z.object({
  utmParameter: z.string().min(1),
  telegramUserId: z.number().int().positive(),
  amount: z.number().int().positive(),
  paymentId: z.string().optional(),
})

const eventSchema = z.object({
  event_type: z.enum(['app_open', 'payment']),
  data: z.record(z.any()), // Accept any data, validate based on event_type
})

/**
 * POST /api/v1/events
 * Receive tracking events from client SDK
 */
router.post('/', validateApiKey, requireClientKey, eventsRateLimiter, async (req, res) => {
  try {
    // Validate request body
    const result = eventSchema.safeParse(req.body)

    if (!result.success) {
      res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: result.error.issues,
      })
      return
    }

    const { event_type, data } = result.data

    if (event_type === 'app_open') {
      // Validate app_open specific data
      const appOpenValidation = appOpenSchema.safeParse(data)
      if (!appOpenValidation.success) {
        res.status(400).json({
          success: false,
          error: 'Invalid app_open data',
          details: appOpenValidation.error.issues,
        })
        return
      }
      const appOpenData = appOpenValidation.data

      await prisma.appOpen.upsert({
        where: {
          utmParameter_telegramUserId: {
            utmParameter: appOpenData.utmParameter,
            telegramUserId: BigInt(appOpenData.telegramUserId),
          },
        },
        update: {
          timestamp: new Date(),
        },
        create: {
          utmParameter: appOpenData.utmParameter,
          telegramUserId: BigInt(appOpenData.telegramUserId),
          username: appOpenData.username,
          languageCode: appOpenData.languageCode,
        },
      })

      res.json({
        success: true,
        message: 'App open tracked successfully',
      })
      return
    } else if (event_type === 'payment') {
      // Validate payment specific data
      const paymentValidation = paymentSchema.safeParse(data)
      if (!paymentValidation.success) {
        res.status(400).json({
          success: false,
          error: 'Invalid payment data',
          details: paymentValidation.error.issues,
        })
        return
      }
      const paymentData = paymentValidation.data
      console.log('Payment data received:', JSON.stringify(paymentData, null, 2))

      await prisma.payment.create({
        data: {
          utmParameter: paymentData.utmParameter,
          telegramUserId: BigInt(paymentData.telegramUserId),
          amount: paymentData.amount,
          paymentId: paymentData.paymentId,
        },
      })

      res.json({
        success: true,
        message: 'Payment tracked successfully',
      })
      return
    }

    res.status(400).json({
      success: false,
      error: 'Invalid event type',
    })
  } catch (error) {
    console.error('Events API error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    })
  }
})

export default router
