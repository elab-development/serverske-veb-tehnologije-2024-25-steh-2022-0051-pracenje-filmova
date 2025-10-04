import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { MediaType } from "tmdb-ts"
import { useTMDB } from "./use-tmdb"

export const useGenres = () => {
  const tmdb = useTMDB()
  const movieGenres = useQuery({
    queryKey: ["genres", "movieGenres"],
    queryFn: () => tmdb.genres.movies(),
    staleTime: Infinity,
  })
  const tvGenres = useQuery({
    queryKey: ["genres", "tvGenres"],
    queryFn: () => tmdb.genres.tvShows(),
    staleTime: Infinity,
  })
  return { movieGenres, tvGenres }
}

export const useGetGenreById = (
  genreId: number[] | number | undefined,
  mediaType: Omit<MediaType, "person">,
) => {
  const { movieGenres, tvGenres } = useGenres()
  const genre = useMemo(() => {
    if (genreId === undefined) return undefined
    if (Array.isArray(genreId)) {
      return genreId.map((id) =>
        mediaType === "movie"
          ? movieGenres.data?.genres.find((g) => g.id === id)
          : tvGenres.data?.genres.find((g) => g.id === id),
      )
    }
    return mediaType === "movie"
      ? [movieGenres.data?.genres.find((g) => g.id === genreId)]
      : [tvGenres.data?.genres.find((g) => g.id === genreId)]
  }, [movieGenres, tvGenres, mediaType, genreId])

  return genre
}
