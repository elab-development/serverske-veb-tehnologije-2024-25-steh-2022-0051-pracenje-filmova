import nodemailer from "nodemailer"
import { env } from "../env"

let transporter: nodemailer.Transporter

export const getTransporter = async () => {
  if (transporter) {
    return transporter
  }
  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: env.ETHEREAL_USERNAME, // generated user
      pass: env.ETHEREAL_PASSWORD, // generated password
    },
  })

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
