import MediaItem from "@/components/media-item"
import MediaItemLoader from "@/components/media-item-loader"
import SectionTitle from "@/components/ui/section-title"
import { Separator } from "@/components/ui/separator"
import { useSetPageTitle } from "@/hooks/use-set-page-title"
import { useTMDB } from "@/hooks/use-tmdb"
import { AppError } from "@/lib/models/app-error"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"
import { Movie, TV } from "tmdb-ts"

const SearchPage = () => {
  const [searchParams] = useSearchParams()
  const tmdb = useTMDB()
  const query = searchParams.get("s") || ""
  useSetPageTitle(query ? `Search - ${query}` : undefined)
  const { data, isError, error, isLoading, isSuccess } = useQuery({
    queryKey: ["search", query],
    queryFn: () => tmdb.search.multi({ query }),
    staleTime: 1000 * 60 * 60,
    select: (data) => {
      const newData = JSON.parse(JSON.stringify(data)) as typeof data
      newData.results = data.results.filter(
        (result) =>
          result.media_type !== "person" && result.poster_path != null,
      )
      return newData
    },
  })
  if (isLoading) {
    return (
      <>
        <h1 className="relative text-xl font-bold lg:text-2xl">
          Search - "{query}"
        </h1>
        <Separator className="mb-12 mt-2" />
        <div className="flex flex-wrap justify-center gap-6 gap-y-8">
          {Array.from({ length: 20 }).map((_, i) => (
            <MediaItemLoader key={i} />
          ))}
        </div>
      </>
    )
  }
  if (isError) {
    throw new AppError(error)
  }

  if (isSuccess)
    return (
      <section>
        <SectionTitle>Search - "{query}"</SectionTitle>
        <Separator className="mb-12 mt-2" />
        <div className="flex flex-wrap justify-center gap-6 gap-y-8">
          {data?.results.map((res) => {
            const props = {
              mediaType: res.media_type as "tv" | "movie",
              data: res as Movie | TV,
            } as
              | { mediaType: "tv"; data: TV }
              | { mediaType: "movie"; data: Movie }
            return <MediaItem key={res.id} {...props} showMediaType />
          })}
        </div>
      </section>
    )
}

export default SearchPage
