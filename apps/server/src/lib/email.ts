import nodemailer from "nodemailer"
import { env } from "../env"

let transporter: nodemailer.Transporter

const createTransport = () => {
  if (env.NODE_ENV === "production") {
    return nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465, // true for 465, false for other ports
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD,
      },
    })
  }

  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: env.ETHEREAL_USERNAME, // generated user
      pass: env.ETHEREAL_PASSWORD, // generated password
    },
  })
}

export const getTransporter = async () => {
  if (transporter) {
    return transporter
  }
  transporter = createTransport()

  return transporter
}

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) => {
  const transporter = await getTransporter()
  const info = await transporter.sendMail({
    from: "Sipka Misa Neca <noreply@steh.com>",
    to,
    subject,
    html,
  })
  console.log("Message sent: %s", info.messageId)
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
}
