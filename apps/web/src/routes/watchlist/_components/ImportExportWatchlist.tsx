import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useImportWatchlist, useWatchlist } from "@/hooks/use-watchlist"
import { ToastOptions } from "@/lib/models/toast-options"
import { ImportIcon, Link2Icon } from "lucide-react"
import { useRef, useState } from "react"

export const ImportWatchlist = () => {
  const [open, setOpen] = useState(false)
  const importMutation = useImportWatchlist()
  const [code, setCode] = useState("")
  const { toast } = useToast()
  const handleImport = () => {
    // let object

    try {
      importMutation.mutate({
        id: code,
      })
    } catch (e) {
      toast(
        ToastOptions.createDestructive()
          .setTitle("Invalid import")
          .setDescription("The code you entered is invalid")
          .setDuration(3000),
      )
      return
    }

    // importMutation.mutate(object)
    toast(
      ToastOptions.create()
        .setTitle("Watchlist imported")
        .setDescription("Your watchlist has been imported")
        .setDuration(3000),
    )
    setOpen(false)
  }
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open)
        setCode("")
      }}
    >
      <DialogTrigger asChild>
        <Button variant={"secondary"} size={"icon"}>
          <ImportIcon size={"1.125em"} />
          <span className="sr-only">Import watchlist</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import watchlist</DialogTitle>
          <DialogDescription>
            Paste your watchlist code here to import it
          </DialogDescription>
          <div className="!my-4">
            <Input
              autoComplete="off"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your watchlist code here"
            ></Input>
          </div>

          <DialogFooter>
            <Button onClick={handleImport} type="submit">
              Import
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
export const ExportWatchlist = () => {
  const [open, setOpen] = useState(false)
  const currentWatchlist = useWatchlist()
  const code = currentWatchlist.data?.id || ""
  const { toast } = useToast()
  const inputRef = useRef<HTMLInputElement>(null)
  const canCopy =
    code && currentWatchlist.data && currentWatchlist.data.jsonData.length > 0
  const handleCopy = () => {
    if (inputRef.current === null || code !== inputRef.current.value) {
      toast(
        ToastOptions.createDestructive()
          .setTitle("Error")
          .setDescription("An error occurred while copying the code"),
      )
      return
    }
    inputRef.current?.focus()
    inputRef.current?.select()
    document.execCommand("copy")
    toast(
      ToastOptions.create()
        .setTitle("Copied to clipboard")
        .setDescription("Your watchlist code has been copied to the clipboard"),
    )

    setOpen(false)
  }
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open)
      }}
    >
      <DialogTrigger asChild>
        <Button variant={"secondary"} size={"icon"}>
          <Link2Icon size={"1.125em"} />
          <span className="sr-only">Export watchlist</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export watchlist</DialogTitle>
          <DialogDescription>
            Copy the code below to import your watchlist on another device
          </DialogDescription>
          <div className="!my-4">
            <Input
              ref={inputRef}
              onClick={(e) => e.currentTarget.select()}
              value={canCopy ? code : "Your watchlist is empty"}
              className="!resize-none"
              readOnly
              placeholder="Paste your watchlist code here"
            ></Input>
          </div>
          {canCopy && (
            <DialogFooter>
              <Button onClick={handleCopy}>Copy code</Button>
            </DialogFooter>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
