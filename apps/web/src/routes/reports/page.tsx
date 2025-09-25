import PaginationBar from "@/components/pagination-bar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import SectionTitle from "@/components/ui/section-title"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import usePageNumber from "@/hooks/use-page-number"
import { useProtectedPage } from "@/hooks/use-protected-page"
import { useSetPageTitle } from "@/hooks/use-set-page-title"
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes"
import { trpc } from "@/lib/trpc"
import { cn } from "@/lib/utils"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import type { BugFlagEnum } from "backend"
import { SearchIcon } from "lucide-react"
import ReportContentDialog from "./_components/report-content-dialog"
import StatusSelect from "./_components/status-select"
import { bugFlagEnum } from "./new/page"

const sortVars = ["createdAt", "title"] as const

const sortNames: Record<(typeof sortVars)[number], string> = {
  createdAt: "Creation date",
  title: "Title",
}

const flagColors: Record<BugFlagEnum, string> = {
  Backend: "bg-violet-800 text-violet-100", // something other than red or green
  UI: "bg-blue-800 text-blue-100",
  Performance: "bg-pink-800 text-pink-100",
  Security: "bg-yellow-800 text-yellow-100",
  Other: "bg-gray-800 text-gray-100",
}

const AllReportsPage = () => {
  useSetPageTitle("All bug reports")
  const { session } = useProtectedPage("admin")
  const { pageNumber, setPageNumber } = usePageNumber()

  const filters = useUnsavedChanges<{
    sortBy: (typeof sortVars)[number]
    flag?: BugFlagEnum
    sortOrder: "asc" | "desc"
    limit: number
    status?: "resolved" | "unresolved"
    resolvedByAdmin: boolean
    id?: string
  }>({
    sortBy: "createdAt",
    flag: undefined,
    sortOrder: "desc",
    limit: 10,
    status: undefined,
    resolvedByAdmin: false,
    id: undefined,
  })

  const { data, isPending, error } = useQuery(
    trpc.reports.getAllReports.queryOptions({
      limit: filters.state.limit,
      offset: (pageNumber - 1) * filters.state.limit,
      sortBy: filters.state.sortBy,
      sortOrder: filters.state.sortOrder,
      flag: filters.state.flag,
      status: filters.state.status,
      adminId: filters.state.resolvedByAdmin ? session?.user?.id : undefined,
      id: filters.state.id,
    }),
  )

  const queryClient = useQueryClient()

  const onMutate = (reportId: string, newStatus: "resolved" | "unresolved") => {
    if (!data || !session?.user) return
    queryClient.setQueryData(
      trpc.reports.getAllReports.queryKey({
        limit: filters.state.limit,
        offset: (pageNumber - 1) * filters.state.limit,
        sortBy: filters.state.sortBy,
        sortOrder: filters.state.sortOrder,
        flag: filters.state.flag,
        status: filters.state.status,
        adminId: filters.state.resolvedByAdmin ? session?.user?.id : undefined,
        id: filters.state.id,
      }),
      (oldData) =>
        oldData && oldData.reports
          ? {
              ...oldData,
              reports: oldData.reports.map((r) =>
                r.id === reportId
                  ? {
                      ...r,
                      status: newStatus,
                      adminName:
                        newStatus === "resolved" ? session.user.name : null,
                    }
                  : r,
              ),
            }
          : oldData,
    )
  }

  if (!session?.user) return null
  return (
    <section>
      <SectionTitle>All reports</SectionTitle>
      <Separator className="my-2" />
      <form
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault()
          filters.saveChanges()
          setPageNumber(1)
        }}
      >
        <ScrollArea className="whitespace-nowrap pb-2">
          <div className="mb-2 flex flex-col gap-2">
            <div className="flex flex-col gap-2 sm:flex-row md:gap-4">
              <div>
                <Label htmlFor="status">ID</Label>
                <div className="relative w-44">
                  <Input
                    autoComplete="off"
                    onChange={(v) =>
                      filters.setUnsavedChanges((f) => ({
                        ...f,
                        id:
                          v.target.value.length === 0
                            ? undefined
                            : v.target.value,
                      }))
                    }
                    defaultValue={filters.state.id ?? ""}
                    placeholder="Report ID"
                  />

                  <Button
                    disabled={true}
                    variant={"ghost"}
                    size={"icon"}
                    className="absolute right-0 top-0 h-full"
                  >
                    <SearchIcon height={"1em"} />
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="flag">Flag</Label>
                <Select
                  defaultValue={"any"}
                  onValueChange={(v) =>
                    filters.setUnsavedChanges((f) => ({
                      ...f,
                      flag: v === "any" ? undefined : (v as BugFlagEnum),
                    }))
                  }
                >
                  <SelectTrigger className="w-44" id="flag">
                    <SelectValue placeholder="Select flag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem key={"any"} value={"any"}>
                        Any
                      </SelectItem>
                      {bugFlagEnum.map((s) => (
                        <SelectItem key={s} value={s} className="">
                          <span className="flex h-full items-center gap-2">
                            <span
                              className={cn(
                                "inline-block size-2 rounded-full",
                                flagColors[s],
                              )}
                            ></span>{" "}
                            {s}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  defaultValue={filters.state.status}
                  onValueChange={(v) =>
                    filters.setUnsavedChanges((f) => ({
                      ...f,
                      status: v === "any" ? undefined : (v as typeof f.status),
                    }))
                  }
                >
                  <SelectTrigger className="w-44" id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={"any"}>Any</SelectItem>
                      <SelectItem value={"resolved"}>Resolved</SelectItem>
                      <SelectItem value={"unresolved"}>Unresolved</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Separator className="my-2" />
            <div className="flex flex-col gap-2 sm:flex-row md:gap-4">
              <div>
                <Label htmlFor="sort_by">Sort by</Label>
                <Select
                  defaultValue={filters.state.sortBy}
                  onValueChange={(v) =>
                    filters.setUnsavedChanges((f) => ({
                      ...f,
                      sortBy: v as typeof f.sortBy,
                    }))
                  }
                >
                  <SelectTrigger className="w-44" id="sort_by">
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {sortVars.map((s) => (
                        <SelectItem key={s} value={s}>
                          {sortNames[s]
                            ? sortNames[s]
                            : s.charAt(0).toUpperCase() + s.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="direction">Direction</Label>
                <Select
                  defaultValue={filters.state.sortOrder}
                  onValueChange={(v) =>
                    filters.setUnsavedChanges((f) => ({
                      ...f,
                      sortOrder: v as typeof f.sortOrder,
                    }))
                  }
                >
                  <SelectTrigger className="w-44" id="direction">
                    <SelectValue placeholder="Select order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={"asc"}>Ascending</SelectItem>
                      <SelectItem value={"desc"}>Descending</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <div>
          <Button type="submit">Apply filters</Button>
        </div>
      </form>
      <Separator className="mb-12 mt-2" />
      <div>
        <div>
          <ScrollArea className="w-full whitespace-nowrap pb-4 md:pb-8">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Flag</TableHead>
                  <TableHead>Created at</TableHead>
                  <TableHead>Resolved by</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="min-h-56">
                {data?.reports &&
                  data.reports.length > 0 &&
                  data.reports.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="overflow-ellipsis whitespace-nowrap font-medium">
                        {r.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>{r.title}</TableCell>
                      <TableCell>
                        <ReportContentDialog title={r.title} id={r.id}>
                          {r.content}
                        </ReportContentDialog>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={"outline"}
                          className={flagColors[r.flag]}
                        >
                          {r.flag}
                        </Badge>
                      </TableCell>
                      <TableCell className="min-w-40">
                        {new Date(r.createdAt).toLocaleString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell>
                        {r.adminName ? (
                          r.adminName
                        ) : (
                          <span className="text-muted-foreground">NULL</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <StatusSelect
                          reportId={r.id}
                          currentStatus={r.status}
                          onMutate={onMutate}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                {data?.reports &&
                  filters.state.limit - data.reports.length > 0 &&
                  Array.from({
                    length: filters.state.limit - data.reports.length,
                  }).map((_, i) => (
                    <TableRow
                      key={`empty-${i}`}
                      className="pointer-events-none h-14"
                    >
                      <TableCell colSpan={7} />
                    </TableRow>
                  ))}
                {!error &&
                  isPending &&
                  Array.from({ length: filters.state.limit }).map((_, i) => (
                    <TableRow
                      key={`loading-${i}`}
                      className="pointer-events-none h-14 opacity-50"
                    >
                      <TableCell
                        colSpan={7}
                        style={{
                          animationDelay: `${i * 150}ms`,
                        }}
                        className="animate-pulse bg-secondary"
                      />
                    </TableRow>
                  ))}
                {error && !data && !isPending && (
                  <TableRow className="h-14">
                    <TableCell colSpan={7} className="text-center">
                      <span className="text-destructive">
                        Error loading reports: {error.message}
                      </span>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" className="md:h-4" />
          </ScrollArea>
          {data && data.reports.length > 0 && (
            <p className="mt-4 block w-full text-center text-sm text-muted-foreground">
              {`Showing ${(pageNumber - 1) * filters.state.limit + 1}-${Math.min(
                pageNumber * filters.state.limit,
                data.totalReports,
              )} of ${data.totalReports} reports`}
            </p>
          )}
        </div>

        <Separator className="my-12" />
        {data && <PaginationBar total_pages={data.numberOfPages || 1} />}
      </div>
    </section>
  )
}

export default AllReportsPage
