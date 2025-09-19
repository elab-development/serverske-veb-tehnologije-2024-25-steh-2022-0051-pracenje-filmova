import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useGenres } from "@/hooks/use-genres"
import { useWindowResize } from "@/hooks/use-window-size"
import { defaultFilterLinks } from "@/lib/default-filter-links"
import { cn } from "@/lib/utils"
import { Root as VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { ClapperboardIcon, LucideIcon, MenuIcon, TvIcon } from "lucide-react"
import { useState } from "react"
import { NavLink } from "react-router-dom"
import { Genres } from "tmdb-ts/dist/endpoints"

const useSidebar = () => {
  const { movieGenres, tvGenres } = useGenres()

  const genresLoading = movieGenres.isLoading || tvGenres.isLoading

  const groups: Array<
    [string, string, Genres | undefined, LucideIcon, Record<string, string>]
  > = [
    [
      "Movies",
      "/movies",
      movieGenres.data,
      ClapperboardIcon,
      defaultFilterLinks.movies,
    ],
    ["TV Shows", "/tv", tvGenres.data, TvIcon, defaultFilterLinks.tv],
  ]

  return { groups, genresLoading }
}

export const Sidebar = () => {
  const { groups, genresLoading } = useSidebar()

  return (
    <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
      <ScrollArea className="relative h-full overflow-hidden py-6 pr-6 lg:py-8">
        {!genresLoading ? (
          groups.map(([title, linkPrefix, genres, Icon, defaultLinks], i) => (
            <div
              key={i}
              className="flex w-full flex-col pb-6 pt-6 first:pt-0 last:pb-0"
            >
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold uppercase">
                <Icon stroke="currentColor" />
                {title}
              </h2>
              <ul className="flex w-full flex-col space-y-2">
                {Object.entries(defaultLinks).map(([link, name]) => (
                  <li key={name}>
                    <NavLink
                      to={`${linkPrefix}/${link}`}
                      className={({ isActive }) =>
                        cn(
                          "text-sm text-muted-foreground underline-offset-2 hover:underline",
                          isActive && "text-primary",
                        )
                      }
                    >
                      {name}
                    </NavLink>
                  </li>
                ))}
              </ul>
              <Separator className="!my-4" />
              <ul className="flex w-full flex-col space-y-2">
                {genres?.genres.map((genre) => (
                  <li key={genre.id}>
                    <NavLink
                      to={`/genre${linkPrefix}/${genre.id}`}
                      className={({ isActive }) =>
                        cn(
                          "text-sm text-muted-foreground underline-offset-2 hover:underline",
                          isActive && "text-primary",
                        )
                      }
                    >
                      {genre.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <SidebarLoader />
        )}
      </ScrollArea>
    </aside>
  )
}
const MD_BREAKPOINT = 768
export const MobileSidebar = () => {
  const { groups, genresLoading } = useSidebar()
  const [open, setOpen] = useState(false)
  const [w] = useWindowResize()
  return w >= MD_BREAKPOINT ? null : (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="outline" size={"icon"}>
          <MenuIcon height={"1.25em"} />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="pb-8 pt-14 md:hidden">
        <VisuallyHidden>
          <SheetHeader>
            <SheetTitle>Navigation sidebar</SheetTitle>
            <SheetDescription>
              Browse our pages for more movies and TV Shows
            </SheetDescription>
          </SheetHeader>
        </VisuallyHidden>
        <ScrollArea className="relative h-full overflow-hidden pr-6 lg:py-8">
          {!genresLoading ? (
            groups.map(([title, linkPrefix, genres, Icon, defaultLinks], i) => (
              <div
                key={i}
                className="flex w-full flex-col pb-6 pt-6 first:pt-0 last:pb-0"
              >
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold uppercase">
                  <Icon stroke="currentColor" />
                  {title}
                </h2>
                <ul className="flex w-full flex-col space-y-2">
                  {Object.entries(defaultLinks).map(([link, name]) => (
                    <li key={name}>
                      <NavLink
                        onClick={() => setOpen(false)}
                        to={`${linkPrefix}/${link}`}
                        className={({ isActive }) =>
                          cn(
                            "text-sm text-muted-foreground underline-offset-2 hover:underline",
                            isActive && "text-primary",
                          )
                        }
                      >
                        {name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
                <Separator className="!my-4" />
                <ul className="flex w-full flex-col space-y-2">
                  {genres?.genres.map((genre) => (
                    <li key={genre.id}>
                      <NavLink
                        onClick={() => setOpen(false)}
                        to={`/genre${linkPrefix}/${genre.id}`}
                        className={({ isActive }) =>
                          cn(
                            "text-sm text-muted-foreground underline-offset-2 hover:underline",
                            isActive && "text-primary",
                          )
                        }
                      >
                        {genre.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <SidebarLoader />
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

const SidebarLoader = () =>
  [1, 2].map((_, i) => (
    <div
      key={i}
      className="flex w-full flex-col pb-6 pt-6 first:pt-0 last:pb-0"
      aria-hidden
    >
      <span className="animate-pusle mb-4 flex items-center gap-2 bg-secondary text-lg font-bold uppercase">
        &nbsp;
      </span>
      <ul className="flex w-full flex-col space-y-2">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <li key={i} className="w-5/6 animate-pulse bg-secondary">
              <span className="text-sm text-muted-foreground">&nbsp;</span>
            </li>
          ))}
      </ul>
      <Separator className="!my-4" />
      <ul className="flex w-full flex-col space-y-2">
        {Array(15)
          .fill(0)
          .map((_, i) => (
            <li key={i} className="w-4/6 animate-pulse bg-secondary">
              <span className="text-sm text-muted-foreground">&nbsp;</span>
            </li>
          ))}
      </ul>
    </div>
  ))
