import { sqliteTable, text } from "drizzle-orm/sqlite-core"
import { user } from "./auth-schema"

export const watchlist = sqliteTable("watchlist", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  jsonData: text("json_data").notNull(),
})
