import nodemailer from 'nodemailer'

export default async function handler(req, res) {
  // CORS headers — allow your frontend domain
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed.' })
  }

  // Read env vars — these come from Vercel dashboard, NOT .env file
  const emailHost = process.env.EMAIL_HOST
  const emailPort = Number(process.env.EMAIL_PORT || 587)
  const emailSecure = process.env.EMAIL_SECURE === 'true'
  const emailUser = process.env.EMAIL_USER
  const emailPass = process.env.EMAIL_PASS
  const emailTo = process.env.EMAIL_TO || 'ksgsantharaj@gmail.com'

  // Debug log — visible in Vercel Function Logs
  console.log('ENV check:', {
    EMAIL_HOST: emailHost || 'MISSING',
    EMAIL_USER: emailUser || 'MISSING',
    EMAIL_PASS: emailPass ? 'SET' : 'MISSING',
    EMAIL_TO: emailTo,
  })

  const { fullName, phone, email, companyName, businessInfo, location } = req.body || {}

  if (!fullName || !phone || !email || !companyName || !businessInfo || !location) {
    return res.status(400).json({ success: false, message: 'Please fill in all required fields.' })
  }

  if (!emailHost || !emailUser || !emailPass) {
    return res.status(500).json({
      success: false,
      message: 'Mail server is not configured. Add EMAIL_HOST, EMAIL_USER, EMAIL_PASS in Vercel → Settings → Environment Variables.',
    })
  }

  try {
    const transporter = nodemailer.createTransport({
      host: emailHost,
      port: emailPort,
      secure: emailSecure,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    })

    const subject = `KSG Contact: ${companyName} – ${fullName}`
    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;">
        <h2 style="background:#0d1b2e;color:#fff;padding:16px 20px;border-radius:8px 8px 0 0;margin:0;">
          New Contact Request – KSG Security
        </h2>
        <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-top:none;">
          <tr><td style="padding:12px 16px;font-weight:600;background:#f9fafb;width:140px;">Full Name</td><td style="padding:12px 16px;">${fullName}</td></tr>
          <tr><td style="padding:12px 16px;font-weight:600;background:#f9fafb;">Phone</td><td style="padding:12px 16px;">${phone}</td></tr>
          <tr><td style="padding:12px 16px;font-weight:600;background:#f9fafb;">Email</td><td style="padding:12px 16px;"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:12px 16px;font-weight:600;background:#f9fafb;">Company</td><td style="padding:12px 16px;">${companyName}</td></tr>
          <tr><td style="padding:12px 16px;font-weight:600;background:#f9fafb;">Business Info</td><td style="padding:12px 16px;">${businessInfo}</td></tr>
          <tr><td style="padding:12px 16px;font-weight:600;background:#f9fafb;">Location</td><td style="padding:12px 16px;">${location}</td></tr>
        </table>
      </div>
    `
    const text = `New KSG Contact\n\nFull Name: ${fullName}\nPhone: ${phone}\nEmail: ${email}\nCompany: ${companyName}\nBusiness: ${businessInfo}\nLocation: ${location}`

    await transporter.sendMail({
      from: `"KSG Security Website" <${emailUser}>`,
      to: emailTo,
      replyTo: email,
      subject,
      text,
      html,
    })

    console.log('Email sent successfully to:', emailTo)
    return res.status(200).json({ success: true, message: 'Message sent successfully.' })
  } catch (error) {
    console.error('Nodemailer error:', error)
    return res.status(500).json({ success: false, message: error.message || 'Failed to send email.' })
  }
}