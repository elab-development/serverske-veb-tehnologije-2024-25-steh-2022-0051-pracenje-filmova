import { Button } from "@/components/ui/button"
import { useSetPageTitle } from "@/hooks/use-set-page-title"
import { ChevronLeftIcon } from "lucide-react"
import { Link } from "react-router-dom"

const NotFound = () => {
  useSetPageTitle("Not Found")
  return (
    <div className="grid h-[calc(100vh-5rem)] place-items-center lg:h-[calc(100vh-5.5rem)]">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold lg:text-4xl xl:text-5xl">404</h1>
        <p className="max-w-96 text-center">Page not found</p>
        <Button asChild className="mt-4">
          <Link to="/">
            <ChevronLeftIcon className="mr-2 h-5 w-5" /> Go back to home
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default NotFound
