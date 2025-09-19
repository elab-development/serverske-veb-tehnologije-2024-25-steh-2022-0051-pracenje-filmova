import Layout from "@/components/layout/layout"
import { Button } from "@/components/ui/button"
import { useSetPageTitle } from "@/hooks/use-set-page-title"
import { AppError } from "@/lib/models/app-error"
import { ChevronLeftIcon } from "lucide-react"
import { Link, useRouteError } from "react-router-dom"

const ErrorRoute = () => {
  useSetPageTitle("Error")
  const error = useRouteError() as Error | AppError
  return (
    <Layout>
      <div className="grid h-[calc(100vh-5rem)] place-items-center lg:h-[calc(100vh-5.5rem)]">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-3xl font-bold lg:text-4xl xl:text-5xl">Error</h1>
          <p className="max-w-96 text-center">
            {error instanceof AppError ? error.status_message : error.message}
          </p>
          <Button asChild className="mt-4">
            <Link to="/">
              <ChevronLeftIcon className="mr-2 h-5 w-5" />
              Go back to home
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  )
}

export default ErrorRoute
