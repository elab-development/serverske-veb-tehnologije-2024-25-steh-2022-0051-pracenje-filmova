import { useTMDB } from "@/hooks/use-tmdb"
import { useQuery } from "@tanstack/react-query"

import MediaItem from "@/components/media-item"
import LoadingMediaGrid from "@/components/media-loading-grid"
import SectionTitle from "@/components/ui/section-title"
import { Separator } from "@/components/ui/separator"
import { useSetPageTitle } from "@/hooks/use-set-page-title"
import { AppError } from "@/lib/models/app-error"

const OnTheAirShows = () => {
  const tmdb = useTMDB()
  useSetPageTitle("Shows on the air")
  const { data, isLoading, isSuccess, isError, error } = useQuery({
    queryKey: ["tvs", "on_the_air"],
    queryFn: () => tmdb.tvShows.onTheAir(),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  })

  if (isLoading) {
    return <LoadingMediaGrid length={20} title="Shows on the air" />
  }
  if (isError) {
    throw new AppError(error)
  }
  if (isSuccess)
    return (
      <section>
        <SectionTitle>Shows on the air</SectionTitle>
        <Separator className="mb-12 mt-2" />

        <div className="flex flex-wrap justify-center gap-6 gap-y-8">
          {data?.results.map((tv) => (
            <MediaItem key={tv.id} mediaType="tv" data={tv} />
          ))}
        </div>
      </section>
    )

  return null
}

export default OnTheAirShows
