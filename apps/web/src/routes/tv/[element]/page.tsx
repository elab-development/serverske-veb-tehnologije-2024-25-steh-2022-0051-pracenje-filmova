import { SortValue } from "@/lib/api-sorters"
import { defaultFilterLinks } from "@/lib/default-filter-links"
import { AppError } from "@/lib/models/app-error"
import { useState } from "react"
import { useParams } from "react-router-dom"
import AiringTodayShows from "./_sections/airing_today"
import DiscoverTv from "./_sections/discover"
import OnTheAirShows from "./_sections/on_the_air"
import PopularShows from "./_sections/popular"
import TopRatedShows from "./_sections/top_rated"

const elements: Record<
  keyof (typeof defaultFilterLinks)["tv"],
  React.FC<{ sort?: SortValue }>
> = {
  discover: DiscoverTv,
  popular: PopularShows,
  airing_today: AiringTodayShows,
  on_the_air: OnTheAirShows,
  top_rated: TopRatedShows,
}

const ExploreTvShows = () => {
  const { element } = useParams<{
    element: keyof (typeof defaultFilterLinks)["tv"]
  }>()
  const [sortBy] = useState<SortValue>("popularity.desc")

  if (!element || !elements[element]) throw new AppError("Unknown route")

  const Component = elements[element]
  return <Component sort={sortBy} />
}

export default ExploreTvShows
