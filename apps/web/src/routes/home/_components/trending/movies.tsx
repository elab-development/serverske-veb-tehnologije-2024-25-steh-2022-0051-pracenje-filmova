import MediaCarousel from "@/components/media-carousel"
import MediaItem from "@/components/media-item"
import TMDBImage from "@/components/tmdb-image"
import { Button } from "@/components/ui/button"
import SectionTitle from "@/components/ui/section-title"
import { Separator } from "@/components/ui/separator"
import WatchListButton from "@/components/watchlist-button"
import { useGetGenreById } from "@/hooks/use-genres"
import { useTMDB } from "@/hooks/use-tmdb"
import { AppError } from "@/lib/models/app-error"
import { useQuery } from "@tanstack/react-query"
import { ExternalLink, StarIcon } from "lucide-react"
import { Link } from "react-router-dom"
import TrendingLoader from "./loader"

const TrendingMovies = () => {
  const tmdb = useTMDB()

  const { data, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: ["trending", "movies"],
    queryFn: () => tmdb.trending.trending("movie", "week"),
    staleTime: Infinity,
  })

  const bigGenre = useGetGenreById(data?.results[0].genre_ids, "movie")

  if (isLoading) {
    return <TrendingLoader />
  }
  if (isError) {
    throw new AppError(error)
  }

  if (isSuccess)
    return (
      <section>
        <div className="relative mb-12 w-full">
          <div className="relative aspect-video w-full bg-muted">
            <TMDBImage
              sizes="100vw"
              src={data.results[0].backdrop_path}
              tmdbSize="backdrop"
              alt=""
              className="w-full object-cover"
            />
            <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-b from-transparent to-background/80">
              <div className="absolute bottom-0 left-0 space-y-1 p-2 lg:space-y-2 lg:p-4 xl:space-y-4 xl:p-8">
                <h3 className="text-xl font-bold lg:text-2xl xl:text-4xl">
                  {data.results[0].title}
                </h3>
                <span className="inline-block text-sm text-muted-foreground lg:text-base xl:text-xl">
                  {bigGenre
                    ?.map((genre) => genre?.name)
                    .join(", ")
                    .replace(/,/g, ", ")}
                </span>
              </div>
              <div className="absolute right-0 top-0 bg-background/50 p-1 lg:p-2">
                <div className="flex h-9 w-9 flex-col items-center justify-center text-sm lg:h-12 lg:w-12">
                  <StarIcon className="inline" height={"1.5em"} />
                  {data.results[0].vote_average.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-1 flex gap-1">
            <WatchListButton
              size={"sm"}
              className="flex-1 text-lg lg:py-8"
              mediaType={"movie"}
              mediaId={data.results[0].id}
            />
            <Button
              aria-label="Learn more"
              variant="secondary"
              size="sm"
              className="flex-1 border border-secondary lg:py-8"
              asChild
            >
              <Link to={`/movie/id/${data.results[0].id}`}>
                <ExternalLink height={"1em"} className="text-lg" />
              </Link>
            </Button>
          </div>
        </div>
        <SectionTitle>Trending movies</SectionTitle>
        <Separator className="mb-12 mt-2" />
        <MediaCarousel>
          {data.results.map((m, i) => {
            if (i == 0) return null
            else return <MediaItem key={i} data={m} mediaType="movie" />
          })}
        </MediaCarousel>
      </section>
    )
}

export default TrendingMovies
