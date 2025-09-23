import { TMDBProvider } from "@/hooks/use-tmdb"
import LoginPage from "@/routes/auth/login/page"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Suspense, lazy } from "react"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Layout from "./components/layout/layout"
import { queryClient } from "./lib/trpc"
import SignUpPage from "./routes/auth/signup/page"
import ErrorRoute from "./routes/error"
import NotFound from "./routes/not-found"
import ReportPage from "./routes/report/page"
import SearchPage from "./routes/search/page"
import ExploreTvShows from "./routes/tv/[element]/page"
import TVSingle from "./routes/tv/id/[id]/page"
const Home = lazy(() => import("@/routes/home/page"))
const WatchlistPage = lazy(() => import("@/routes/watchlist/page"))
const MovieSingle = lazy(() => import("@/routes/movie/id/[id]/page"))
const GenreMovies = lazy(() => import("@/routes/genre/movies/[id]/page"))
const GenreTv = lazy(() => import("@/routes/genre/tv/[id]/page"))
const ExploreMovies = lazy(() => import("@/routes/movies/[element]/page"))

// const qc = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorRoute />,
    children: [
      {
        path: "/",
        element: (
          <Suspense
            fallback={null}
            // fallback={<LoaderPinwheelIcon className="animate-spin h-12 w-12" />}
          >
            <Home />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: <NotFound />,
      },
      {
        path: "/search",
        element: (
          <Suspense fallback={null}>
            <SearchPage />
          </Suspense>
        ),
      },
      {
        path: "/watchlist",
        element: (
          <Suspense fallback={null}>
            <WatchlistPage />
          </Suspense>
        ),
      },
      {
        path: "/movie/id/:id",
        element: (
          <Suspense fallback={null}>
            <MovieSingle />
          </Suspense>
        ),
      },
      {
        path: "/tv/id/:id",
        element: (
          <Suspense fallback={null}>
            <TVSingle />
          </Suspense>
        ),
      },
      {
        path: "/genre/tv/:id",
        element: (
          <Suspense fallback={null}>
            <GenreTv />
          </Suspense>
        ),
      },
      {
        path: "/genre/movies/:id",
        element: (
          <Suspense fallback={null}>
            <GenreMovies />
          </Suspense>
        ),
      },
      {
        path: "/movies/:element",
        element: (
          <Suspense fallback={null}>
            <ExploreMovies />
          </Suspense>
        ),
      },
      {
        path: "/tv/:element",
        element: (
          <Suspense fallback={null}>
            <ExploreTvShows />
          </Suspense>
        ),
      },
      {
        path: "/auth/login",
        element: (
          <Suspense fallback={null}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: "/auth/signup",
        element: (
          <Suspense fallback={null}>
            <SignUpPage />
          </Suspense>
        ),
      },
      {
        path: "/report",
        element: (
          <Suspense fallback={null}>
            <ReportPage />
          </Suspense>
        ),
      },
    ],
  },
])

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TMDBProvider>
        <RouterProvider router={router} />
      </TMDBProvider>
      {import.meta.env.DEV && <ReactQueryDevtools />}
    </QueryClientProvider>
  )
}

export default App
