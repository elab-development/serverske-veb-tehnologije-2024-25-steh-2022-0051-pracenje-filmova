import { z } from "zod"
import { publicProcedure, router } from "../trpc"
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
  //   createUser: t.procedure
  //     .input(z.object({ name: z.string().min(5) }))
  //     .mutation(async (opts) => {
  //       // use your ORM of choice
  //       return await UserModel.create({
  //         data: opts.input,
  //       });
  //     }),
})
// export type definition of API
export type AppRouter = typeof appRouter
