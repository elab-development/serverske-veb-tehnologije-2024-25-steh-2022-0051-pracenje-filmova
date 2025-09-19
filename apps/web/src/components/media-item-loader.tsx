// const MediaItemLoader = () => {
//   return <div className="h-72 w-48 animate-pulse bg-secondary"></div>
// }

import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { genreVariants } from "./ui/genre-badge"

const MediaItemLoader = () => {
  return (
    <div
      className={
        "pointer-events-none flex min-h-full w-full max-w-48 select-none flex-col justify-between gap-4"
      }
    >
      <div className="space-y-4">
        <div className="group relative w-full">
          <div className="h-72 w-48 bg-secondary" />
          <p className="mt-4 text-base font-semibold">
            <span className="inline-block w-full whitespace-normal bg-secondary">
              &nbsp;
            </span>
          </p>
        </div>

        <div className="space-y-2">
          <span
            className="mt-2 inline-block bg-secondary text-sm font-bold text-transparent"
            aria-hidden
          >
            2024
          </span>

          <div className="mt-1 flex flex-wrap gap-1">
            <span
              className={cn(
                genreVariants({ size: "sm" }),
                "pointer-events-none w-full max-w-24 rounded-none",
              )}
            >
              &nbsp;
            </span>
            <span
              className={cn(
                genreVariants({ size: "sm" }),
                "pointer-events-none w-full max-w-16 rounded-none",
              )}
            >
              &nbsp;
            </span>
            <span
              className={cn(
                genreVariants({ size: "sm" }),
                "pointer-events-none w-full max-w-12 rounded-none",
              )}
            >
              &nbsp;
            </span>
          </div>
        </div>
      </div>
      <div className="flex">
        <Button
          aria-disabled
          aria-hidden
          size={"sm"}
          variant={"secondary"}
          className="pointer-events-none flex-1 bg-secondary text-lg text-transparent"
        ></Button>
      </div>
    </div>
  )
}

export default MediaItemLoader
