import { cn } from "@/lib/utils"
import { Separator } from "@radix-ui/react-separator"
import { HeartIcon } from "lucide-react"
import { Button } from "./ui/button"
import { genreVariants } from "./ui/genre-badge"

const LoadingMediaSingle = ({ statsNumber = 5 }: { statsNumber?: number }) => {
  return (
    <section aria-hidden className="animate-pulse">
      <div className="relative mb-8">
        <div className="aspect-video w-full bg-secondary object-cover" />
      </div>
      <div className="flex w-full flex-col gap-8 xl:flex-row">
        <div className="max-xl:order-2 xl:max-w-sm xl:flex-1">
          <div
            className={
              "mx-auto hidden aspect-[2/3] w-full max-w-sm bg-secondary xl:mx-0 xl:block"
            }
          />
          <dl className="space-y-8 py-8">
            {Array(statsNumber || 5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <dt className="w-full max-w-24 bg-secondary text-sm font-bold uppercase text-muted-foreground">
                    &nbsp;
                  </dt>
                  <dd
                    className={cn(
                      "w-full bg-secondary text-base",
                      i % 2 == 0 ? "max-w-52" : "max-w-44",
                    )}
                  >
                    &nbsp;
                  </dd>
                </div>
              ))}
          </dl>
        </div>
        <div className="space-y-4 xl:flex-1">
          <h1 className="w-full max-w-md bg-secondary text-2xl font-bold md:text-3xl lg:text-4xl xl:text-5xl">
            &nbsp;
          </h1>
          <span className="!mt-2 inline-block w-full max-w-24 bg-secondary font-bold text-muted-foreground">
            &nbsp;
          </span>
          <div className="space-x-2">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <span
                  className={cn(
                    genreVariants({ size: "lg" }),
                    "pointer-events-none w-full max-w-16",
                  )}
                  key={i}
                >
                  &nbsp;
                </span>
              ))}
          </div>
          <p className="!mt-8 max-w-xl flex-1 space-y-1 text-foreground/80">
            <span className="inline-block w-full max-w-sm bg-secondary">
              &nbsp;
            </span>
            <br />
            <span className="inline-block w-full max-w-lg bg-secondary">
              &nbsp;
            </span>
            <br />
            <span className="inline-block w-full max-w-md bg-secondary">
              &nbsp;
            </span>
          </p>
          <div className="!mt-8">
            <Button
              aria-disabled
              aria-hidden
              variant={"secondary"}
              className="pointer-events-none text-transparent"
            >
              <HeartIcon height={"1em"} className={"opacity-0"} />
              Add to watchlist
            </Button>
          </div>
        </div>
        <Separator className="xl:hidden" />
      </div>
    </section>
  )
}

export default LoadingMediaSingle
