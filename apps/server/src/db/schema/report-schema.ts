import { relations } from "drizzle-orm"
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
export type BugFlagEnum = (typeof bugFlagEnum)[number]

// Enum for bug report status
export const bugStatusEnum = ["resolved", "unresolved"] as const
export type BugStatusEnum = (typeof bugStatusEnum)[number]

export const bugReport = sqliteTable("bug_reports", {
  id: text("id").primaryKey().default(crypto.randomUUID()),
  title: text("report_title").notNull(),
  creatorId: text("creator_id"), // dont delete the bug if the user is deleted
  flag: text("flag", { enum: bugFlagEnum }).notNull(),
  content: text("content").notNull(), // Can store markdown
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(new Date())
    .notNull(),
  resolvedAt: integer("resolved_at", { mode: "timestamp" }),
  adminId: text("admin_id"), // nullable, only set if resolved
  status: text("status", { enum: bugStatusEnum })
    .default("unresolved")
    .notNull(),
})

export const reportRelations = relations(bugReport, ({ one }) => ({
  creator: one(user, {
    fields: [bugReport.creatorId],
    references: [user.id],
  }),
  admin: one(user, { fields: [bugReport.adminId], references: [user.id] }),
}))
