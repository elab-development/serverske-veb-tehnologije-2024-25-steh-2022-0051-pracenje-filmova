import TMDBImage from "@/components/tmdb-image"
import GenreBadge from "@/components/ui/genre-badge"
import WatchListButton from "@/components/watchlist-button"
import { useGetGenreById } from "@/hooks/use-genres"
import { cn } from "@/lib/utils"
import { StarIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { MovieDetails, TvShowDetails } from "tmdb-ts"

export type WatchListMediaItemProps =
  | {
      mediaType: "movie"
      data: MovieDetails
    }
  | { mediaType: "tv"; data: TvShowDetails }

const WatchlistMediaItem = ({
  data,
  className,
  mediaType,
  showYear = true,
  showMediaType = false,
  ...props
}: WatchListMediaItemProps &
  React.HTMLAttributes<HTMLDivElement> & {
    showYear?: boolean
    showMediaType?: boolean
  }) => {
  const genres = useGetGenreById(
    data.genres.map((g) => g.id),
    mediaType,
  )

  return (
    <div
      className={cn(
        "flex min-h-full w-full max-w-48 flex-col justify-between gap-4",
        className,
      )}
      {...props}
    >
      <div className="space-y-4">
        <div className="group relative aspect-[2/3] w-full">
          <TMDBImage
            src={data.poster_path!}
            tmdbSize="poster"
            className="aspect-[2/3] w-full group-hover:opacity-80"
          />
          <div className="absolute right-0 top-0 bg-background/50 p-1">
            <span className="inline-flex h-9 w-9 flex-col items-center text-sm">
              <StarIcon className="inline" height={"1.5em"} />
              {data.vote_average.toFixed(2)}
            </span>
          </div>
          <h3 className="mt-4 text-base font-semibold">
            <Link
              to={`/${mediaType}/id/${data.id}`}
              className="whitespace-normal hover:underline"
            >
              {mediaType === "movie" ? data.title : data.name}{" "}
              <span className="absolute inset-0" aria-hidden></span>
            </Link>
          </h3>
        </div>

        <div className="space-y-2">
          {showYear && (
            <span className="mt-2 block text-sm font-bold text-muted-foreground">
              {mediaType === "movie"
                ? new Date(data.release_date).getFullYear()
                : new Date(data.first_air_date).getFullYear()}
            </span>
          )}
          {showMediaType && (
            <span className="block text-sm text-muted-foreground">
              {mediaType === "movie" ? "Movie" : "TV Show"}
            </span>
          )}
          <div className="mt-1 flex flex-wrap gap-1">
            {genres?.map(
              (genre) =>
                genre && (
                  <GenreBadge
                    key={genre.id}
                    genre={genre}
                    mediaType={mediaType}
                    size="sm"
                  />
                ),
            )}
          </div>
        </div>
      </div>
      <div className="flex">
        <WatchListButton
          size={"sm"}
          className="flex-1"
          mediaType={mediaType}
          mediaId={data.id}
          variant={"outline"}
        >
          Remove from watchlist
        </WatchListButton>
      </div>
    </div>
  )
}

export default WatchlistMediaItem
