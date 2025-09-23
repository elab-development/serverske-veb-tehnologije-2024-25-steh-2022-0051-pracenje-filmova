import { useTMDB } from "@/hooks/use-tmdb"
import { trpc } from "@/lib/trpc"
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

export type WatchListItem = { mediaType: "movie" | "tv"; id: number }
export type WatchList = Array<WatchListItem>

export const useWatchList = () => {
  //getting watchlist from local storage with react query
  // const query = useQuery({
  //   queryKey: ["watchList"],
  //   queryFn: () => {
  //     const watchList = localStorage.getItem("watchList")
  //     return watchList ? (JSON.parse(watchList) as WatchList) : []
  //   },
  //   staleTime: Infinity,
  // })

  const queryTrpc = useQuery(
    trpc.watchlist.getUserWatchlist.queryOptions(undefined, {
      staleTime: Infinity,
    }),
  )

  return {
    ...queryTrpc,
    data: queryTrpc.data
      ? {
          ...queryTrpc.data,
          jsonData: JSON.parse(queryTrpc.data.jsonData) as WatchList,
        }
      : undefined,
  }
}

export const useWatchListDetails = () => {
  const tmdb = useTMDB()
  const watchList = useWatchList()
  //getting watchlist details from local storage with react query
  const query = useQueries({
    queries:
      watchList.data?.jsonData.map((item) => ({
        queryKey: [item.mediaType, item.id],
        queryFn: () => {
          if (item.mediaType === "movie") {
            return tmdb.movies
              .details(item.id)
              .then((value) => ({ ...value, mediaType: item.mediaType }))
          } else {
            return tmdb.tvShows
              .details(item.id)
              .then((value) => ({ ...value, mediaType: item.mediaType }))
          }
        },
        staleTime: Infinity,
      })) || [],
  })

  return query
}

export const useMutateWatchlist = () => {
  const queryClient = useQueryClient()
  const mutation = useMutation(
    trpc.watchlist.updateUserWatchlist.mutationOptions({
      onMutate: async (newItem) => {
        //optimistic update

        await queryClient.cancelQueries({
          queryKey: trpc.watchlist.getUserWatchlist.queryOptions().queryKey,
        })
        queryClient.setQueryData(
          trpc.watchlist.getUserWatchlist.queryOptions().queryKey,
          (old) => {
            if (!old) return
            const parsedData = JSON.parse(old.jsonData) as WatchListItem[]
            const existingItem = parsedData.findIndex(
              (item) =>
                item.id === newItem.id && item.mediaType === newItem.mediaType,
            )
            if (existingItem !== -1) {
              return {
                ...old,
                jsonData: JSON.stringify(
                  parsedData.filter((item) => item.id !== newItem.id),
                ),
              }
            } else {
              parsedData.push({
                id: newItem.id,
                mediaType: newItem.mediaType as "movie" | "tv",
              })
              return {
                ...old,
                jsonData: JSON.stringify(parsedData),
              }
            }
          },
        )
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.watchlist.getUserWatchlist.queryOptions().queryKey,
        })
      },
    }),
  )

  return mutation
}

export const useSetWatchlist = () => {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationKey: ["watchlist"],
    mutationFn: async (newList: WatchList) => {
      localStorage.setItem("watchList", JSON.stringify(newList))
      return newList
    },
    onMutate: async (newList: WatchList) => {
      //optimistic update
      await queryClient.cancelQueries({
        queryKey: ["watchList"],
      })
      queryClient.setQueryData<WatchList | undefined>(["watchList"], newList)
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["watchList"],
      })
    },
  })

  return mutation
}
