import express from 'express'
import cors from 'cors'
import contactRouter from './api/contact/route.js'

const app = express()

// CORS configuration
app.use(
  cors({
    origin: [
      'http://localhost:5173', // local frontend
      'https://ksg-security-backend-kri.vercel.app/', // deployed frontend
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  })
)

// Middleware
app.use(express.json())

// Routes
app.use('/api/contact', contactRouter)

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'KSG Security backend is running.',
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)

  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  })
})

export default app