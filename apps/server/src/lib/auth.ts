import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { customSession, openAPI } from "better-auth/plugins"
import { eq } from "drizzle-orm"
import { db } from "../db/drizzle"
import * as authSchema from "../db/schema/auth-schema"
import { watchlist } from "../db/schema/watchlist-schema"
import { env } from "../env"
import { sendEmail } from "./email"
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      ...authSchema,
    },
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        default: "user",
        input: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(data) {
      await sendEmail({
        to: data.user.email,
        subject: "Password Reset",

        html: `<p>Click the link to reset your password: <a href="${data.url}">Reset</a></p>`,
      })
    },
    async onPasswordReset(data) {
      console.log("Password reset for user:", data.user.email)
    },
  },
  databaseHooks: {
    user: {
      create: {
        async after(user) {
          await db.insert(watchlist).values({
            userId: user.id,
            jsonData: JSON.stringify([]),
            id: crypto.randomUUID(),
          })
        },
      },
    },
  },
  trustedOrigins: [env.CLIENT_URL],
  plugins: [
    openAPI(),
    customSession(async ({ user, session }) => {
      const userRole = await db.query.user.findFirst({
        where: eq(authSchema.user.id, user.id),
        columns: {
          role: true,
        },
      })
      return {
        user: {
          ...user,
          role: userRole?.role || "error",
        },
        session,
      }
    }),
  ],
})

export type AuthServer = typeof auth
