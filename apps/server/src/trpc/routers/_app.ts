import { router } from "../trpc"
import { reportsRouter } from "./reports"
import { watchListRouter } from "./watchlist"

export const appRouter = router({
  watchlist: watchListRouter,
  reports: reportsRouter,
})
// export type definition of API
export type AppRouter = typeof appRouter
