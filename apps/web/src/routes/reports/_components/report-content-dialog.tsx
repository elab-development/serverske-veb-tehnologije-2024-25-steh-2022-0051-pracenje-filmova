import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ReceiptTextIcon } from "lucide-react"

const ReportContentDialog = ({
  children,
  title,
  id,
}: {
  children: React.ReactNode
  title: string
  id: string
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size={"icon"}>
          <span className="sr-only">View report content</span>
          <ReceiptTextIcon className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogTitle>{title}</DialogTitle>
        <p className="text-sm font-medium text-muted-foreground">{id}</p>
        <div className="max-h-[70vh] overflow-y-auto border p-4">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ReportContentDialog
