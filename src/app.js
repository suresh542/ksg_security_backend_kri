import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import contactRouter from './api/contact/route.js'

const app = express()

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/contact', contactRouter)

export default app
