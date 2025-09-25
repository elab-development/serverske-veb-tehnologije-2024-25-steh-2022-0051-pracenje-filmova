import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { trpc } from "@/lib/trpc"
import { cn } from "@/lib/utils"
import { useMutation } from "@tanstack/react-query"
import { CheckIcon, XIcon } from "lucide-react"
import { useState } from "react"

const StatusSelect = ({
  reportId,
  currentStatus,
  onMutate,
}: {
  reportId: string
  currentStatus: "resolved" | "unresolved"
  onMutate?: (id: string, newStatus: "resolved" | "unresolved") => void
}) => {
  const [status, setStatus] = useState(currentStatus)
  const changeStatusMutation = useMutation(
    trpc.reports.changeReportStatus.mutationOptions({
      onMutate: (data) => {
        setStatus(data.status ? "resolved" : "unresolved")
        onMutate?.(reportId, data.status ? "resolved" : "unresolved")
      },
      onError: (error) => {
        alert("Failed to change status: " + error.message)
      },
    }),
  )
  return (
    <Select
      defaultValue={currentStatus}
      disabled={changeStatusMutation.isPending}
      onValueChange={(v) =>
        changeStatusMutation.mutate({ reportId, status: v === "resolved" })
      }
    >
      <SelectTrigger
        className={cn(
          "h-auto gap-2",
          status === "resolved" ? "focus:ring-green-500" : "focus:ring-red-500",
        )}
      >
        <SelectValue placeholder="Unset" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={"resolved"}>
          <span className="flex h-full items-center gap-2">
            <span className="inline-flex size-4 items-center justify-center rounded-full bg-green-500 p-0.5 text-green-950">
              <CheckIcon />
            </span>{" "}
            Resolved
          </span>
        </SelectItem>
        <SelectItem value={"unresolved"}>
          <span className="flex h-full items-center gap-2">
            <span className="inline-flex size-4 items-center justify-center rounded-full bg-red-500 p-0.5 text-red-950">
              <XIcon />
            </span>{" "}
            Unresolved
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}

export default StatusSelect
