import { eq } from "drizzle-orm"
import * as z from "zod/v4"
import { db } from "../../db/drizzle"
import { watchlist } from "../../db/schema/watchlist-schema"
import { protectedProcedure, router } from "../trpc"
export type WatchListItem = { mediaType: "movie" | "tv"; id: number }

export const watchListRouter = router({
  getWatchlist: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/watchlist",
        tags: ["Watchlist"],
        summary: "Get the current user's watchlist",
        protect: true,
      },
    })
    .input(z.void())
    .output(
      z.object({
        id: z.string(),
        userId: z.string(),
        jsonData: z.string(),
      }),
    )
    .query(async ({ ctx }) => {
      const watchlistEntity = await db.query.watchlist.findFirst({
        where: eq(watchlist.userId, ctx.user.id),
      })
      if (!watchlistEntity) {
        const newWatchlist = await db
          .insert(watchlist)
          .values({
            id: crypto.randomUUID(),
            userId: ctx.user.id,
            jsonData: JSON.stringify([]),
          })
          .returning()
        return newWatchlist[0]
      }
      return watchlistEntity
    }),
  updateWatchlist: protectedProcedure
    .meta({
      openapi: {
        method: "PUT",
        path: "/watchlist",
        tags: ["Watchlist"],
        summary: "Add or remove an item from the current user's watchlist",
        protect: true,
      },
    })
    .input(
      z.object({
        mediaType: z.string().refine((val) => val === "movie" || val === "tv"),
        id: z.number(),
      }),
    )
    .output(
      z.object({
        id: z.string(),
        userId: z.string(),
        jsonData: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const watchlistEntity = await db.query.watchlist.findFirst({
        where: eq(watchlist.userId, ctx.user.id),
      })
      if (!watchlistEntity) {
        throw new Error("Watchlist not found")
      }
      const currentWatchlist: WatchListItem[] = JSON.parse(
        watchlistEntity.jsonData,
      )
      const exists = currentWatchlist.find(
        (item) => item.id === input.id && item.mediaType === input.mediaType,
      )
      let newWatchlist: WatchListItem[]
      if (exists) {
        newWatchlist = currentWatchlist.filter(
          (item) =>
            !(item.id === input.id && item.mediaType === input.mediaType),
        )
      } else {
        newWatchlist = [
          ...currentWatchlist,
          { mediaType: input.mediaType as "movie" | "tv", id: input.id },
        ]
      }
      const updatedWatchlist = await db
        .update(watchlist)
        .set({ jsonData: JSON.stringify(newWatchlist) })
        .where(eq(watchlist.id, watchlistEntity.id))
        .returning()
      return updatedWatchlist[0]
    }),
  importWatchlist: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/watchlist/import",
        tags: ["Watchlist"],
        summary: "Import another watchlist into the current user's watchlist",
        protect: true,
      },
    })
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .output(
      z.object({
        id: z.string(),
        userId: z.string(),
        jsonData: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const usersWatchlist = await db.query.watchlist.findFirst({
        where: eq(watchlist.userId, ctx.user.id),
      })
      if (!usersWatchlist) {
        throw new Error("User's watchlist not found")
      }
      const watchlistToImport = await db.query.watchlist.findFirst({
        where: eq(watchlist.id, input.id),
      })
      if (!watchlistToImport) {
        throw new Error("Watchlist to import not found")
      }
      const usersCurrentWatchlist: WatchListItem[] = JSON.parse(
        usersWatchlist.jsonData,
      )
      const importWatchlistItems: WatchListItem[] = JSON.parse(
        watchlistToImport.jsonData,
      )
      const mergedWatchlist = [
        ...usersCurrentWatchlist,
        ...importWatchlistItems.filter(
          (importItem) =>
            !usersCurrentWatchlist.some(
              (userItem) =>
                userItem.id === importItem.id &&
                userItem.mediaType === importItem.mediaType,
            ),
        ),
      ]
      const updatedWatchlist = await db
        .update(watchlist)
        .set({ jsonData: JSON.stringify(mergedWatchlist) })
        .where(eq(watchlist.id, usersWatchlist.id))
        .returning()
      return updatedWatchlist[0]
    }),
  clearWatchlist: protectedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/watchlist",
        tags: ["Watchlist"],
        summary: "Clear the current user's watchlist",
        protect: true,
      },
    })
    .input(z.void())
    .output(
      z.object({
        id: z.string(),
        userId: z.string(),
        jsonData: z.string(),
      }),
    )
    .mutation(async ({ ctx }) => {
      const usersWatchlist = await db.query.watchlist.findFirst({
        where: eq(watchlist.userId, ctx.user.id),
      })
      if (!usersWatchlist) {
        throw new Error("User's watchlist not found")
      }
      const updatedWatchlist = await db
        .update(watchlist)
        .set({ jsonData: JSON.stringify([]) })
        .where(eq(watchlist.id, usersWatchlist.id))
        .returning()
      return updatedWatchlist[0]
    }),
})
