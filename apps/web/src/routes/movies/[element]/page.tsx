import { defaultFilterLinks } from "@/lib/default-filter-links"
import { AppError } from "@/lib/models/app-error"
import { useParams } from "react-router-dom"
import DiscoverMovies from "./_sections/discover"
import NowPlayingMovies from "./_sections/now_playing"
import PopularMovies from "./_sections/popular"
import TopRatedMovies from "./_sections/top_rated"
import UpcomingMovies from "./_sections/upcoming"

const elements: Record<keyof (typeof defaultFilterLinks)["movies"], React.FC> =
  {
    popular: PopularMovies,
    now_playing: NowPlayingMovies,
    top_rated: TopRatedMovies,
    upcoming: UpcomingMovies,
    discover: DiscoverMovies,
  }

const ExploreMovies = () => {
  const { element } = useParams<{
    element: keyof (typeof defaultFilterLinks)["movies"]
  }>()

  if (!element || !elements[element]) throw new AppError("Unknown route")

  const Component = elements[element]
  return <Component />
}

export default ExploreMovies
