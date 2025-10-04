import MediaItem from "@/components/media-item"
import MediaItemLoader from "@/components/media-item-loader"
import PaginationBar from "@/components/pagination-bar"
import { Separator } from "@/components/ui/separator"
import { useGetGenreById } from "@/hooks/use-genres"
import usePageNumber from "@/hooks/use-page-number"
import { useSetPageTitle } from "@/hooks/use-set-page-title"
import { useTMDB } from "@/hooks/use-tmdb"
import { AppError } from "@/lib/models/app-error"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"

const GenreMovies = () => {
  const { id } = useParams<{ id: string }>()
  const { pageNumber } = usePageNumber()
  const tmdb = useTMDB()
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["genre", "movie", id, pageNumber],
    queryFn: () => tmdb.discover.movie({ with_genres: id, page: pageNumber }),
    staleTime: 1000 * 60 * 60, // 1 hour
  })
  const genre = useGetGenreById(id ? parseInt(id) : undefined, "movie")
  useSetPageTitle(genre?.[0]?.name ? `Movies - ${genre?.[0]?.name}` : undefined)
  if (isLoading) {
    return (
      <>
        <h1 className="relative text-xl font-bold lg:text-2xl">
          Movies - {genre?.[0]?.name}
          <span className="absolute -bottom-8 left-0 !text-sm font-semibold text-muted-foreground">
            Page - {pageNumber}
          </span>
        </h1>
        <Separator className="mb-12 mt-2" />
        <div className="flex flex-wrap justify-center gap-6 gap-y-8">
          {Array.from({ length: 20 }).map((_, i) => (
            <MediaItemLoader key={i} />
          ))}
        </div>
        {/* pagination bar loading */}
        <Separator className="my-12" />

        <div className="mx-auto h-9 w-64 max-w-full animate-pulse bg-muted"></div>
      </>
    )
  }
  if (isError) {
    throw new AppError(error)
  }
  return (
    <section>
      <h1 className="relative text-xl font-bold lg:text-2xl">
        Movies - {genre?.[0]?.name}
        <span className="absolute -bottom-8 left-0 !text-sm font-semibold text-muted-foreground">
          Page - {pageNumber}
        </span>
      </h1>
      <Separator className="mb-12 mt-2" />
      <div className="flex flex-wrap justify-center gap-6 gap-y-8">
        {data?.results.map((m) => (
          <MediaItem key={m.id} mediaType="movie" data={m} />
        ))}
      </div>
      <Separator className="my-12" />
      <PaginationBar total_pages={data?.total_pages ?? -1} />
    </section>
  )
}

export default GenreMovies
