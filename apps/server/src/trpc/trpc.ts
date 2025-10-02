import { initTRPC, TRPCError } from "@trpc/server"
import type { OpenApiMeta } from "trpc-to-openapi"
import type { Context } from "./context"

const t = initTRPC.meta<OpenApiMeta>().context<Context>().create()

export const router = t.router

export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure.use(async function isAuthed({
  ctx,
  next,
}) {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  })
})

export const adminProcedure = t.procedure.use(async function isAdmin({
  ctx,
  next,
}) {
  if (!ctx.user || ctx.user.role !== "admin") {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  })
})
