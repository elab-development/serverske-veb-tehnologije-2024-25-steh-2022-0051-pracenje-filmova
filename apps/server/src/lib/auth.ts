import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { customSession } from "better-auth/plugins"
import { eq } from "drizzle-orm"
import { db } from "../db/drizzle"
import * as authSchema from "../db/schema/auth-schema"
import { watchlist } from "../db/schema/watchlist-schema"
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
  databaseHooks: {
    user: {
      create: {
        async after(user) {
          const createdWatchlist = await db.insert(watchlist).values({
            userId: user.id,
            jsonData: JSON.stringify([]),
            id: crypto.randomUUID(),
          })
        },
      },
    },
  },
  trustedOrigins: ["http://localhost:5173"],
  plugins: [
    customSession(async ({ user, session }) => {
      const roles = await db
        .select({
          role: authSchema.user.role,
        })
        .from(authSchema.user)
        .where(eq(authSchema.user.id, user.id))
      return {
        user: {
          ...user,
          role: roles[0]?.role || "kiturina serverska",
        },
        session,
      }
    }),
  ],
})

export type AuthServer = typeof auth
