import { Request, Response, NextFunction } from 'express'
import { prisma } from '../db/client'

export interface AuthRequest extends Request {
  apiKeyType?: 'client' | 'agency'
  clientId?: string
}

/**
 * Middleware to validate API key
 */
export async function validateApiKey(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const apiKey = req.headers['x-api-key'] as string

    if (!apiKey) {
      res.status(401).json({
        success: false,
        error: 'API key is required',
      })
      return
    }

    // Check if API key exists in database
    const apiKeyRecord = await prisma.apiKey.findUnique({
      where: { key: apiKey },
    })

    if (!apiKeyRecord || !apiKeyRecord.active) {
      res.status(401).json({
        success: false,
        error: 'Invalid or inactive API key',
      })
      return
    }

    // Update last used timestamp
    await prisma.apiKey.update({
      where: { key: apiKey },
      data: { lastUsedAt: new Date() },
    })

    // Store API key type and client ID in request
    req.apiKeyType = apiKeyRecord.type as 'client' | 'agency'
    req.clientId = apiKeyRecord.clientId

    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    })
  }
}

/**
 * Middleware to check if request is from client
 */
export function requireClientKey(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  if (req.apiKeyType !== 'client') {
    res.status(403).json({
      success: false,
      error: 'This endpoint requires a client API key',
    })
    return
  }
  next()
}

/**
 * Middleware to check if request is from agency
 */
export function requireAgencyKey(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  if (req.apiKeyType !== 'agency') {
    res.status(403).json({
      success: false,
      error: 'This endpoint requires an agency API key',
    })
    return
  }
  next()
}
