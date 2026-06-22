import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import contactRouter from './src/api/contact/route.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/contact', contactRouter)

// Keep this for local development
const port = process.env.PORT || 3000
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
  })
}

export default app  