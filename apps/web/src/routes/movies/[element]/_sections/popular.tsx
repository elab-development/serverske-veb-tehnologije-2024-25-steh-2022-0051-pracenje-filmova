import { useTMDB } from "@/hooks/use-tmdb"
import { useQuery } from "@tanstack/react-query"

import MediaItem from "@/components/media-item"
import LoadingMediaGrid from "@/components/media-loading-grid"
import SectionTitle from "@/components/ui/section-title"
import { Separator } from "@/components/ui/separator"
import { useSetPageTitle } from "@/hooks/use-set-page-title"
import { AppError } from "@/lib/models/app-error"

const PopularMovies = () => {
  const tmdb = useTMDB()
  useSetPageTitle("Popular Movies")
  const { data, isLoading, isSuccess, isError, error } = useQuery({
    queryKey: ["movies", "popular"],
    queryFn: () => tmdb.movies.popular(),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  })

  if (isLoading) {
    return <LoadingMediaGrid length={20} title="Popular Movies" />
  }
  if (isError) {
    throw new AppError(error)
  }
  if (isSuccess)
    return (
      <section>
        <SectionTitle>Popular Movies</SectionTitle>
        <Separator className="mb-12 mt-2" />

        <div className="flex flex-wrap justify-center gap-6 gap-y-8">
          {data?.results.map((movie) => (
            <MediaItem key={movie.id} mediaType="movie" data={movie} />
          ))}
        </div>
      </section>
    )

  return null
}

export default PopularMovies
