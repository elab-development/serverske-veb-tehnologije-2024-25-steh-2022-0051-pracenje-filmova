import MediaItemLoader from "@/components/media-item-loader"
import SectionTitle from "@/components/ui/section-title"
import { Separator } from "@/components/ui/separator"
import { useSetPageTitle } from "@/hooks/use-set-page-title"
import { useWatchListDetails } from "@/hooks/use-watchlist"
import ClearWatchlist from "./_components/ClearWatchlist"
import {
  ExportWatchlist,
  ImportWatchlist,
} from "./_components/ImportExportWatchlist"
import WatchlistMediaItem, {
  WatchListMediaItemProps,
} from "./_components/WatchlistMediaItem"

const WatchlistPage = () => {
  const watchList = useWatchListDetails()
  useSetPageTitle("Watchlist")
  return (
    <section>
      <div className="flex items-end justify-between">
        <SectionTitle>Watchlist</SectionTitle>
        <div className="space-x-1">
          <ClearWatchlist />
          <ImportWatchlist />
          <ExportWatchlist />
        </div>
      </div>
      <Separator className="mb-12 mt-2" />
      <div className="flex flex-wrap justify-center gap-6 gap-y-8">
        {watchList.length > 0 ? (
          watchList?.map((q, i) => {
            if (q.isLoading) {
              return <MediaItemLoader key={i} />
            }
            if (q.isError) return null

            if (q.isSuccess) {
              return (
                <WatchlistMediaItem
                  showMediaType
                  key={i}
                  {...({
                    data: q.data,
                    mediaType: q.data.mediaType,
                  } as WatchListMediaItemProps)}
                />
              )
            }
            return null
          })
        ) : (
          <div className="w-full text-center">No items in your watchlist</div>
        )}
      </div>
    </section>
  )
}

export default WatchlistPage
