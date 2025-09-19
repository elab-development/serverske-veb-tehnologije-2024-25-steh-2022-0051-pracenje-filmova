import { useSetPageTitle } from "@/hooks/use-set-page-title"
import TrendingMovies from "@/routes/home/_components/trending/movies"
import TrendingTv from "./_components/trending/tv-shows"

const Home = () => {
  useSetPageTitle("Home")
  return (
    <div className="space-y-32">
      <TrendingMovies />
      <TrendingTv />
    </div>
  )
}

export default Home
