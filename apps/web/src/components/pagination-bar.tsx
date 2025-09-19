import { Button } from "@/components/ui/button"
import usePageNumber from "@/hooks/use-page-number"
import { AppError } from "@/lib/models/app-error"
import { cn } from "@/lib/utils"
import { ChevronLeftIcon, ChevronRightIcon, EllipsisIcon } from "lucide-react"

const PaginationBar = ({ total_pages }: { total_pages: number }) => {
  const { pageNumber, setPageNumber } = usePageNumber()
  if (!total_pages || total_pages < 0 || pageNumber > total_pages)
    throw new AppError("Invalid page number")

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        disabled={pageNumber <= 1}
        onClick={() => {
          pageNumber > 1 && setPageNumber(pageNumber - 1)
        }}
        size={"icon"}
        aria-label="Previous page"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </Button>
      {total_pages && pageNumber > 2 && <EllipsisIcon className="h-5 w-5" />}
      {total_pages &&
        [-1, 0, 1].map(
          (i) =>
            !(pageNumber + i < 1 || pageNumber + i > total_pages) && (
              <Button
                variant={"outline"}
                key={i}
                onClick={() => {
                  setPageNumber(pageNumber + i)
                }}
                aria-label={"Go to page " + (pageNumber + i)}
                size={"icon"}
                className={cn(i == 0 && "border-primary")}
                disabled={pageNumber + i < 1 || pageNumber + i > total_pages}
              >
                {pageNumber + i}
              </Button>
            ),
        )}
      {total_pages && pageNumber < total_pages - 2 && (
        <EllipsisIcon className="h-5 w-5" />
      )}
      {total_pages && pageNumber < total_pages && (
        <Button
          disabled={pageNumber >= total_pages}
          onClick={() => {
            total_pages &&
              pageNumber < total_pages &&
              setPageNumber(pageNumber + 1)
          }}
          aria-label="Next page"
          size={"icon"}
        >
          <ChevronRightIcon className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}

export default PaginationBar
