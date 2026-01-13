import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../db/client'
import { generateApiKey } from '../scripts/generateApiKeys'

const router = Router()

/**
 * Middleware to validate admin secret
 */
function validateAdminSecret(req: any, res: any, next: any): void {
  const adminSecret = req.headers['x-admin-secret'] as string
  const expectedSecret = process.env.ADMIN_SECRET

  if (!expectedSecret) {
    res.status(500).json({
      success: false,
      error: 'Admin API is not configured. Set ADMIN_SECRET environment variable.',
    })
    return
  }

  if (!adminSecret || adminSecret !== expectedSecret) {
    res.status(401).json({
      success: false,
      error: 'Invalid or missing admin secret',
    })
    return
  }

  next()
}

// Validation schemas
const generateKeySchema = z.object({
  type: z.enum(['client', 'agency']),
  clientId: z.string().min(1).max(100), // Required client ID
  name: z.string().min(1).max(100).optional(),
})

const deleteKeySchema = z.object({
  key: z.string().min(1),
})

/**
 * POST /api/v1/admin/keys/generate
 * Generate a new API key
 */
router.post('/keys/generate', validateAdminSecret, async (req, res) => {
  try {
    const result = generateKeySchema.safeParse(req.body)

    if (!result.success) {
      res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: result.error.issues,
      })
      return
    }

    const { type, clientId, name } = result.data
    const newKey = generateApiKey()

    const apiKey = await prisma.apiKey.create({
      data: {
        key: newKey,
        type,
        clientId,
        name: name || `${type.charAt(0).toUpperCase() + type.slice(1)} Key`,
        active: true,
      },
    })

    res.json({
      success: true,
      data: {
        id: apiKey.id,
        key: apiKey.key,
        type: apiKey.type,
        clientId: apiKey.clientId,
        name: apiKey.name,
        active: apiKey.active,
        createdAt: apiKey.createdAt,
      },
    })
  } catch (error) {
    console.error('Admin API - Generate key error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    })
  }
})

/**
 * GET /api/v1/admin/keys/list
 * List all API keys (without showing full key for security)
 */
router.get('/keys/list', validateAdminSecret, async (_req, res) => {
  try {
    const apiKeys = await prisma.apiKey.findMany({
      orderBy: { createdAt: 'desc' },
    })

    const sanitizedKeys = apiKeys.map(key => ({
      id: key.id,
      key: `${key.key.substring(0, 8)}...${key.key.substring(key.key.length - 8)}`, // Show only first and last 8 chars
      type: key.type,
      clientId: key.clientId,
      name: key.name,
      active: key.active,
      createdAt: key.createdAt,
      lastUsedAt: key.lastUsedAt,
    }))

    res.json({
      success: true,
      data: sanitizedKeys,
    })
  } catch (error) {
    console.error('Admin API - List keys error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    })
  }
})

/**
 * DELETE /api/v1/admin/keys/delete
 * Delete (deactivate) an API key
 */
router.delete('/keys/delete', validateAdminSecret, async (req, res) => {
  try {
    const result = deleteKeySchema.safeParse(req.body)

    if (!result.success) {
      res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: result.error.issues,
      })
      return
    }

    const { key } = result.data

    const apiKey = await prisma.apiKey.update({
      where: { key },
      data: { active: false },
    })

    res.json({
      success: true,
      message: 'API key deactivated successfully',
      data: {
        id: apiKey.id,
        type: apiKey.type,
        name: apiKey.name,
      },
    })
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({
        success: false,
        error: 'API key not found',
      })
      return
    }

    console.error('Admin API - Delete key error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    })
  }
})

export default router

