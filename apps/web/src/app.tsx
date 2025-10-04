import { TMDBProvider } from "@/hooks/use-tmdb"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Suspense, lazy } from "react"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Layout from "./components/layout/layout"
import { queryClient } from "./lib/trpc"
const LoginPage = lazy(() => import("@/routes/auth/login/page"))
const ForgotPasswordPage = lazy(
  () => import("@/routes/auth/forgot-password/page"),
)
const ResetPasswordPage = lazy(
  () => import("@/routes/auth/reset-password/page"),
)
const SignUpPage = lazy(() => import("@/routes/auth/signup/page"))
const ErrorRoute = lazy(() => import("@/routes/error"))
const NotFound = lazy(() => import("@/routes/not-found"))
const ReportPage = lazy(() => import("@/routes/reports/new/page"))
const AllReportsPage = lazy(() => import("@/routes/reports/page"))
const SearchPage = lazy(() => import("@/routes/search/page"))
const ExploreTvShows = lazy(() => import("@/routes/tv/[element]/page"))
const TVSingle = lazy(() => import("@/routes/tv/id/[id]/page"))
const Home = lazy(() => import("@/routes/home/page"))
const WatchlistPage = lazy(() => import("@/routes/watchlist/page"))
const MovieSingle = lazy(() => import("@/routes/movie/id/[id]/page"))
const GenreMovies = lazy(() => import("@/routes/genre/movies/[id]/page"))
const GenreTv = lazy(() => import("@/routes/genre/tv/[id]/page"))
const ExploreMovies = lazy(() => import("@/routes/movies/[element]/page"))

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorRoute />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={null}>
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
        path: "/auth/forgot-password",
        element: (
          <Suspense fallback={null}>
            <ForgotPasswordPage />
          </Suspense>
        ),
      },
      {
        path: "/auth/reset-password",
        element: (
          <Suspense fallback={null}>
            <ResetPasswordPage />
          </Suspense>
        ),
      },
      {
        path: "/reports/new",
        element: (
          <Suspense fallback={null}>
            <ReportPage />
          </Suspense>
        ),
      },
      {
        path: "/reports",
        element: (
          <Suspense fallback={null}>
            <AllReportsPage />
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
