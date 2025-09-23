import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { user } from "./auth-schema"

// Enum for bug report flags
export const bugFlagEnum = [
  "UI",
  "Backend",
  "Performance",
  "Security",
  "Other",
] as const

// Enum for bug report status
export const bugStatusEnum = ["resolved", "unresolved"] as const

export const reportSchema = sqliteTable("bug_reports", {
  id: text("id").primaryKey().default(crypto.randomUUID()),
  creatorId: text("creator_id").references(() => user.id, {
    onDelete: "set null",
  }), // dont delete the bug if the user is deleted
  flag: text("flag", { enum: bugFlagEnum }).notNull(),
  content: text("content").notNull(), // Can store markdown
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(new Date())
    .notNull(),
  resolvedAt: integer("resolved_at", { mode: "timestamp" }),
  adminId: text("admin_id").references(() => user.id, {
    onDelete: "set null",
  }), // nullable, only set if resolved
  status: text("status", { enum: bugStatusEnum })
    .default("unresolved")
    .notNull(),
})
