import { useTMDB } from "@/hooks/use-tmdb"
import { useQuery } from "@tanstack/react-query"

import MediaItem from "@/components/media-item"
import MediaItemLoader from "@/components/media-item-loader"
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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useSetPageTitle } from "@/hooks/use-set-page-title"
import { SortValue, sortNames } from "@/lib/api-sorters"
import { AppError } from "@/lib/models/app-error"
import { useRef, useState } from "react"

const DiscoverMovies = () => {
  useSetPageTitle("Discover Movies")
  const sortRef = useRef<SortValue>("popularity.desc")
  const [sortBy, setSortBy] = useState<SortValue>("popularity.desc")

  const yearRef = useRef<HTMLInputElement>(null)
  const [year, setYear] = useState<number | undefined>(undefined)

  const voteRef = useRef<HTMLInputElement>(null)
  const [voteAvg, setVoteAvg] = useState<number | undefined>(undefined)
  const tmdb = useTMDB()
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      "movies",
      "discover",
      {
        sortBy,
        year: year ?? null,
        voteAvg: voteAvg ?? null,
      },
    ],
    queryFn: () =>
      tmdb.discover.movie({
        sort_by: sortBy,
        year: year,
        "vote_average.gte": voteAvg,
      }),
    staleTime: 1000 * 60 * 5, // 5 min
  })
  if (isError) {
    throw new AppError(error)
  }

  return (
    <section>
      <SectionTitle>Discover movies</SectionTitle>
      <Separator className="my-2" />
      <form
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault()
          yearRef.current?.valueAsNumber &&
            setYear(yearRef.current?.valueAsNumber)
          voteRef.current?.valueAsNumber &&
            setVoteAvg(voteRef.current?.valueAsNumber)
          setSortBy(sortRef.current)
        }}
      >
        <ScrollArea className="whitespace-nowrap pb-2">
          <div className="mb-2 flex flex-col gap-2 sm:flex-row md:gap-4">
            <div>
              <Label htmlFor="sort_by">Sort by</Label>
              <Select
                defaultValue="popularity.desc"
                onValueChange={(v) => (sortRef.current = v as SortValue)}
              >
                <SelectTrigger className="w-44" id="sort_by">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Sort by</SelectLabel>
                    {Object.entries(sortNames).map(([value, label]) =>
                      value.includes(".desc") ? (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ) : null,
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="year">Before year</Label>
              <Input
                ref={yearRef}
                id="year"
                type="number"
                className="w-44"
                max={new Date().getFullYear() ?? 2024}
              />
            </div>
            <div>
              <Label htmlFor="vote">Minimum rating</Label>
              <Input
                ref={voteRef}
                id="vote"
                type="number"
                className="w-44"
                min={0}
                max={10}
              />
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <div>
          <Button type="submit">Apply filters</Button>
        </div>
      </form>

      <Separator className="mb-12 mt-2" />

      <div className="flex flex-wrap justify-center gap-6 gap-y-8">
        {isLoading ? (
          Array(20)
            .fill(0)
            .map((_, i) => (
              // placeholder for MediaItem
              <MediaItemLoader key={i} />
            ))
        ) : data?.results && data?.results.length > 0 ? (
          data?.results.map((movie) => (
            <MediaItem key={movie.id} mediaType="movie" data={movie} />
          ))
        ) : (
          <p>No movies found</p>
        )}
      </div>
    </section>
  )
}

export default DiscoverMovies
