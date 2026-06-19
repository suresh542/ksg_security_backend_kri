import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import contactRouter from './src/api/contact/route.js'

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use('/api/contact', contactRouter)

console.log('ENV loaded:', {
  EMAIL_HOST: !!process.env.EMAIL_HOST,
  EMAIL_USER: !!process.env.EMAIL_USER,
  EMAIL_PASS: !!process.env.EMAIL_PASS,
  EMAIL_TO: process.env.EMAIL_TO,
})

app.listen(port, () => {
  console.log(`Contact server listening on http://localhost:${port}`)
})
