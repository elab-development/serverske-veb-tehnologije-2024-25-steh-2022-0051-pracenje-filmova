import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "../db/drizzle"
import * as authSchema from "../db/schema/auth-schema"
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
  },
  trustedOrigins: ["http://localhost:5173"],
})

export type AuthServer = typeof auth
