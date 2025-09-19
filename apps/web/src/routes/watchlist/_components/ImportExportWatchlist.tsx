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
import { Textarea } from "@/components/ui/textarea"
import { useSetWatchlist, useWatchList } from "@/hooks/use-watchlist"
import { ToastOptions } from "@/lib/models/toast-options"
import { ImportIcon, Link2Icon } from "lucide-react"
import { useRef, useState } from "react"

export const ImportWatchlist = () => {
  const [open, setOpen] = useState(false)
  const importMutation = useSetWatchlist()
  const [code, setCode] = useState("")
  const { toast } = useToast()
  const handleImport = () => {
    let object

    try {
      object = JSON.parse(code)
      if (
        !Array.isArray(object) ||
        object.length === 0 ||
        object.some((item) => !item.mediaType || !item.id)
      )
        throw new Error("Invalid code")
    } catch (e) {
      toast(
        ToastOptions.createDestructive()
          .setTitle("Invalid code")
          .setDescription("The code you entered is invalid")
          .setDuration(3000),
      )
      return
    }

    importMutation.mutate(object)
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
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your watchlist code here"
            ></Textarea>
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
  const currentWatchlist = useWatchList()
  const code = JSON.stringify(currentWatchlist.data)
  const { toast } = useToast()
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const canCopy = currentWatchlist.data && currentWatchlist.data.length > 0
  const handleCopy = () => {
    if (textAreaRef.current === null || code !== textAreaRef.current.value) {
      toast(
        ToastOptions.createDestructive()
          .setTitle("Error")
          .setDescription("An error occurred while copying the code"),
      )
      return
    }
    textAreaRef.current?.focus()
    textAreaRef.current?.select()
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
            <Textarea
              ref={textAreaRef}
              onClick={(e) => e.currentTarget.select()}
              value={canCopy ? code : "Your watchlist is empty"}
              className="!resize-none"
              readOnly
              placeholder="Paste your watchlist code here"
            ></Textarea>
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
