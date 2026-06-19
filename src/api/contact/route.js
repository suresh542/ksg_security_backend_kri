import express from 'express'
import nodemailer from 'nodemailer'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const emailHost = process.env.EMAIL_HOST
    const emailPort = Number(process.env.EMAIL_PORT || 587)
    const emailSecure = process.env.EMAIL_SECURE === 'true'
    const emailUser = process.env.EMAIL_USER
    const emailPass = process.env.EMAIL_PASS
    const emailTo = process.env.EMAIL_TO || 'ksgsantharaj@gmail.com'

    const { fullName, phone, email, companyName, businessInfo, location } = req.body

    if (!fullName || !phone || !email || !companyName || !businessInfo || !location) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields.' })
    }

    if (!emailHost || !emailUser || !emailPass) {
      return res.status(500).json({ success: false, message: 'Mail server is not configured. Set EMAIL_HOST, EMAIL_USER, and EMAIL_PASS.' })
    }

    const transporter = nodemailer.createTransport({
      host: emailHost,
      port: emailPort,
      secure: emailSecure,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    })

    const subject = `KSG Contact form submission from ${companyName}`
    const html = `
      <h2>New contact request</h2>
      <p><strong>Full Name:</strong> ${fullName}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company Name:</strong> ${companyName}</p>
      <p><strong>Business:</strong> ${businessInfo}</p>
      <p><strong>Location:</strong> ${location}</p>
    `
    const text = `New contact request\nFull Name: ${fullName}\nPhone: ${phone}\nEmail: ${email}\nCompany Name: ${companyName}\nBusiness: ${businessInfo}\nLocation: ${location}`

    await transporter.sendMail({
      from: emailUser,
      to: emailTo,
      replyTo: email,
      subject,
      text,
      html,
    })

    console.log('Email sent successfully to:', emailTo)
    return res.json({ success: true, message: 'Message sent successfully.' })
  } catch (error) {
    console.error('Contact API error:', error)
    return res.status(500).json({ success: false, message: error.message || 'Unable to send email.' })
  }
})

export default router
