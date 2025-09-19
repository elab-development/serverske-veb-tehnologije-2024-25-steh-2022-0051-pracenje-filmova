import { useTMDB } from "@/hooks/use-tmdb"
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
  const query = useQuery({
    queryKey: ["watchList"],
    queryFn: () => {
      const watchList = localStorage.getItem("watchList")
      return watchList ? (JSON.parse(watchList) as WatchList) : []
    },
    staleTime: Infinity,
  })

  return query
}

export const useWatchListDetails = () => {
  const tmdb = useTMDB()
  const watchList = useWatchList()
  //getting watchlist details from local storage with react query
  const query = useQueries({
    queries:
      watchList.data?.map((item) => ({
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
  const mutation = useMutation({
    mutationKey: ["watchlist"],
    mutationFn: async (newItem: WatchListItem) => {
      let watchList = JSON.parse(
        localStorage.getItem("watchList") || "[]",
      ) as WatchList

      const existingItem = watchList.findIndex(
        (item) =>
          item.id === newItem.id && item.mediaType === newItem.mediaType,
      )
      if (existingItem !== -1) {
        watchList = watchList.filter((item) => item.id !== newItem.id)
      } else {
        watchList.push(newItem)
      }
      localStorage.setItem("watchList", JSON.stringify(watchList))
      return watchList
    },
    onMutate: async (newItem: WatchListItem) => {
      //optimistic update
      await queryClient.cancelQueries({
        queryKey: ["watchList"],
      })
      queryClient.setQueryData<WatchList | undefined>(["watchList"], (old) => {
        if (!old) return
        const existingItem = old.findIndex(
          (item) =>
            item.id === newItem.id && item.mediaType === newItem.mediaType,
        )
        if (existingItem !== -1) {
          return old.filter((item) => item.id !== newItem.id)
        } else {
          old.push(newItem)
          return old
        }
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["watchList"],
      })
    },
  })

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
