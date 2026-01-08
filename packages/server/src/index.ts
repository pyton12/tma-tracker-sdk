import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import eventsRouter from './api/events'
import analyticsRouter from './api/analytics'
import adminRouter from './api/admin'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API routes
app.use('/api/v1/events', eventsRouter)
app.use('/api/v1/analytics', analyticsRouter)
app.use('/api/v1/admin', adminRouter)

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found',
  })
})

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err)
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 TMA Tracker API server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`📡 Events API: http://localhost:${PORT}/api/v1/events`)
  console.log(`📈 Analytics API: http://localhost:${PORT}/api/v1/analytics`)
  console.log(`🔐 Admin API: http://localhost:${PORT}/api/v1/admin`)
})

export default app
