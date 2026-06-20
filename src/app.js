import express from 'express'
import cors from 'cors'
import contactRouter from './api/contact/route.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/contact', contactRouter)

app.get('/', (req, res) => {
  res.json({ success: true, message: 'KSG Security backend is running.' })
})

export default app
