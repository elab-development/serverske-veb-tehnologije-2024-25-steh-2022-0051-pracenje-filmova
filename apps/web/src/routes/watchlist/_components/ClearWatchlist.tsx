import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { useSetWatchlist, useWatchList } from "@/hooks/use-watchlist"
import { ToastOptions } from "@/lib/models/toast-options"
import { TrashIcon } from "lucide-react"
import { useState } from "react"

const ClearWatchlist = () => {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const setWatchlistMutation = useSetWatchlist()
  const watchlist = useWatchList()
  const isDisabled =
    watchlist.isLoading ||
    watchlist.isError ||
    setWatchlistMutation.isPending ||
    setWatchlistMutation.isPaused ||
    watchlist.data?.length === 0
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"destructive"} size={"icon"} disabled={isDisabled}>
          <TrashIcon size={"1.125em"} />
          <span className="sr-only">Clear watchlist</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Clear Watchlist</DialogTitle>
        <DialogDescription>
          Are you sure you want to clear your watchlist?
        </DialogDescription>

        <DialogFooter className="gap-2 !space-x-0">
          <DialogClose asChild>
            <Button variant={"secondary"}>Cancel</Button>
          </DialogClose>
          <Button
            disabled={isDisabled}
            variant={"destructive"}
            onClick={() => {
              setWatchlistMutation.mutate([])
              setOpen(false)
              toast(ToastOptions.createDefault().setTitle("Watchlist cleared"))
            }}
          >
            Clear Watchlist
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ClearWatchlist
