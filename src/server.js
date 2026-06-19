import 'dotenv/config'
import app from './app.js'

const port = process.env.PORT || 3000

console.log('ENV loaded:', {
  EMAIL_HOST: !!process.env.EMAIL_HOST,
  EMAIL_USER: !!process.env.EMAIL_USER,
  EMAIL_PASS: !!process.env.EMAIL_PASS,
  EMAIL_TO: !!process.env.EMAIL_TO,
})

app.listen(port, () => {
  console.log(`Contact server listening on http://localhost:${port}`)
})
