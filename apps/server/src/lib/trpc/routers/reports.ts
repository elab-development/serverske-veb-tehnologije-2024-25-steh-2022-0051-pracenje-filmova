import { and, asc, desc, eq, isNotNull } from "drizzle-orm"
import z from "zod"
import { db } from "../../../db/drizzle"
import {
  BugFlagEnum,
  bugFlagEnum,
  bugReport,
} from "../../../db/schema/report-schema"
import { adminProcedure, protectedProcedure, router } from "../trpc"

export const reportsRouter = router({
  submitReport: protectedProcedure
    .input(
      z.object({
        title: z.string().min(2).max(100),
        flag: z
          .string()
          .refine((val) => bugFlagEnum.includes(val as BugFlagEnum)),
        content: z.string().min(10).max(1000),
      }),
    )
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
    //add some filters
    .input(
      z.object({
        status: z.enum(["resolved", "unresolved"]).optional(),
        flag: z.enum(bugFlagEnum).optional(),
        creatorId: z.string().optional(),
        adminId: z.string().optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
        sortBy: z
          .enum(["createdAt", "resolvedAt", "title", "flag", "status"])
          .default("createdAt"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
      }),
    )
    .query(async ({ input }) => {
      const whereClauses = [isNotNull(bugReport.id)] // dummy clause to simplify logic
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
      const reports = await db
        .select()
        .from(bugReport)
        .where(and(...whereClauses))
        .orderBy(
          input.sortOrder === "asc"
            ? asc(bugReport[input.sortBy])
            : desc(bugReport[input.sortBy]),
        )
        .limit(input.limit)
        .offset(input.offset)
      return reports
    }),
})
