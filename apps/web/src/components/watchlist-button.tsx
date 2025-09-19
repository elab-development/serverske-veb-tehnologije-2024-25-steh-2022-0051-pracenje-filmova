import {
  WatchListItem,
  useMutateWatchlist,
  useWatchList,
} from "@/hooks/use-watchlist"
import { cn } from "@/lib/utils"
import { HeartIcon } from "lucide-react"
import { Button, ButtonProps } from "./ui/button"

const WatchListButton = ({
  mediaId,
  mediaType,
  className,
  children,
  withText = false,
  ...props
}: ButtonProps & {
  mediaType: WatchListItem["mediaType"]
  mediaId: number
  withText?: boolean
}) => {
  const watchList = useWatchList()
  const isWatchlisted = watchList.data?.some(
    (item) => item.id === mediaId && item.mediaType === mediaType,
  )
  const watchListMutate = useMutateWatchlist()
  return (
    <Button
      variant={isWatchlisted ? "default" : "outline"}
      onClick={() => watchListMutate.mutate({ id: mediaId, mediaType })}
      disabled={
        watchList.isLoading ||
        watchList.isError ||
        watchListMutate.isPending ||
        watchListMutate.isPaused
      }
      className={cn("border", isWatchlisted && "border-primary", className)}
      {...props}
      aria-label={
        props["aria-label"] ||
        (isWatchlisted ? "Remove from" : "Add to") + " watchlist"
      }
    >
      {children ? (
        children
      ) : (
        <>
          <HeartIcon
            height={"1em"}
            className={cn(isWatchlisted && "fill-primary-foreground")}
          />
          {withText && (
            <span className="ml-2">
              {isWatchlisted ? "Watchlisted" : "Add to watchlist"}
            </span>
          )}
        </>
      )}
    </Button>
  )
}

export default WatchListButton
