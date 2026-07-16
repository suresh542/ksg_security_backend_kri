import express from 'express'
import handler from '../contact.js'

const router = express.Router()

router.all('/', handler)

export default router
