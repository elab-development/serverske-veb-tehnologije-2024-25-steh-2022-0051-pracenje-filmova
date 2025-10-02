import { z } from "zod/v4"
import { publicProcedure, router } from "../trpc"
import { reportsRouter } from "./reports"
import { watchListRouter } from "./watchlist"

export const appRouter = router({
  getUser: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(({ input }) => {
      return { id: input, name: "Bilbo" }
    }),
  watchlist: watchListRouter,
  reports: reportsRouter,
})
// export type definition of API
export type AppRouter = typeof appRouter
