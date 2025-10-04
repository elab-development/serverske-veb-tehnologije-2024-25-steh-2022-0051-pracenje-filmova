import { ArrayElement } from "@/lib/type-helpers"
import { cn } from "@/lib/utils"
import { VariantProps, cva } from "class-variance-authority"
import { Link } from "react-router-dom"
import { Genres } from "tmdb-ts/dist/endpoints"

export const genreVariants = cva(
  " text-muted-foreground p-0.5 inline-block bg-muted rounded-full px-2 hover:outline hover:outline-1 hover:outline-primary",
  {
    variants: {
      size: {
        sm: "text-sm ",
        lg: "text-sm lg:text-base",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  },
)

const GenreBadge = ({
  genre,
  mediaType,
  size = "sm",
}: {
  genre: ArrayElement<Genres["genres"]>
  mediaType: string
} & VariantProps<typeof genreVariants>) => {
  return (
    <Link
      to={`/genre/${mediaType === "movie" ? "movies" : "tv"}/${genre.id}`}
      key={genre.id}
      className={cn(genreVariants({ size }))}
    >
      {genre.name}
    </Link>
  )
}

export default GenreBadge
