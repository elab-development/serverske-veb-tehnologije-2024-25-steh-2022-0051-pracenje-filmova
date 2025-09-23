import "dotenv/config"
import { drizzle } from "drizzle-orm/libsql"
import { env } from "../env"
import * as authSchema from "./schema/auth-schema"
import * as watchlistSchema from "./schema/watchlist-schema"

export const db = drizzle(env.DB_FILE_NAME, {
  schema: {
    ...authSchema,
    ...watchlistSchema,
  },
})
