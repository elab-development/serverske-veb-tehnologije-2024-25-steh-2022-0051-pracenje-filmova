import {
  and,
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  isNotNull,
  like,
} from "drizzle-orm"
import { createSelectSchema } from "drizzle-zod"
import * as z from "zod/v4"
import { db } from "../../db/drizzle"
import { user } from "../../db/schema/auth-schema"
import {
  BugFlagEnum,
  bugFlagEnum,
  bugReport,
} from "../../db/schema/report-schema"
import { adminProcedure, protectedProcedure, router } from "../trpc"

const bugReportSelectSchema = createSelectSchema(bugReport)

export const reportsRouter = router({
  submitReport: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/reports/submit",
        tags: ["Reports"],
        summary: "Submit a bug report",
        protect: true,
      },
    })
    .input(
      z.object({
        title: z.string().min(10).max(100),
        flag: z
          .string()
          .refine((val) => bugFlagEnum.includes(val as BugFlagEnum)),
        content: z.string().min(10).max(1500),
      }),
    )
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await db.insert(bugReport).values({
        title: input.title,
        flag: input.flag as BugFlagEnum,
        content: input.content,
        creatorId: ctx.user.id,
      })
      return { success: true }
    }),

  getAllReports: adminProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/reports",
        tags: ["Reports"],
        summary: "Get all bug reports (Admin only)",
        protect: true,
      },
    })
    .input(
      z.object({
        status: z.enum(["resolved", "unresolved"]).optional(),
        flag: z.enum(bugFlagEnum).optional(),
        creatorId: z.string().optional(),
        adminId: z.string().optional(),
        limit: z.number().min(1).max(50).default(10),
        offset: z.number().min(0).default(0),
        sortBy: z.enum(["createdAt", "title"]).default("createdAt"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
        id: z.string().max(64).optional(),
      }),
    )
    .output(
      z.object({
        reports: z.array(
          z.object({
            ...bugReportSelectSchema.shape,
            adminName: z.string().nullable(),
          }),
        ),
        numberOfPages: z.number(),
        totalReports: z.number(),
        showingReports: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const whereClauses = [isNotNull(bugReport.id)] // dummy always true condition to simplify appending further conditions
      if (input.status) {
        whereClauses.push(eq(bugReport.status, input.status))
      }
      if (input.flag) {
        whereClauses.push(eq(bugReport.flag, input.flag))
      }
      if (input.creatorId) {
        whereClauses.push(eq(bugReport.creatorId, input.creatorId))
      }
      if (input.adminId) {
        whereClauses.push(eq(bugReport.adminId, input.adminId))
      }
      if (input.id) {
        whereClauses.push(like(bugReport.id, `%${input.id}%`))
      }
      const reports = await db
        .select({
          ...getTableColumns(bugReport),
          adminName: user.name,
        })
        .from(bugReport)
        .leftJoin(user, eq(bugReport.adminId, user.id))
        .where(and(...whereClauses))
        .orderBy(
          input.sortOrder === "asc"
            ? asc(bugReport[input.sortBy])
            : desc(bugReport[input.sortBy]),
        )
        .limit(input.limit)
        .offset(input.offset)

      const totalReports = await db
        .select({
          count: count(),
        })
        .from(bugReport)
        .where(and(...whereClauses))

      return {
        reports,
        numberOfPages: Math.ceil(totalReports[0].count / input.limit),
        totalReports: totalReports[0].count,
        showingReports: reports.length,
      }
    }),

  updateReportStatus: adminProcedure
    .meta({
      openapi: {
        method: "PUT",
        path: "/reports/{reportId}/status",
        tags: ["Reports"],
        summary: "Update the status of a bug report (Admin only)",
        protect: true,
      },
    })
    .input(
      z.object({
        reportId: z.string().min(1),
        status: z.boolean().default(true),
      }),
    )
    .output(z.object({ ...bugReportSelectSchema.shape }))
    .mutation(async ({ input, ctx }) => {
      const report = await db
        .update(bugReport)
        .set({
          status: input.status ? "resolved" : "unresolved",
          resolvedAt: input.status ? new Date() : null,
          adminId: input.status ? ctx.user.id : null,
        })
        .where(eq(bugReport.id, input.reportId))
        .returning()
      return report[0]
    }),

  deleteReport: adminProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/reports/{reportId}/delete",
        tags: ["Reports"],
        summary: "Delete a bug report (Admin only)",
        protect: true,
      },
    })
    .output(z.object({ success: z.boolean() }))
    .input(
      z.object({
        reportId: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      await db.delete(bugReport).where(eq(bugReport.id, input.reportId))
      return { success: true }
    }),
})
