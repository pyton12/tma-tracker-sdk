import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../db/client'
import { validateApiKey, requireAgencyKey } from '../middleware/auth'
import { analyticsRateLimiter } from '../middleware/rateLimit'

const router = Router()

// Validation schema
const analyticsRequestSchema = z.object({
  client_id: z.string().min(1),
  utm_parameters: z.array(z.string().min(1)).min(1).max(100),
})

/**
 * POST /api/v1/analytics
 * Get analytics for specified UTM parameters (agency access only)
 */
router.post('/', validateApiKey, requireAgencyKey, analyticsRateLimiter, async (req, res) => {
  try {
    // Validate request body
    const result = analyticsRequestSchema.safeParse(req.body)

    if (!result.success) {
      res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: result.error.issues,
      })
      return
    }

    const { client_id, utm_parameters } = result.data

    // Get analytics for each UTM parameter filtered by client_id
    const analyticsData = await Promise.all(
      utm_parameters.map(async utmParameter => {
        // Count unique users by FIRST UTM parameter and client_id
        const uniqueUsers = await prisma.user.count({
          where: {
            clientId: client_id,
            firstUtmParameter: utmParameter
          },
        })

        // Get payment statistics (payments are already attributed to first UTM)
        const paymentStats = await prisma.payment.groupBy({
          by: ['utmParameter'],
          where: {
            clientId: client_id,
            utmParameter
          },
          _count: {
            telegramUserId: true,
          },
          _sum: {
            amount: true,
          },
        })

        // Count unique paying users for this client
        const payingUsers = await prisma.payment.findMany({
          where: {
            clientId: client_id,
            utmParameter
          },
          distinct: ['telegramUserId'],
          select: { telegramUserId: true },
        })

        const totalRevenue = paymentStats[0]?._sum.amount || 0
        const payingUsersCount = payingUsers.length
        const conversionRate = uniqueUsers > 0 ? (payingUsersCount / uniqueUsers) * 100 : 0

        return {
          utm_parameter: utmParameter,
          unique_users: uniqueUsers,
          paying_users: payingUsersCount,
          total_revenue_stars: totalRevenue,
          conversion_rate: parseFloat(conversionRate.toFixed(2)),
        }
      })
    )

    res.json({
      success: true,
      data: analyticsData,
    })
  } catch (error) {
    console.error('Analytics API error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    })
  }
})

export default router
